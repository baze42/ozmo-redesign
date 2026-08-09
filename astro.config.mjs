import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL || 'https://ozmodigital.com';
const sitemapStaticPaths = new Set([
  '/',
  '/services',
  '/portfolio',
  '/blog',
  '/contact',
  '/free-site-audit',
  '/schedule',
  '/privacy',
  '/terms',
  '/cookie-notice',
  '/rss.xml',
]);

function isSitemapPublicPath(page) {
  const pathname = new URL(page).pathname;
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  return sitemapStaticPaths.has(normalizedPath) || normalizedPath.startsWith('/blog/');
}

export default defineConfig({
  site,
  adapter: vercel(),
  integrations: [
    sitemap({
      customPages: [new URL('/rss.xml', site).toString()],
      filter: isSitemapPublicPath,
    }),
  ],
});
