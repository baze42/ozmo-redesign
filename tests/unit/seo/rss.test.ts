import { describe, expect, it } from 'vitest';

import { generateRssFeed } from '../../../src/lib/seo/rss';
import type { PostViewModel } from '../../../src/lib/wordpress/mappers';

const posts: PostViewModel[] = [
  {
    id: 1,
    slug: 'why-website-speed-affects-leads',
    title: 'Why website speed affects leads',
    excerpt: 'Slow pages make the inquiry path harder to reach.',
    contentHtml: '<p>Fast pages help visitors keep moving.</p>',
    publishedAt: '2026-08-08T12:00:00.000Z',
    updatedAt: '2026-08-08T13:00:00.000Z',
    canonicalPath: '/blog/why-website-speed-affects-leads',
    rss: {
      title: 'Why website speed affects leads',
      description: 'Slow pages make the inquiry path harder to reach.',
      link: '/blog/why-website-speed-affects-leads',
      pubDate: '2026-08-08T12:00:00.000Z',
    },
    seo: {
      title: 'Why website speed affects leads',
      description: 'Slow pages make the inquiry path harder to reach.',
    },
  },
  {
    id: 2,
    slug: 'how-to-tell-whether-homepage-messaging-is-unclear',
    title: 'How to tell whether homepage messaging is unclear',
    excerpt: 'A clear homepage helps visitors understand the next step.',
    contentHtml: '<p>Message clarity changes what visitors notice first.</p>',
    publishedAt: '2026-08-09T12:00:00.000Z',
    updatedAt: '2026-08-09T13:00:00.000Z',
    canonicalPath: '/blog/how-to-tell-whether-homepage-messaging-is-unclear',
    rss: {
      title: 'How to tell whether homepage messaging is unclear',
      description: 'A clear homepage helps visitors understand the next step.',
      link: '/blog/how-to-tell-whether-homepage-messaging-is-unclear',
      pubDate: '2026-08-09T12:00:00.000Z',
    },
    seo: {
      title: 'How to tell whether homepage messaging is unclear',
      description: 'A clear homepage helps visitors understand the next step.',
    },
  },
  {
    id: 3,
    slug: 'what-a-small-business-website-needs-before-running-ads',
    title: 'What a small business website needs before running ads',
    excerpt: 'Ads need a page that can explain, reassure, and capture demand.',
    contentHtml: '<p>Prepare the landing path before adding traffic.</p>',
    publishedAt: '2026-08-10T12:00:00.000Z',
    updatedAt: '2026-08-10T13:00:00.000Z',
    canonicalPath: '/blog/what-a-small-business-website-needs-before-running-ads',
    rss: {
      title: 'What a small business website needs before running ads',
      description: 'Ads need a page that can explain, reassure, and capture demand.',
      link: '/blog/what-a-small-business-website-needs-before-running-ads',
      pubDate: '2026-08-10T12:00:00.000Z',
    },
    seo: {
      title: 'What a small business website needs before running ads',
      description: 'Ads need a page that can explain, reassure, and capture demand.',
    },
  },
];

describe('generateRssFeed', () => {
  it('returns null until at least three published posts are available', () => {
    expect(generateRssFeed(posts.slice(0, 2), 'https://ozmodigital.com')).toBeNull();
  });

  it('generates an RSS document with absolute links for launch-ready posts', () => {
    const rss = generateRssFeed(posts, 'https://ozmodigital.com');

    expect(rss).toContain('<rss version="2.0">');
    expect(rss).toContain('<channel>');
    expect(rss).toContain('https://ozmodigital.com/blog/why-website-speed-affects-leads');
    expect(rss).toContain('<lastBuildDate>Mon, 10 Aug 2026 13:00:00 GMT</lastBuildDate>');
  });
});
