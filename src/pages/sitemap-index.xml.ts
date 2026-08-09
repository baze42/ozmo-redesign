import { getEnv } from '../lib/config/env';
import { generateSitemapXml } from '../lib/seo/sitemap';
import { getBuildPosts } from '../lib/wordpress/content';

export const prerender = true;

export async function GET() {
  const posts = await getBuildPosts();
  const sitemap = generateSitemapXml({
    siteUrl: getEnv().PUBLIC_SITE_URL,
    posts,
  });

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
