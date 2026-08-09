import type { APIContext } from 'astro';

import {
  WordPressWebhookError,
  enqueueRebuildEvent,
  verifyWordPressWebhook,
} from '../../../lib/wordpress/webhook';
import {
  buildWebhookRateLimitKey,
  getWebhookRateLimiter,
} from '../../../lib/security/rate-limit';

export const prerender = false;

export async function POST(context: APIContext) {
  const signature = context.request.headers.get('x-ozmo-signature') || '';
  const sourceIp = context.clientAddress || 'unknown';
  const rateLimit = await getWebhookRateLimiter().limit(
    buildWebhookRateLimitKey({ sourceIp, signature }),
  );

  if (!rateLimit.success) {
    return jsonResponse({ error: 'rate_limited' }, 429);
  }

  try {
    const payload = await verifyWordPressWebhook(context.request, { sourceIp });
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
