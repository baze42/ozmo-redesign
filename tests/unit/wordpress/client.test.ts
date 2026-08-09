import { afterEach, describe, expect, it, vi } from 'vitest';

import { configureEmailSender } from '../../../src/lib/email/resend';
import {
  WordPressClientError,
  createWordPressClient,
  getServices,
} from '../../../src/lib/wordpress/client';
import { configureSnapshotStore, type SnapshotStore } from '../../../src/lib/wordpress/snapshots';

const serviceRecord = {
  id: 1,
  slug: 'website-design-builds',
  date_gmt: '2026-08-08T12:00:00',
  modified_gmt: '2026-08-08T13:00:00',
  status: 'publish',
  type: 'service',
  title: { rendered: 'Website design and builds' },
  content: { rendered: '<p>Launch a clear, lead-ready website.</p>' },
  excerpt: { rendered: '<p>Launch a clear, lead-ready website.</p>' },
  acf: {
    summary: 'Launch a clear, lead-ready website.',
    business_outcomes: [{ outcome: 'Credible owned website' }],
    body_sections: [{ heading: 'Build', body: 'Create the site foundation.' }],
    cta_label: 'Get a Free Site Review',
    cta_url: '/free-site-audit',
    sort_order: 1,
    seo_title: 'Website design and builds',
    seo_description: 'Launch a fast, credible website.',
    og_image: false,
  },
};

const transformationRecord = {
  id: 2,
  slug: 'unclear-homepage',
  date_gmt: '2026-08-08T12:00:00',
  modified_gmt: '2026-08-08T13:00:00',
  status: 'publish',
  type: 'transformation',
  title: { rendered: 'Homepage with no clear next step' },
  content: { rendered: '<p>Qualitative example.</p>' },
  excerpt: { rendered: '<p>Make the next step clearer.</p>' },
  acf: {
    before_state: 'The current homepage hides the visitor action.',
    what_is_not_working: 'The offer is unclear and the CTA is buried.',
    ozmo_improvement_path: 'Move the offer and CTA above the fold.',
    expected_business_impact:
      'Visitors can understand the offer faster and reach the inquiry path with less friction.',
    cta_label: 'Get a Free Site Review',
    cta_url: '/free-site-audit',
    sort_order: 1,
    mockup_variant: 'lead_path',
    seo_title: 'Homepage transformation',
    seo_description: 'A qualitative homepage transformation.',
    og_image: false,
  },
};

function postRecord(id: number, slug = `post-${id}`) {
  return {
    id,
    slug,
    date_gmt: '2026-08-08T12:00:00',
    modified_gmt: '2026-08-08T13:00:00',
    status: 'publish',
    type: 'post',
    title: { rendered: `Post ${id}` },
    content: { rendered: `<p>Post ${id} body.</p>` },
    excerpt: { rendered: `<p>Post ${id} excerpt.</p>` },
    acf: {
      seo_title: `Post ${id}`,
      seo_description: `Post ${id} description.`,
      og_image: false,
    },
  };
}

