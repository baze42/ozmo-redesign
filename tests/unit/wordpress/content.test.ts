import { afterEach, describe, expect, it, vi } from 'vitest';

import { configureEmailSender } from '../../../src/lib/email/resend';
import {
  getBlogIndexRobots,
  getBuildPosts,
  getBuildServices,
  getBuildTransformations,
  shouldUseLocalWordPressFixtures,
} from '../../../src/lib/wordpress/content';
import { configureSnapshotStore, type SnapshotStore } from '../../../src/lib/wordpress/snapshots';

const snapshotService = {
  id: 1,
  slug: 'snapshot-service',
  title: 'Snapshot Service',
  summary: 'Snapshot summary',
  bodyHtml: '<p>Snapshot body.</p>',
  businessOutcomes: ['Snapshot outcome'],
  sections: [],
  cta: { label: 'Get a Free Site Review', url: '/free-site-audit' },
  sortOrder: 1,
  seo: { title: 'Snapshot Service', description: 'Snapshot summary' },
  updatedAt: '2026-08-08T13:00:00.000Z',
};

afterEach(() => {
  configureEmailSender(null);
  configureSnapshotStore(null);
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('WordPress build content fallback', () => {
  it('uses local WordPress-shaped fixtures only behind an explicit non-Vercel flag', () => {
    expect(
      shouldUseLocalWordPressFixtures({
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: false,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: true,
      }),
    ).toBe(true);
    expect(
      shouldUseLocalWordPressFixtures({
        WORDPRESS_API_BASE_URL: 'https://cms.example.test/wp-json/wp/v2',
        PRODUCTION_LAUNCH_APPROVED: false,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: true,
      }),
    ).toBe(false);
    expect(
      shouldUseLocalWordPressFixtures({
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: true,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: true,
      }),
    ).toBe(false);
    expect(
      shouldUseLocalWordPressFixtures({
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: false,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: false,
      }),
    ).toBe(false);
  });

  it('does not allow local fixtures on Vercel even when the local flag is present', () => {
    vi.stubEnv('VERCEL', '1');

    expect(
      shouldUseLocalWordPressFixtures({
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: false,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: true,
      }),
    ).toBe(false);

    vi.unstubAllEnvs();
  });

  it('provides six development services with business outcomes', async () => {
    const services = await getBuildServices({
      env: {
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: false,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: true,
      },
    });

    expect(services).toHaveLength(6);
    expect(services.map((service) => service.title)).toContain('Website design and builds');
    expect(services.every((service) => service.businessOutcomes.length > 0)).toBe(true);
  });

  it('provides qualitative transformation fixtures without fake metrics', async () => {
    const transformations = await getBuildTransformations({
      env: {
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: false,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: true,
      },
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
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: false,
      },
      wordpress,
    });

    expect(services[0].slug).toBe('cms-service');
    expect(wordpress.getServices).toHaveBeenCalled();
  });

  it('fails the public build path when a WordPress snapshot would be used without alert recipients', async () => {
    configureSnapshotStore(snapshotStore({ 'wordpress:services': [snapshotService] }));
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network down');
    }));
    vi.stubEnv('INTERNAL_ALERT_EMAILS', '');

    await expect(
      getBuildServices({
        env: {
          WORDPRESS_API_BASE_URL: 'https://cms.example.test/wp-json/wp/v2',
          PRODUCTION_LAUNCH_APPROVED: false,
          OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: false,
        },
      }),
    ).rejects.toThrow('INTERNAL_ALERT_EMAILS is required before using WordPress snapshots');
  });

  it('alerts internal recipients when the public build path uses a WordPress snapshot', async () => {
    const emailSender = vi.fn();
    configureEmailSender(emailSender);
    configureSnapshotStore(snapshotStore({ 'wordpress:services': [snapshotService] }));
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network down');
    }));
    vi.stubEnv('INTERNAL_ALERT_EMAILS', 'owner@ozmodigital.com,dev@example.com');

    const services = await getBuildServices({
      env: {
        WORDPRESS_API_BASE_URL: 'https://cms.example.test/wp-json/wp/v2',
        PRODUCTION_LAUNCH_APPROVED: false,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: false,
      },
    });

    expect(services).toEqual([snapshotService]);
    expect(emailSender).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['owner@ozmodigital.com', 'dev@example.com'],
        subject: expect.stringContaining('WordPress snapshot fallback'),
        text: expect.stringContaining('wordpress:services'),
      }),
    );
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
      env: {
        WORDPRESS_API_BASE_URL: '',
        PRODUCTION_LAUNCH_APPROVED: false,
        OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES: true,
      },
    });

    expect(posts).toHaveLength(3);
    expect(posts[0].canonicalPath).toBe('/blog/why-website-speed-affects-leads');
  });
});

function snapshotStore(initial: Record<string, unknown>): SnapshotStore {
  const snapshots = new Map(Object.entries(initial));

  return {
    async readSnapshot<T>(snapshotKey: string) {
      return (snapshots.get(snapshotKey) as T | undefined) ?? null;
    },
    async writeSnapshot(snapshotKey: string, payload: unknown) {
      snapshots.set(snapshotKey, payload);
    },
  };
}
