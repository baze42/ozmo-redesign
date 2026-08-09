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
  createUpstashRebuildLockStore,
  enqueueRebuildEvent,
  processDueRebuildEvents,
  verifyWordPressWebhook,
  type WordPressWebhookPayload,
} from '../../../src/lib/wordpress/webhook';
import type { VercelDeploymentTracker } from '../../../src/lib/vercel/deployments';
import {
  GET as processRebuildsGet,
  POST as processRebuildsPost,
} from '../../../src/pages/api/cron/process-rebuilds';
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
      'deployJobCreatedAt',
      'deployJobId',
      'deployJobState',
      'deployResponseStatus',
      'deployStartedAt',
      'deployTriggeredAt',
      'deploymentId',
      'deploymentState',
      'deploymentUrl',
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

  it('does not store duplicate webhook deliveries with the same event hash', async () => {
    const store = createInMemoryRebuildEventStore();
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(),
      emailSender: vi.fn(),
      now: () => new Date('2026-08-09T12:00:00.000Z'),
    });
    const payload = verifiedPayload({ contentType: 'post', contentId: 1 });

    await processor.enqueueRebuildEvent(payload);
    await processor.enqueueRebuildEvent(payload);

    expect(store.records).toHaveLength(1);
  });

  it('triggers one deploy hook for due pending events under a Redis-style lock', async () => {
    const store = createInMemoryRebuildEventStore();
    const fetcher = vi.fn(async () => deployHookResponse('job_queued', '2026-08-09T12:02:03.000Z'));
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
      buildDurationMs: 0,
      architectureReviewRequired: false,
    });
    expect(store.records[0]).toMatchObject({
      status: 'triggered',
      deployTriggeredAt: new Date('2026-08-09T12:02:03.000Z'),
      deployJobId: 'job_queued',
      deployJobState: 'PENDING',
      deployJobCreatedAt: new Date('2026-08-09T12:02:03.000Z'),
      processedAt: null,
      buildDurationMs: null,
      deployResponseStatus: 200,
    });
  });

  it('records completed Vercel deployments and real build duration on a later cron pass', async () => {
    const store = createInMemoryRebuildEventStore();
    const deploymentTracker: VercelDeploymentTracker = {
      findLatestDeployHookDeployment: vi.fn(async () => ({
        id: 'dpl_ready',
        url: 'ozmo-ready.vercel.app',
        state: 'READY' as const,
        source: 'api-trigger-git-deploy',
        deployHookJobId: 'job_ready',
        createdAt: new Date('2026-08-09T12:02:03.000Z'),
        buildingAt: new Date('2026-08-09T12:02:10.000Z'),
        readyAt: new Date('2026-08-09T12:06:40.000Z'),
        errorCode: null,
        errorMessage: null,
      })),
    };
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(async () => deployHookResponse('job_ready', '2026-08-09T12:02:03.000Z')),
      deploymentTracker,
      emailSender: vi.fn(),
      now: sequenceDates([
        '2026-08-09T12:00:00.000Z',
        '2026-08-09T12:02:01.000Z',
        '2026-08-09T12:02:03.000Z',
      ]),
    });

    await processor.enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 1 }));
    await processor.processDueRebuildEvents(new Date('2026-08-09T12:02:01.000Z'));
    const result = await processor.processDueRebuildEvents(new Date('2026-08-09T12:06:45.000Z'));

    expect(deploymentTracker.findLatestDeployHookDeployment).toHaveBeenCalledWith({
      jobId: 'job_ready',
      createdAt: new Date('2026-08-09T12:02:03.000Z'),
    });
    expect(result).toMatchObject({
      triggered: false,
      processedEvents: 1,
      failedEvents: 0,
      buildDurationMs: 270_000,
      architectureReviewRequired: false,
    });
    expect(store.records[0]).toMatchObject({
      status: 'completed',
      deploymentId: 'dpl_ready',
      deploymentState: 'READY',
      deploymentUrl: 'ozmo-ready.vercel.app',
      deployStartedAt: new Date('2026-08-09T12:02:10.000Z'),
      deployFinishedAt: new Date('2026-08-09T12:06:40.000Z'),
      buildDurationMs: 270_000,
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

  it('sends build failure alerts when Vercel reports a failed deployment', async () => {
    const store = createInMemoryRebuildEventStore();
    const emailSender = vi.fn();
    const deploymentTracker: VercelDeploymentTracker = {
      findLatestDeployHookDeployment: vi.fn(async () => ({
        id: 'dpl_failed',
        url: 'ozmo-failed.vercel.app',
        state: 'ERROR' as const,
        source: 'api-trigger-git-deploy',
        deployHookJobId: 'job_failed',
        createdAt: new Date('2026-08-09T12:02:03.000Z'),
        buildingAt: new Date('2026-08-09T12:02:10.000Z'),
        readyAt: new Date('2026-08-09T12:02:40.000Z'),
        errorCode: 'BUILD_FAILED',
        errorMessage: 'Build command exited with code 1.',
      })),
    };
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(async () => deployHookResponse('job_failed', '2026-08-09T12:02:03.000Z')),
      deploymentTracker,
      emailSender,
      alertRecipients: ['owner@ozmodigital.com'],
      now: sequenceDates([
        '2026-08-09T12:00:00.000Z',
        '2026-08-09T12:02:01.000Z',
        '2026-08-09T12:02:03.000Z',
      ]),
    });

    await processor.enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 1 }));
    await processor.processDueRebuildEvents(new Date('2026-08-09T12:02:01.000Z'));
    const result = await processor.processDueRebuildEvents(new Date('2026-08-09T12:02:45.000Z'));

    expect(result).toMatchObject({
      triggered: false,
      failedEvents: 1,
      buildDurationMs: 30_000,
    });
    expect(store.records[0]).toMatchObject({
      status: 'failed',
      deploymentId: 'dpl_failed',
      deploymentState: 'ERROR',
      error: 'Build command exited with code 1.',
    });
    expect(emailSender).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('WordPress rebuild failed'),
        html: expect.stringContaining('Build command exited with code 1.'),
      }),
    );
  });

  it('flags real Vercel build durations above five minutes for architecture review', async () => {
    const store = createInMemoryRebuildEventStore();
    const emailSender = vi.fn();
    const deploymentTracker: VercelDeploymentTracker = {
      findLatestDeployHookDeployment: vi.fn(async () => ({
        id: 'dpl_slow',
        url: 'ozmo-slow.vercel.app',
        state: 'READY' as const,
        source: 'api-trigger-git-deploy',
        deployHookJobId: 'job_slow',
        createdAt: new Date('2026-08-09T12:02:03.000Z'),
        buildingAt: new Date('2026-08-09T12:02:10.000Z'),
        readyAt: new Date('2026-08-09T12:07:11.000Z'),
        errorCode: null,
        errorMessage: null,
      })),
    };
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(async () => deployHookResponse('job_slow', '2026-08-09T12:02:03.000Z')),
      deploymentTracker,
      emailSender,
      alertRecipients: ['owner@ozmodigital.com'],
      now: sequenceDates([
        '2026-08-09T12:00:00.000Z',
        '2026-08-09T12:02:01.000Z',
        '2026-08-09T12:02:03.000Z',
      ]),
    });

    await processor.enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 1 }));
    await processor.processDueRebuildEvents(new Date('2026-08-09T12:02:01.000Z'));
    const result = await processor.processDueRebuildEvents(new Date('2026-08-09T12:07:15.000Z'));

    expect(result).toMatchObject({
      triggered: false,
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

  it('marks stale triggered rebuilds failed so future pending events are not blocked forever', async () => {
    const store = createInMemoryRebuildEventStore();
    const emailSender = vi.fn();
    const deploymentTracker: VercelDeploymentTracker = {
      findLatestDeployHookDeployment: vi.fn(async () => null),
    };
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore: createInMemoryRebuildLockStore(),
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(async () => deployHookResponse('job_stale', '2026-08-09T12:02:03.000Z')),
      deploymentTracker,
      emailSender,
      alertRecipients: ['owner@ozmodigital.com'],
      now: sequenceDates([
        '2026-08-09T12:00:00.000Z',
        '2026-08-09T12:02:01.000Z',
        '2026-08-09T12:02:03.000Z',
      ]),
    });

    await processor.enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 1 }));
    await processor.processDueRebuildEvents(new Date('2026-08-09T12:02:01.000Z'));
    const result = await processor.processDueRebuildEvents(new Date('2026-08-09T12:33:00.000Z'));

    expect(result).toMatchObject({
      triggered: false,
      failedEvents: 1,
      architectureReviewRequired: true,
    });
    expect(store.records[0]).toMatchObject({
      status: 'failed',
      deploymentId: null,
      deploymentState: null,
      error: expect.stringContaining('Timed out waiting for Vercel deployment'),
    });
    expect(emailSender).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.stringContaining('architecture review'),
        text: expect.stringContaining('job_stale'),
      }),
    );
  });

  it('retries enqueue lock contention instead of failing concurrent valid webhooks', async () => {
    const store = createInMemoryRebuildEventStore();
    const lockStore = createInMemoryRebuildLockStore();
    const acquire = vi.spyOn(lockStore, 'acquire');
    acquire.mockResolvedValueOnce(false);
    const processor = createRebuildProcessor({
      eventStore: store,
      lockStore,
      deployHookUrl: 'https://vercel.example.test/deploy',
      fetcher: vi.fn(),
      emailSender: vi.fn(),
      sleep: vi.fn(async () => undefined),
      now: () => new Date('2026-08-09T12:00:00.000Z'),
    });

    await processor.enqueueRebuildEvent(verifiedPayload({ contentType: 'post', contentId: 77 }));

    expect(store.records).toHaveLength(1);
    expect(acquire).toHaveBeenCalledTimes(2);
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

  it('processes due rebuilds from the Vercel cron GET route when CRON_SECRET is valid', async () => {
    vi.stubEnv('CRON_SECRET', 'cron-secret');
    const processDueRebuildEvents = vi.fn(async () => ({
      triggered: true,
      processedEvents: 1,
      failedEvents: 0,
      buildDurationMs: 0,
      architectureReviewRequired: false,
    }));
    configureRebuildProcessor({
      enqueueRebuildEvent: vi.fn(),
      processDueRebuildEvents,
    });

    const response = await processRebuildsGet({
      request: new Request('https://ozmodigital.com/api/cron/process-rebuilds', {
        method: 'GET',
        headers: { authorization: 'Bearer cron-secret' },
      }),
    } as never);

    expect(response.status).toBe(200);
    expect(processDueRebuildEvents).toHaveBeenCalledWith(expect.any(Date));
    await expect(response.json()).resolves.toMatchObject({
      triggered: true,
      processedEvents: 1,
    });
  });
});

