import { describe, expect, it } from 'vitest';

import { generateSitemapXml } from '../../../src/lib/seo/sitemap';
import type { PostViewModel } from '../../../src/lib/wordpress/mappers';

describe('generateSitemapXml', () => {
  it('excludes blog and RSS URLs when the build has fewer than three posts', () => {
    const sitemap = generateSitemapXml({
      siteUrl: 'https://ozmodigital.com',
      posts: [post('one'), post('two')],
    });

    expect(sitemap).toContain('<loc>https://ozmodigital.com/</loc>');
    expect(sitemap).toContain('<loc>https://ozmodigital.com/services</loc>');
    expect(sitemap).toContain('<loc>https://ozmodigital.com/contact</loc>');
    expect(sitemap).toContain('<loc>https://ozmodigital.com/free-site-audit</loc>');
    expect(sitemap).toContain('<loc>https://ozmodigital.com/schedule</loc>');
    expect(sitemap).not.toContain('<loc>https://ozmodigital.com/blog</loc>');
    expect(sitemap).not.toContain('<loc>https://ozmodigital.com/rss.xml</loc>');
    expect(sitemap).not.toContain('/blog/one');
  });

  it('includes blog, RSS, and post URLs when at least three posts are indexable', () => {
    const sitemap = generateSitemapXml({
      siteUrl: 'https://ozmodigital.com',
      posts: [post('one'), post('two'), post('three')],
    });

    expect(sitemap).toContain('<loc>https://ozmodigital.com/blog</loc>');
    expect(sitemap).toContain('<loc>https://ozmodigital.com/rss.xml</loc>');
    expect(sitemap).toContain('<loc>https://ozmodigital.com/blog/one</loc>');
    expect(sitemap).toContain('<loc>https://ozmodigital.com/blog/two</loc>');
    expect(sitemap).toContain('<loc>https://ozmodigital.com/blog/three</loc>');
    expect(sitemap).not.toContain('/admin');
    expect(sitemap).not.toContain('/schedule/review/');
  });
});

function post(slug: string): PostViewModel {
  const id = ['one', 'two', 'three'].indexOf(slug) + 1;

  return {
    id,
    slug,
    title: slug,
    excerpt: `${slug} excerpt`,
    contentHtml: `<p>${slug}</p>`,
    canonicalPath: `/blog/${slug}`,
    publishedAt: '2026-08-08T12:00:00.000Z',
    updatedAt: '2026-08-08T13:00:00.000Z',
    seo: { title: slug, description: `${slug} description` },
    rss: {
      title: slug,
      description: `${slug} description`,
      link: `/blog/${slug}`,
      pubDate: '2026-08-08T12:00:00.000Z',
    },
  };
}
