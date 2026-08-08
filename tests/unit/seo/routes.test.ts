import { describe, expect, it } from 'vitest';

import { REQUIRED_ROUTES, getRobotsForRoute, getSitemapRoutes } from '../../../src/lib/seo/routes';

const requiredPaths = [
  '/',
  '/services',
  '/portfolio',
  '/blog',
  '/blog/[slug]',
  '/contact',
  '/free-site-audit',
  '/schedule',
  '/schedule/review/[token]',
  '/schedule/manage/[token]',
  '/thank-you/contact',
  '/thank-you/site-review',
  '/thank-you/booking',
  '/privacy',
  '/terms',
  '/cookie-notice',
  '/admin',
  '/admin/leads',
  '/admin/leads/[id]',
  '/admin/audits',
  '/admin/bookings',
  '/404',
  '/500',
];

describe('route inventory', () => {
  it('includes every route required by the V1 spec', () => {
    expect(REQUIRED_ROUTES.map((route) => route.path)).toEqual(requiredPaths);
  });

  it('excludes admin and tokenized routes from sitemap and indexing', () => {
    for (const path of ['/admin', '/admin/leads', '/schedule/review/[token]', '/schedule/manage/[token]']) {
      const policy = getRobotsForRoute(path);

      expect(policy.index).toBe(false);
      expect(policy.follow).toBe(false);
      expect(policy.sitemap).toBe(false);
      expect(policy.xRobotsTag).toBe('noindex, nofollow');
    }
  });

  it('returns only indexable public routes for the sitemap', () => {
    const sitemapPaths = getSitemapRoutes().map((route) => route.path);

    expect(sitemapPaths).toContain('/');
    expect(sitemapPaths).toContain('/services');
    expect(sitemapPaths).toContain('/privacy');
    expect(sitemapPaths).not.toContain('/admin');
    expect(sitemapPaths).not.toContain('/thank-you/contact');
    expect(sitemapPaths).not.toContain('/schedule/review/[token]');
  });
});
