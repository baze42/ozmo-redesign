import type { APIContext } from 'astro';

import {
  WordPressWebhookError,
  enqueueRebuildEvent,
  verifyWordPressWebhook,
} from '../../../lib/wordpress/webhook';
import {
  buildWebhookIpRateLimitKey,
  buildWebhookRateLimitKey,
  getWebhookRateLimiter,
} from '../../../lib/security/rate-limit';

export const prerender = false;

export async function POST(context: APIContext) {
  const sourceIp = context.clientAddress || 'unknown';
  const rateLimiter = getWebhookRateLimiter();
  const ipRateLimit = await rateLimiter.limit(buildWebhookIpRateLimitKey(sourceIp));

  if (!ipRateLimit.success) {
    return jsonResponse({ error: 'rate_limited' }, 429);
  }

  try {
    const payload = await verifyWordPressWebhook(context.request, { sourceIp });
    const signatureRateLimit = await rateLimiter.limit(
      buildWebhookRateLimitKey({ sourceIp, signature: payload.signature }),
    );

    if (!signatureRateLimit.success) {
      return jsonResponse({ error: 'rate_limited' }, 429);
    }

    await enqueueRebuildEvent(payload);

    return jsonResponse({ queued: true }, 202);
  } catch (error) {
    if (error instanceof WordPressWebhookError) {
      return jsonResponse({ error: error.code }, error.status);
    }

    throw error;
  }
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
