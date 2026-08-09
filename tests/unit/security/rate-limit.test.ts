import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildWebhookIpRateLimitKey,
  buildWebhookRateLimitKey,
  createFixedWindowRateLimiter,
  getWebhookRateLimiter,
} from '../../../src/lib/security/rate-limit';

afterEach(() => {
  vi.unstubAllEnvs();
});

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

describe('buildWebhookIpRateLimitKey', () => {
  it('uses a source-IP-only bucket before signature verification', () => {
    expect(buildWebhookIpRateLimitKey('203.0.113.10')).toBe('wordpress:webhook:ip:203.0.113.10');
    expect(buildWebhookIpRateLimitKey('')).toBe('wordpress:webhook:ip:unknown');
  });
});

describe('getWebhookRateLimiter', () => {
  it('rejects in-memory webhook rate limiting in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');

    expect(() => getWebhookRateLimiter()).toThrow(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required',
    );
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
