import type { PostViewModel } from '../wordpress/mappers';

const staticSitemapPaths = ['/', '/services', '/portfolio', '/privacy', '/terms', '/cookie-notice'];

export function generateSitemapXml(input: { siteUrl: string; posts: PostViewModel[] }) {
  const baseUrl = new URL(input.siteUrl);
  const blogReady = input.posts.length >= 3;
  const paths = [
    ...staticSitemapPaths,
    ...(blogReady ? ['/blog', '/rss.xml', ...input.posts.map((post) => post.canonicalPath)] : []),
  ];

  const urls = [...new Set(paths)]
    .map((path) => absolutePath(baseUrl, path))
    .map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`)
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');
}

function absolutePath(baseUrl: URL, path: string) {
  return new URL(path, baseUrl).toString().replace(/\/$/, path === '/' ? '/' : '');
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
