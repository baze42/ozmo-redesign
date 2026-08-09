import { describe, expect, it } from 'vitest';

import { buildMetadata } from '../../../src/lib/seo/metadata';

describe('buildMetadata', () => {
  it('builds canonical, Open Graph, and Twitter metadata for an indexable page', () => {
    const metadata = buildMetadata({
      pathname: '/services',
      title: 'Services',
      description: 'Website design, redesign, messaging, SEO, forms, and care.',
      imagePath: '/assets/og-services.png',
    });

    expect(metadata.title).toBe('Services | OZMO Digital');
    expect(metadata.canonical).toBe('https://ozmodigital.com/services');
    expect(metadata.robots).toBe('index, follow');
    expect(metadata.openGraph.type).toBe('website');
    expect(metadata.openGraph.image).toBe('https://ozmodigital.com/assets/og-services.png');
    expect(metadata.twitter.card).toBe('summary_large_image');
    expect(metadata.twitter.image).toBe(metadata.openGraph.image);
  });

  it('normalizes the homepage canonical URL without a trailing slash duplicate', () => {
    const metadata = buildMetadata({
      pathname: '/',
      title: 'OZMO Digital',
      description: 'Fast, polished lead-generation websites.',
    });

    expect(metadata.canonical).toBe('https://ozmodigital.com/');
  });

  it('uses noindex robots for private routes', () => {
    const metadata = buildMetadata({
      pathname: '/admin',
      title: 'Admin',
      description: 'Protected admin dashboard.',
    });

    expect(metadata.robots).toBe('noindex, nofollow');
  });

  it('allows page-level robots overrides for content inventory gates', () => {
    const metadata = buildMetadata({
      pathname: '/blog',
      title: 'Blog',
      description: 'Useful notes before you rebuild.',
      robots: 'noindex, follow',
    });

    expect(metadata.robots).toBe('noindex, follow');
  });
});