describe('rebuild locks', () => {
  it('releases Upstash locks only when the stored owner token still matches', async () => {
    const set = vi.fn(async (_key: string, _value: string, _options: { nx: true; ex: number }) => 'OK');
    const evalScript = vi.fn(async (_script: string, _keys: string[], _args: string[]) => 1);
    const del = vi.fn(async (_key: string) => 1);
    const redis = {
      set,
      eval: evalScript,
      del,
    };
    const lockStore = createUpstashRebuildLockStore(redis as never);

    await expect(lockStore.acquire('wordpress:rebuild:deploy', 300)).resolves.toBe(true);
    const ownerToken = set.mock.calls[0]?.[1];
    expect(ownerToken).toEqual(expect.stringMatching(/^[a-f0-9-]{36}$/));

    await lockStore.release('wordpress:rebuild:deploy');

    expect(evalScript).toHaveBeenCalledWith(
      expect.stringContaining('redis.call("get", KEYS[1])'),
      ['wordpress:rebuild:deploy'],
      [ownerToken],
    );
    expect(del).not.toHaveBeenCalled();
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

function deployHookResponse(jobId: string, createdAt: string) {
  return new Response(
    JSON.stringify({
      job: {
        id: jobId,
        state: 'PENDING',
        createdAt: Date.parse(createdAt),
      },
    }),
    {
      status: 200,
      headers: { 'content-type': 'application/json' },
    },
  );
}

function verifiedPayload(overrides: Partial<WordPressWebhookPayload> = {}): WordPressWebhookPayload {
  const contentType = overrides.contentType ?? 'post';
  const contentId = overrides.contentId ?? 42;
  const slug = overrides.slug ?? 'why-website-speed-affects-leads';
  const status = overrides.status ?? 'publish';
  const transition = overrides.transition ?? 'draft->publish';
  const timestamp = overrides.timestamp ?? '2026-08-09T12:00:00.000Z';
  const rawBody =
    overrides.rawBody ??
    JSON.stringify({
      content_type: contentType,
      content_id: contentId,
      slug,
      status,
      transition,
      timestamp,
    });

  return {
    contentType,
    contentId,
    slug,
    status,
    transition,
    timestamp,
    signature: 'signature',
    sourceIp: '203.0.113.10',
    rawBody,
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