function responseJson(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function snapshotStore(initial: Record<string, unknown> = {}) {
  const snapshots = new Map(Object.entries(initial));
  const readSnapshot = vi.fn(async (snapshotKey: string) => snapshots.get(snapshotKey) ?? null);
  const writeSnapshot = vi.fn(async (snapshotKey: string, payload: unknown) => {
    snapshots.set(snapshotKey, payload);
  });

  return {
    store: {
      async readSnapshot<T>(snapshotKey: string) {
        return (await readSnapshot(snapshotKey)) as T | null;
      },
      writeSnapshot,
    } satisfies SnapshotStore,
    snapshots,
    readSnapshot,
    writeSnapshot,
  };
}

afterEach(() => {
  configureEmailSender(null);
  configureSnapshotStore(null);
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('createWordPressClient', () => {
  it('fetches, maps, sorts, and snapshots services', async () => {
    const snapshots = snapshotStore();
    const fetcher = vi.fn(async () =>
      responseJson([
        {
          ...serviceRecord,
          slug: 'ongoing-care',
          acf: { ...serviceRecord.acf, sort_order: 2 },
        },
        serviceRecord,
      ]),
    );
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher,
      snapshots: snapshots.store,
    });

    const services = await client.getServices();

    expect(fetcher).toHaveBeenCalledWith(
      'https://cms.example.test/wp-json/wp/v2/service?status=publish&per_page=100&_embed=1',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(services.map((service) => service.slug)).toEqual([
      'website-design-builds',
      'ongoing-care',
    ]);
    expect(snapshots.writeSnapshot).toHaveBeenCalledWith('wordpress:services', services);
  });

  it('fails the services build gate when WordPress returns no services', async () => {
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => responseJson([]),
      snapshots: snapshotStore().store,
    });

    await expect(client.getServices()).rejects.toMatchObject({
      code: 'required_content_empty',
      contentType: 'service',
    });
  });

  it('does not overwrite the last-known-good services snapshot when the build gate fails', async () => {
    const snapshots = snapshotStore({
      'wordpress:services': [{ slug: 'last-known-good-service' }],
    });
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => responseJson([]),
      snapshots: snapshots.store,
    });

    await expect(client.getServices()).rejects.toMatchObject({
      code: 'required_content_empty',
    });

    expect(snapshots.writeSnapshot).not.toHaveBeenCalled();
    expect(snapshots.snapshots.get('wordpress:services')).toEqual([
      { slug: 'last-known-good-service' },
    ]);
  });

  it('fails the transformations build gate when WordPress returns no transformations', async () => {
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => responseJson([]),
      snapshots: snapshotStore().store,
    });

    await expect(client.getTransformations()).rejects.toMatchObject({
      code: 'required_content_empty',
      contentType: 'transformation',
    });
  });

  it('uses a last-known-good snapshot and alerts when WordPress is unreachable', async () => {
    const snapshots = snapshotStore({
      'wordpress:services': [
        {
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
        },
      ],
    });
    const onAlert = vi.fn();
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => {
        throw new Error('network down');
      },
      snapshots: snapshots.store,
      onAlert,
    });

    const services = await client.getServices();

    expect(services[0].slug).toBe('snapshot-service');
    expect(snapshots.readSnapshot).toHaveBeenCalledWith('wordpress:services');
    expect(onAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        contentType: 'service',
        snapshotKey: 'wordpress:services',
      }),
    );
  });

  it('fails when WordPress is unreachable and no required snapshot exists', async () => {
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => {
        throw new Error('network down');
      },
      snapshots: snapshotStore().store,
    });

    await expect(client.getServices()).rejects.toMatchObject({
      code: 'wordpress_unreachable',
      contentType: 'service',
    });
  });

  it('converts malformed REST responses into clear validation errors', async () => {
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => responseJson({ data: [] }),
      snapshots: snapshotStore().store,
    });

    await expect(client.getServices()).rejects.toMatchObject({
      code: 'invalid_response',
      contentType: 'service',
    });
  });

  it('times out slow WordPress fetches', async () => {
    const fetcher = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            reject(new DOMException('The operation was aborted.', 'AbortError'));
          });
        }),
    );
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher,
      snapshots: snapshotStore().store,
      timeoutMs: 1,
    });

    await expect(client.getServices()).rejects.toMatchObject({
      code: 'wordpress_timeout',
      contentType: 'service',
    });
  });

  it('fails the production launch blog gate when fewer than 3 posts are published', async () => {
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => responseJson([postRecord(1), postRecord(2)]),
      snapshots: snapshotStore().store,
      productionLaunchApproved: true,
    });

    await expect(client.getPublishedPosts()).rejects.toMatchObject({
      code: 'blog_launch_minimum_not_met',
      contentType: 'post',
    });
  });

  it('does not overwrite the last-known-good posts snapshot when the launch blog gate fails', async () => {
    const snapshots = snapshotStore({
      'wordpress:posts': [{ slug: 'last-known-good-post' }],
    });
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => responseJson([postRecord(1), postRecord(2)]),
      snapshots: snapshots.store,
      productionLaunchApproved: true,
    });

    await expect(client.getPublishedPosts()).rejects.toMatchObject({
      code: 'blog_launch_minimum_not_met',
    });

    expect(snapshots.writeSnapshot).not.toHaveBeenCalled();
    expect(snapshots.snapshots.get('wordpress:posts')).toEqual([{ slug: 'last-known-good-post' }]);
  });

  it('allows prelaunch blog content below the production minimum', async () => {
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => responseJson([postRecord(1), postRecord(2)]),
      snapshots: snapshotStore().store,
      productionLaunchApproved: false,
    });

    const posts = await client.getPublishedPosts();

    expect(posts).toHaveLength(2);
    expect(posts[0].canonicalPath).toBe('/blog/post-1');
  });

  it('maps and snapshots transformations', async () => {
    const snapshots = snapshotStore();
    const client = createWordPressClient({
      apiBaseUrl: 'https://cms.example.test/wp-json/wp/v2',
      fetcher: async () => responseJson([transformationRecord]),
      snapshots: snapshots.store,
    });

    const transformations = await client.getTransformations();

    expect(transformations[0].slug).toBe('unclear-homepage');
    expect(snapshots.writeSnapshot).toHaveBeenCalledWith(
      'wordpress:transformations',
      transformations,
    );
  });
});

describe('default WordPress client', () => {
  it('sends an internal alert when default snapshot fallback is used', async () => {
    const emailSender = vi.fn();
    const snapshots = snapshotStore({
      'wordpress:services': [
        {
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
        },
      ],
    });
    vi.stubEnv('WORDPRESS_API_BASE_URL', 'https://cms.example.test/wp-json/wp/v2');
    vi.stubEnv('INTERNAL_ALERT_EMAILS', 'owner@ozmodigital.com,dev@example.com');
    vi.stubGlobal('fetch', async () => {
      throw new Error('network down');
    });
    configureSnapshotStore(snapshots.store);
    configureEmailSender(emailSender);

    const services = await getServices();

    expect(services[0].slug).toBe('snapshot-service');
    expect(emailSender).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ['owner@ozmodigital.com', 'dev@example.com'],
        subject: expect.stringContaining('WordPress snapshot fallback'),
        html: expect.stringContaining('wordpress:services'),
        text: expect.stringContaining('network down'),
      }),
    );
  });
});

describe('WordPressClientError', () => {
  it('carries stable machine-readable failure details', () => {
    const error = new WordPressClientError('wordpress_http_error', 'service', 'Fetch failed', {
      status: 500,
    });

    expect(error).toMatchObject({
      name: 'WordPressClientError',
      code: 'wordpress_http_error',
      contentType: 'service',
      status: 500,
      message: 'Fetch failed',
    });
  });
});
