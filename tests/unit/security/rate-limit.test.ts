import { describe, expect, it } from 'vitest';

import {
  buildWebhookRateLimitKey,
  createFixedWindowRateLimiter,
} from '../../../src/lib/security/rate-limit';

describe('buildWebhookRateLimitKey', () => {
  it('combines source IP and signature without exposing the raw signature', () => {
    const key = buildWebhookRateLimitKey({
      sourceIp: '203.0.113.10',
      signature: 'raw-webhook-signature',
    });

    expect(key).toMatch(/^wordpress:webhook:203\.0\.113\.10:[a-f0-9]{32}$/);
    expect(key).not.toContain('raw-webhook-signature');
  });

  it('uses an unknown IP bucket when the platform does not provide an address', () => {
    const key = buildWebhookRateLimitKey({
      sourceIp: '',
      signature: 'raw-webhook-signature',
    });

    expect(key).toContain('wordpress:webhook:unknown:');
  });
});

describe('createFixedWindowRateLimiter', () => {
  it('allows 30 webhook requests per minute for an identity', async () => {
    let currentTime = new Date('2026-08-09T12:00:00.000Z');
    const limiter = createFixedWindowRateLimiter({
      limit: 30,
      windowMs: 60_000,
      now: () => currentTime,
    });

    for (let index = 0; index < 30; index += 1) {
      await expect(limiter.limit('wordpress:webhook:203.0.113.10:sig')).resolves.toMatchObject({
        success: true,
      });
    }

    await expect(limiter.limit('wordpress:webhook:203.0.113.10:sig')).resolves.toMatchObject({
      success: false,
      limit: 30,
      remaining: 0,
    });

    currentTime = new Date('2026-08-09T12:01:00.000Z');

    await expect(limiter.limit('wordpress:webhook:203.0.113.10:sig')).resolves.toMatchObject({
      success: true,
      remaining: 29,
    });
  });

  it('tracks different signature and source IP pairs independently', async () => {
    const limiter = createFixedWindowRateLimiter({
      limit: 1,
      windowMs: 60_000,
      now: () => new Date('2026-08-09T12:00:00.000Z'),
    });

    await expect(limiter.limit('wordpress:webhook:203.0.113.10:sig-a')).resolves.toMatchObject({
      success: true,
    });
    await expect(limiter.limit('wordpress:webhook:203.0.113.11:sig-a')).resolves.toMatchObject({
      success: true,
    });
    await expect(limiter.limit('wordpress:webhook:203.0.113.10:sig-b')).resolves.toMatchObject({
      success: true,
    });
    await expect(limiter.limit('wordpress:webhook:203.0.113.10:sig-a')).resolves.toMatchObject({
      success: false,
    });
  });
});
