import { describe, expect, it, vi } from 'vitest';

import {
  getBlogIndexRobots,
  getBuildPosts,
  getBuildServices,
  getBuildTransformations,
  shouldUseLocalWordPressFixtures,
} from '../../../src/lib/wordpress/content';

describe('WordPress build content fallback', () => {
  it('uses local WordPress-shaped fixtures only when no CMS URL is configured before launch', () => {
    expect(
      shouldUseLocalWordPressFixtures({
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: false,
      }),
    ).toBe(true);
    expect(
      shouldUseLocalWordPressFixtures({
        WORDPRESS_API_BASE_URL: 'https://cms.example.test/wp-json/wp/v2',
        PRODUCTION_LAUNCH_APPROVED: false,
      }),
    ).toBe(false);
    expect(
      shouldUseLocalWordPressFixtures({
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: true,
      }),
    ).toBe(false);
  });

  it('provides six development services with business outcomes', async () => {
    const services = await getBuildServices({
      env: { WORDPRESS_API_BASE_URL: '', PRODUCTION_LAUNCH_APPROVED: false },
    });

    expect(services).toHaveLength(6);
    expect(services.map((service) => service.title)).toContain('Website design and builds');
    expect(services.every((service) => service.businessOutcomes.length > 0)).toBe(true);
  });

  it('provides qualitative transformation fixtures without fake metrics', async () => {
    const transformations = await getBuildTransformations({
      env: { WORDPRESS_API_BASE_URL: '', PRODUCTION_LAUNCH_APPROVED: false },
    });

    expect(transformations).toHaveLength(3);
    expect(transformations[0].title).toBe(
      'Service business homepage with no clear next step',
    );
    expect(transformations.map((item) => item.expectedBusinessImpact).join(' ')).not.toMatch(
      /%|\$|#\d|PageSpeed|\d+\s+leads/i,
    );
  });

  it('uses the WordPress client when a CMS URL is configured', async () => {
    const wordpress = {
      getServices: vi.fn(async () => [
        {
          id: 1,
          slug: 'cms-service',
          title: 'CMS service',
          summary: 'CMS summary',
          bodyHtml: '<p>CMS body</p>',
          businessOutcomes: ['CMS outcome'],
          sections: [],
          cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
          sortOrder: 1,
          seo: { title: 'CMS service', description: 'CMS summary' },
          updatedAt: '2026-08-08T13:00:00.000Z',
        },
      ]),
    };

    const services = await getBuildServices({
      env: {
        WORDPRESS_API_BASE_URL: 'https://cms.example.test/wp-json/wp/v2',
        PRODUCTION_LAUNCH_APPROVED: false,
      },
      wordpress,
    });

    expect(services[0].slug).toBe('cms-service');
    expect(wordpress.getServices).toHaveBeenCalled();
  });
});

describe('blog index robots policy', () => {
  it('noindexes the prelaunch blog until at least three posts are available', () => {
    expect(getBlogIndexRobots([])).toBe('noindex, follow');
    expect(getBlogIndexRobots([{}, {}])).toBe('noindex, follow');
    expect(getBlogIndexRobots([{}, {}, {}])).toBe('index, follow');
  });

  it('provides three local posts for RSS and static blog detail generation', async () => {
    const posts = await getBuildPosts({
      env: { WORDPRESS_API_BASE_URL: '', PRODUCTION_LAUNCH_APPROVED: false },
    });

    expect(posts).toHaveLength(3);
    expect(posts[0].canonicalPath).toBe('/blog/why-website-speed-affects-leads');
  });
});
