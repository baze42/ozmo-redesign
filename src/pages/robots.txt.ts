import { getEnv } from '../lib/config/env';

export const prerender = true;

export function GET() {
  const siteUrl = new URL(getEnv().PUBLIC_SITE_URL);
  const sitemapUrl = new URL('/sitemap-index.xml', siteUrl.origin);
  const body = [
    'User-agent: *',
    'Disallow: /admin',
    'Disallow: /admin/',
    'Disallow: /schedule/review/',
    'Disallow: /schedule/manage/',
    'Allow: /',
    `Sitemap: ${sitemapUrl.toString()}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
