import { describe, expect, it } from 'vitest';

import { mapPost, mapService, mapTransformation } from '../../../src/lib/wordpress/mappers';

const serviceRecord = {
  id: 42,
  slug: 'website-redesigns',
  date_gmt: '2026-08-08T12:00:00',
  modified_gmt: '2026-08-08T13:00:00',
  status: 'publish',
  type: 'service',
  link: 'https://cms.example.test/services/website-redesigns/',
  title: { rendered: 'Website <em>Redesigns</em>' },
  content: { rendered: '<p>Replace the unclear parts with a cleaner path.</p>' },
  excerpt: { rendered: '<p>Improve speed, clarity, and lead flow.</p>' },
  acf: {
    summary: 'Improve speed, clarity, and lead flow.',
    business_outcomes: [{ outcome: 'Clearer visitor path' }, { outcome: 'Easier follow-up' }],
    body_sections: [
      {
        heading: 'Message first',
        body: 'The page structure leads with the offer and next step.',
      },
    ],
    cta_label: 'Get a Free Site Review',
    cta_url: '/free-site-audit',
    sort_order: 2,
    seo_title: 'Website redesign services',
    seo_description: 'Turn an outdated website into a clearer lead path.',
    og_image: {
      url: 'https://cms.example.test/uploads/service-og.png',
      alt: 'Abstract service mockup',
    },
    internal_editor_note: 'Do not leak this field.',
  },
};

const transformationRecord = {
  id: 88,
  slug: 'service-business-homepage',
  date_gmt: '2026-08-08T12:00:00',
  modified_gmt: '2026-08-08T13:00:00',
  status: 'publish',
  type: 'transformation',
  title: { rendered: 'Service business homepage with no clear next step' },
  content: { rendered: '<p>Qualitative transformation entry.</p>' },
  excerpt: { rendered: '<p>Make the next step easier to find.</p>' },
  acf: {
    before_state: 'The homepage explains company history before the visitor action.',
    what_is_not_working: 'The CTA is buried and the service path is unclear.',
    ozmo_improvement_path: 'Rework the hero, simplify blocks, and add a short contact path.',
    expected_business_impact:
      'Visitors can understand the offer faster and reach the inquiry path with less friction.',
    cta_label: 'Get a Free Site Review',
    cta_url: '/free-site-audit',
    sort_order: 1,
    mockup_variant: 'service_business',
    seo_title: 'Service business homepage transformation',
    seo_description: 'A qualitative example of a clearer lead-generation homepage.',
    og_image: false,
  },
};

const postRecord = {
  id: 108,
  slug: 'why-website-speed-affects-leads',
  date_gmt: '2026-08-08T12:00:00',
  modified_gmt: '2026-08-08T13:00:00',
  status: 'publish',
  type: 'post',
  link: 'https://cms.example.test/why-website-speed-affects-leads/',
  title: { rendered: 'Why website speed affects leads' },
  content: { rendered: '<p>Slow pages make it harder for visitors to take the next step.</p>' },
  excerpt: { rendered: '<p>Speed shapes trust and action.</p>' },
  acf: {
    seo_title: 'Why website speed affects leads',
    seo_description: 'A practical guide to speed and lead generation.',
    og_image: {
      url: 'https://cms.example.test/uploads/speed-og.png',
      alt: 'Abstract speed article graphic',
    },
  },
};

describe('WordPress service mapper', () => {
  it('maps public service fields without leaking private CMS fields', () => {
    const service = mapService(serviceRecord);

    expect(service).toEqual({
      id: 42,
      slug: 'website-redesigns',
      title: 'Website Redesigns',
      summary: 'Improve speed, clarity, and lead flow.',
      bodyHtml: '<p>Replace the unclear parts with a cleaner path.</p>',
      businessOutcomes: ['Clearer visitor path', 'Easier follow-up'],
      sections: [
        {
          heading: 'Message first',
          body: 'The page structure leads with the offer and next step.',
        },
      ],
      cta: {
        label: 'Get a Free Site Review',
        url: '/free-site-audit',
      },
      sortOrder: 2,
      seo: {
        title: 'Website redesign services',
        description: 'Turn an outdated website into a clearer lead path.',
        ogImage: {
          url: 'https://cms.example.test/uploads/service-og.png',
          alt: 'Abstract service mockup',
        },
      },
      updatedAt: '2026-08-08T13:00:00.000Z',
    });
    expect(JSON.stringify(service)).not.toContain('internal_editor_note');
    expect(JSON.stringify(service)).not.toContain('acf');
  });
});

describe('WordPress transformation mapper', () => {
  it('maps honest qualitative transformation examples', () => {
    const transformation = mapTransformation(transformationRecord);

    expect(transformation).toMatchObject({
      id: 88,
      slug: 'service-business-homepage',
      title: 'Service business homepage with no clear next step',
      beforeState: 'The homepage explains company history before the visitor action.',
      whatIsNotWorking: 'The CTA is buried and the service path is unclear.',
      ozmoImprovementPath: 'Rework the hero, simplify blocks, and add a short contact path.',
      expectedBusinessImpact:
        'Visitors can understand the offer faster and reach the inquiry path with less friction.',
      cta: {
        label: 'Get a Free Site Review',
        url: '/free-site-audit',
      },
      mockupVariant: 'service_business',
      sortOrder: 1,
    });
  });

  it.each([
    'Expected impact: 34% more leads.',
    'Expected impact: $12,000 in added revenue.',
    'Expected impact: ranking #1 in local search.',
    'Expected impact: a 98 PageSpeed score.',
    'Expected impact: 42 new leads per month.',
  ])('rejects invented metric language: %s', (expectedBusinessImpact) => {
    expect(() =>
      mapTransformation({
        ...transformationRecord,
        acf: {
          ...transformationRecord.acf,
          expected_business_impact: expectedBusinessImpact,
        },
      }),
    ).toThrow(/Transformation expected impact must use qualitative language/);
  });
});

describe('WordPress post mapper', () => {
  it('maps posts into blog and RSS-ready view models', () => {
    const post = mapPost(postRecord);

    expect(post).toEqual({
      id: 108,
      slug: 'why-website-speed-affects-leads',
      title: 'Why website speed affects leads',
      excerpt: 'Speed shapes trust and action.',
      contentHtml: '<p>Slow pages make it harder for visitors to take the next step.</p>',
      publishedAt: '2026-08-08T12:00:00.000Z',
      updatedAt: '2026-08-08T13:00:00.000Z',
      canonicalPath: '/blog/why-website-speed-affects-leads',
      rss: {
        title: 'Why website speed affects leads',
        description: 'Speed shapes trust and action.',
        link: '/blog/why-website-speed-affects-leads',
        pubDate: '2026-08-08T12:00:00.000Z',
      },
      seo: {
        title: 'Why website speed affects leads',
        description: 'A practical guide to speed and lead generation.',
        ogImage: {
          url: 'https://cms.example.test/uploads/speed-og.png',
          alt: 'Abstract speed article graphic',
        },
      },
    });
  });
});
