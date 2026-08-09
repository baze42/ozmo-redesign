import type { PostViewModel } from '../wordpress/mappers';

const minimumPostCount = 3;

export function generateRssFeed(posts: PostViewModel[], siteUrl: string): string | null {
  if (posts.length < minimumPostCount) {
    return null;
  }

  const baseUrl = normalizeBaseUrl(siteUrl);
  const sortedPosts = [...posts].sort(
    (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
  );
  const lastBuildDate = new Date(
    Math.max(...sortedPosts.map((post) => new Date(post.updatedAt).getTime())),
  ).toUTCString();

  const items = sortedPosts.map((post) => {
    const link = absoluteUrl(post.rss.link, baseUrl);

    return [
      '    <item>',
      `      <title>${escapeXml(post.rss.title)}</title>`,
      `      <description>${escapeXml(post.rss.description)}</description>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid>${escapeXml(link)}</guid>`,
      `      <pubDate>${new Date(post.rss.pubDate).toUTCString()}</pubDate>`,
      '    </item>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>OZMO Digital Blog</title>',
    '    <description>Practical notes on faster, clearer lead-generation websites.</description>',
    `    <link>${escapeXml(baseUrl)}</link>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

function normalizeBaseUrl(siteUrl: string) {
  const url = new URL(siteUrl);
  return `${url.origin}/`;
}

function absoluteUrl(pathname: string, baseUrl: string) {
  return new URL(pathname, baseUrl).toString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
