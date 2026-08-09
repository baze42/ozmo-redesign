import { getEnv } from '../lib/config/env';
import { generateRssFeed } from '../lib/seo/rss';
import { getBuildPosts } from '../lib/wordpress/content';

export const prerender = true;

export async function GET() {
  const posts = await getBuildPosts();
  const feed = generateRssFeed(posts, getEnv().PUBLIC_SITE_URL);

  if (!feed) {
    return new Response('RSS feed is not available until at least three posts are published.', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
