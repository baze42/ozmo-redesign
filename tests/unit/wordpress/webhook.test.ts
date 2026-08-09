import { createHmac } from 'node:crypto';

import { getTableColumns, getTableName } from 'drizzle-orm';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { rebuildEvents } from '../../../src/lib/db/schema';
import { buildAdminBuildFailureEmail } from '../../../src/emails/admin-alert-build-failure';
import {
  WordPressWebhookError,
  configureRebuildProcessor,
  createInMemoryRebuildEventStore,
  createInMemoryRebuildLockStore,
  createRebuildProcessor,
  enqueueRebuildEvent,
  processDueRebuildEvents,
  verifyWordPressWebhook,
  type WordPressWebhookPayload,
} from '../../../src/lib/wordpress/webhook';
import { POST as processRebuildsPost } from '../../../src/pages/api/cron/process-rebuilds';
import { POST as wordpressWebhookPost } from '../../../src/pages/api/webhooks/wordpress';

const secret = 'test-wordpress-webhook-secret';
const basePayload = {
  content_type: 'post',
  content_id: 42,
  slug: 'why-website-speed-affects-leads',
  status: 'publish',
  transition: 'draft->publish',
  timestamp: '2026-08-09T12:00:00.000Z',
};

afterEach(() => {
  configureRebuildProcessor(null);
  vi.unstubAllEnvs();
});

describe('rebuild events schema', () => {
  it('defines the Postgres rebuild_events table required by webhook processing', () => {
    expect(getTableName(rebuildEvents)).toBe('rebuild_events');
    expect(Object.keys(getTableColumns(rebuildEvents)).sort()).toEqual([
      'buildDurationMs',
      'contentId',
      'contentType',
      'deployFinishedAt',
      'deployResponseStatus',
      'deployStartedAt',
      'error',
      'eventHash',
      'id',
      'longBuildReviewRequired',
      'payload',
      'processedAt',
      'receivedAt',
      'scheduledAt',
      'slug',
      'source',
      'sourceIp',
      'status',
      'transition',
    ]);
  });
});

describe('verifyWordPressWebhook', () => {
  it('verifies HMAC-SHA256 signatures and normalizes WordPress payloads', async () => {
    const { request, signature } = signedRequest(basePayload);

    const verified = await verifyWordPressWebhook(request, {
      env: { WORDPRESS_WEBHOOK_SECRET: secret },
      sourceIp: '203.0.113.10',
    });

    expect(verified).toMatchObject({
      contentType: 'post',
      contentId: 42,
      slug: 'why-website-speed-affects-leads',
      status: 'publish',
      transition: 'draft->publish',
      signature,
      sourceIp: '203.0.113.10',
      timestamp: '2026-08-09T12:00:00.000Z',
    });
  });

  it('rejects invalid signatures with a stable 401 error', async () => {
    const body = JSON.stringify(basePayload);
    const request = new Request('https://ozmodigital.com/api/webhooks/wordpress', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ozmo-signature': 'invalid-signature',
      },
      body,
    });

    await expect(
      verifyWordPressWebhook(request, {
        env: { WORDPRESS_WEBHOOK_SECRET: secret },
        sourceIp: '203.0.113.10',
      }),
    ).rejects.toMatchObject({
      code: 'invalid_signature',
      status: 401,
    });
  });

  it('returns 401 from the Astro webhook route for invalid signatures', async () => {
    vi.stubEnv('WORDPRESS_WEBHOOK_SECRET', secret);
    const request = new Request('https://ozmodigital.com/api/webhooks/wordpress', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ozmo-signature': 'invalid-signature',
      },
      body: JSON.stringify(basePayload),
    });

    const response = await wordpressWebhookPost({
      request,
      clientAddress: '203.0.113.10',
    } as never);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: 'invalid_signature',
    });
  });
});

