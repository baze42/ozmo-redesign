import type { APIContext } from 'astro';

import { getEnv } from '../../../lib/config/env';
import { processDueRebuildEvents } from '../../../lib/wordpress/webhook';

export const prerender = false;

export async function POST(context: APIContext) {
  const { CRON_SECRET } = getEnv();
  const authorization = context.request.headers.get('authorization') || '';
  const cronSecret = context.request.headers.get('x-cron-secret') || '';
  const expectedBearer = `Bearer ${CRON_SECRET}`;

  if (!CRON_SECRET || (authorization !== expectedBearer && cronSecret !== CRON_SECRET)) {
    return jsonResponse({ error: 'unauthorized' }, 401);
  }

  const result = await processDueRebuildEvents(new Date());

  return jsonResponse(result, 200);
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
