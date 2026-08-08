export type RobotsPolicy = {
  index: boolean;
  follow: boolean;
  sitemap: boolean;
  xRobotsTag?: 'noindex, nofollow';
};

export type RouteConfig = {
  path: string;
  purpose: string;
  policy: RobotsPolicy;
};

const indexable: RobotsPolicy = { index: true, follow: true, sitemap: true };
const noindexPublic: RobotsPolicy = { index: false, follow: true, sitemap: false };
const privateNoindex: RobotsPolicy = {
  index: false,
  follow: false,
  sitemap: false,
  xRobotsTag: 'noindex, nofollow',
};

export const REQUIRED_ROUTES: RouteConfig[] = [
  { path: '/', purpose: 'Homepage', policy: indexable },
  { path: '/services', purpose: 'Services overview', policy: indexable },
  { path: '/portfolio', purpose: 'Transformation examples', policy: indexable },
  { path: '/blog', purpose: 'Blog index', policy: indexable },
  { path: '/blog/[slug]', purpose: 'Blog detail', policy: { ...indexable, sitemap: false } },
  { path: '/contact', purpose: 'General inquiry page', policy: indexable },
  { path: '/free-site-audit', purpose: 'Site review entry page', policy: indexable },
  { path: '/schedule', purpose: 'Public Discovery Call scheduler', policy: indexable },
  { path: '/schedule/review/[token]', purpose: 'Private scheduler', policy: privateNoindex },
  { path: '/schedule/manage/[token]', purpose: 'Visitor booking management', policy: privateNoindex },
  { path: '/thank-you/contact', purpose: 'Contact confirmation', policy: noindexPublic },
  { path: '/thank-you/site-review', purpose: 'Site review confirmation', policy: noindexPublic },
  { path: '/thank-you/booking', purpose: 'Booking confirmation', policy: noindexPublic },
  { path: '/privacy', purpose: 'Privacy policy', policy: indexable },
  { path: '/terms', purpose: 'Terms of service', policy: indexable },
  { path: '/cookie-notice', purpose: 'Cookie and analytics notice', policy: indexable },
  { path: '/admin', purpose: 'Admin dashboard', policy: privateNoindex },
  { path: '/admin/leads', purpose: 'Admin lead list', policy: privateNoindex },
  { path: '/admin/leads/[id]', purpose: 'Admin lead detail', policy: privateNoindex },
  { path: '/admin/audits', purpose: 'Admin review queue', policy: privateNoindex },
  { path: '/admin/bookings', purpose: 'Admin booking list', policy: privateNoindex },
  { path: '/404', purpose: 'Not found', policy: noindexPublic },
  { path: '/500', purpose: 'Server error', policy: noindexPublic },
];

export function getRobotsForRoute(pathname: string): RobotsPolicy {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return privateNoindex;
  }

  if (pathname.startsWith('/schedule/review/') || pathname.startsWith('/schedule/manage/')) {
    return privateNoindex;
  }

  return REQUIRED_ROUTES.find((route) => route.path === pathname)?.policy ?? noindexPublic;
}

export function getSitemapRoutes(): RouteConfig[] {
  return REQUIRED_ROUTES.filter((route) => route.policy.sitemap);
}