describe('rebuild enqueueing and processing', () => {
  it('stores only relevant published-content events and debounces pending deploys by 120 seconds', async () => {
    const store = createInMemoryRebuildEventStore();
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(),
      emailSender: vi.fn(),
      now: () => new Date('2026-08-09T12:00:00.000Z'),
    });

    configureRebuildProcessor(processor);
    await enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 1 }));
    await enqueueRebuildEvent(
      verifiedPayload({
        contentType: 'media',
        contentId: 99,
        status: 'publish',
        timestamp: '2026-08-09T12:00:30.000Z',
      }),
    );

    expect(store.records).toHaveLength(1);
    expect(store.records[0]).toMatchObject({
      contentType: 'post',
      contentId: '1',
      status: 'pending',
      scheduledAt: new Date('2026-08-09T12:02:00.000Z'),
    });

    await enqueueRebuildEvent(
      verifiedPayload({
        contentType: 'service',
        contentId: 2,
        timestamp: '2026-08-09T12:01:00.000Z',
      }),
    );

    expect(store.records).toHaveLength(2);
    expect(store.records.map((record) => record.scheduledAt)).toEqual([
      new Date('2026-08-09T12:03:00.000Z'),
      new Date('2026-08-09T12:03:00.000Z'),
    ]);
  });

  it('triggers one deploy hook for due pending events under a Redis-style lock', async () => {
    const store = createInMemoryRebuildEventStore();
    const fetcher = vi.fn(async () => new Response('queued', { status: 200 }));
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher,
      emailSender: vi.fn(),
      now: sequenceDates([
        '2026-08-09T12:00:00.000Z',
        '2026-08-09T12:02:01.000Z',
        '2026-08-09T12:02:03.000Z',
      ]),
    });

    configureRebuildProcessor(processor);
    await enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 1 }));
    const result = await processDueRebuildEvents(new Date('2026-08-09T12:02:01.000Z'));

    expect(fetcher).toHaveBeenCalledWith(
      'https://vercel.example.test/deploy',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result).toMatchObject({
      triggered: true,
      processedEvents: 1,
      failedEvents: 0,
      buildDurationMs: 2_000,
      architectureReviewRequired: false,
    });
    expect(store.records[0]).toMatchObject({
      status: 'completed',
      processedAt: new Date('2026-08-09T12:02:03.000Z'),
      deployResponseStatus: 200,
    });
  });

  it('sends build failure alerts when the deploy hook fails', async () => {
    const store = createInMemoryRebuildEventStore();
    const emailSender = vi.fn();
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(async () => new Response('failed', { status: 500 })),
      emailSender,
      alertRecipients: ['owner@ozmodigital.com', 'dev@example.com'],
      now: sequenceDates([
        '2026-08-09T12:00:00.000Z',
        '2026-08-09T12:02:01.000Z',
        '2026-08-09T12:02:04.000Z',
      ]),
    });

    await processor.enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 1 }));
    const result = await processor.processDueRebuildEvents(new Date('2026-08-09T12:02:01.000Z'));

    expect(result).toMatchObject({
      triggered: false,
      failedEvents: 1,
      buildDurationMs: 3_000,
    });
    expect(emailSender).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['owner@ozmodigital.com', 'dev@example.com'],
        subject: expect.stringContaining('WordPress rebuild failed'),
        html: expect.stringContaining('Deploy hook returned HTTP 500'),
        text: expect.stringContaining('Deploy hook returned HTTP 500'),
      }),
    );
    expect(store.records[0]).toMatchObject({
      status: 'failed',
      error: 'Deploy hook returned HTTP 500.',
    });
  });

  it('flags build durations above five minutes for architecture review', async () => {
    const store = createInMemoryRebuildEventStore();
    const emailSender = vi.fn();
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(async () => new Response('queued', { status: 200 })),
      emailSender,
      alertRecipients: ['owner@ozmodigital.com'],
      now: sequenceDates([
        '2026-08-09T12:00:00.000Z',
        '2026-08-09T12:02:01.000Z',
        '2026-08-09T12:07:02.000Z',
      ]),
    });

    await processor.enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 1 }));
    const result = await processor.processDueRebuildEvents(new Date('2026-08-09T12:02:01.000Z'));

    expect(result).toMatchObject({
      triggered: true,
      architectureReviewRequired: true,
      buildDurationMs: 301_000,
    });
    expect(store.records[0].longBuildReviewRequired).toBe(true);
    expect(emailSender).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('architecture review'),
      }),
    );
  });

  it('requires a valid CRON_SECRET before processing due events from the cron route', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret');
    const response = await processRebuildsPost({
      request: new Request('https://ozmodigital.com/api/cron/process-rebuilds', {
        method: 'POST',
        headers: { authorization: 'Bearer wrong-secret' },
      }),
    } as never);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: 'unauthorized',
    });
  });
});

describe('admin build failure email', () => {
  it('renders matching HTML and plain-text alert content', () => {
    const email = buildAdminBuildFailureEmail({
      reason: 'Deploy hook returned HTTP 500.',
      eventCount: 2,
      buildDurationMs: 301_000,
      architectureReviewRequired: true,
      occurredAt: new Date('2026-08-09T12:07:02.000Z'),
    });

    expect(email.subject).toContain('WordPress rebuild failed');
    expect(email.html).toContain('Deploy hook returned HTTP 500.');
    expect(email.html).toContain('Architecture review required');
    expect(email.text).toContain('Deploy hook returned HTTP 500.');
    expect(email.text).toContain('Architecture review required');
  });
});

function signedRequest(payload: Record<string, unknown>, requestSecret = secret) {
  const body = JSON.stringify(payload);
  const signature = createHmac('sha256', requestSecret).update(body).digest('hex');
  const request = new Request('https://ozmodigital.com/api/webhooks/wordpress', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-ozmo-signature': signature,
    },
    body,
  });

  return { request, signature };
}

function verifiedPayload(overrides: Partial<WordPressWebhookPayload> = {}): WordPressWebhookPayload {
  return {
    contentType: 'post',
    contentId: 42,
    slug: 'why-website-speed-affects-leads',
    status: 'publish',
    transition: 'draft->publish',
    timestamp: '2026-08-09T12:00:00.000Z',
    signature: 'signature',
    sourceIp: '203.0.113.10',
    rawBody: JSON.stringify(basePayload),
    ...overrides,
  };
}

function sequenceDates(values: string[]) {
  const dates = values.map((value) => new Date(value));

  return () => {
    const date = dates.shift();
    if (!date) {
      throw new WordPressWebhookError(
        'invalid_payload',
        'No more dates configured for test sequence.',
        400,
      );
    }

    return date;
  };
}
