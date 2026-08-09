import { createHash } from 'node:crypto';

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

import { getEnv } from '../config/env';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

export interface RateLimiter {
  limit(identifier: string): Promise<RateLimitResult>;
}

export function buildWebhookRateLimitKey(input: {
  sourceIp: string | null | undefined;
  signature: string | null | undefined;
}) {
  const sourceIp = sanitizeRateLimitPart(input.sourceIp || 'unknown');
  const signatureHash = createHash('sha256')
    .update(input.signature || 'missing-signature')
    .digest('hex')
    .slice(0, 32);

  return `wordpress:webhook:${sourceIp}:${signatureHash}`;
}

export function buildWebhookIpRateLimitKey(sourceIp: string | null | undefined) {
  return `wordpress:webhook:ip:${sanitizeRateLimitPart(sourceIp || 'unknown')}`;
}

export function createFixedWindowRateLimiter(options: {
  limit: number;
  windowMs: number;
  now?: () => Date;
}): RateLimiter {
  const windows = new Map<string, { count: number; windowStartMs: number }>();
  const getNow = options.now ?? (() => new Date());

  return {
    async limit(identifier) {
      const nowMs = getNow().getTime();
      const currentWindow = windows.get(identifier);
      const windowStartMs =
        currentWindow && nowMs - currentWindow.windowStartMs < options.windowMs
          ? currentWindow.windowStartMs
          : nowMs;
      const count =
        currentWindow && windowStartMs === currentWindow.windowStartMs ? currentWindow.count : 0;
      const reset = new Date(windowStartMs + options.windowMs);

      if (count >= options.limit) {
        windows.set(identifier, { count, windowStartMs });
        return {
          success: false,
          limit: options.limit,
          remaining: 0,
          reset,
        };
      }

      const nextCount = count + 1;
      windows.set(identifier, { count: nextCount, windowStartMs });

      return {
        success: true,
        limit: options.limit,
        remaining: Math.max(options.limit - nextCount, 0),
        reset,
      };
    },
  };
}

let fallbackRateLimiter: RateLimiter | null = null;
let upstashRateLimiter: RateLimiter | null = null;

export function getWebhookRateLimiter(): RateLimiter {
  const env = getEnv();

  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    upstashRateLimiter ??= createUpstashWebhookRateLimiter();
    return upstashRateLimiter;
  }

  if (isProductionRuntime()) {
    throw new Error(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required for production webhook rate limiting.',
    );
  }

  fallbackRateLimiter ??= createFixedWindowRateLimiter({
    limit: 30,
    windowMs: 60_000,
  });

  return fallbackRateLimiter;
}

export function createUpstashWebhookRateLimiter(): RateLimiter {
  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.fixedWindow(30, '60 s'),
    analytics: false,
    prefix: 'ozmo:wordpress:webhook',
  });

  return {
    async limit(identifier) {
      const result = await ratelimit.limit(identifier);

      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: new Date(result.reset),
      };
    },
  };
}

function sanitizeRateLimitPart(value: string) {
  return value.trim().replace(/[^a-zA-Z0-9:.-]/g, '_') || 'unknown';
}

function isProductionRuntime() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}
