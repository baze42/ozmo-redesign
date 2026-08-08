import { describe, expect, it } from 'vitest';

import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  buildServiceSchema,
} from '../../../src/lib/seo/schema';

function stringifySchema(schema: unknown) {
  return JSON.stringify(schema);
}

describe('structured data helpers', () => {
  it('emits Organization schema for OZMO without LocalBusiness semantics', () => {
    const schema = buildOrganizationSchema();
    const serialized = stringifySchema(schema);

    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe('OZMO Digital');
    expect(serialized).not.toContain('LocalBusiness');
    expect(serialized).not.toContain('ProfessionalService');
  });

  it('emits Service schema without ProfessionalService or LocalBusiness types', () => {
    const schema = buildServiceSchema({
      name: 'Website redesigns and performance improvements',
      description: 'Improve speed, clarity, trust, and lead capture.',
      url: 'https://ozmodigital.com/services',
    });
    const serialized = stringifySchema(schema);

    expect(schema['@type']).toBe('Service');
    expect(serialized).not.toContain('LocalBusiness');
    expect(serialized).not.toContain('ProfessionalService');
  });

  it('emits BlogPosting and BreadcrumbList schemas for eligible public pages', () => {
    const blogPosting = buildBlogPostingSchema({
      headline: 'Why website speed affects leads',
      description: 'A practical guide for small business websites.',
      url: 'https://ozmodigital.com/blog/why-speed-affects-leads',
      datePublished: '2026-08-08',
      dateModified: '2026-08-08',
    });
    const breadcrumbs = buildBreadcrumbSchema([
      { name: 'Home', url: 'https://ozmodigital.com/' },
      { name: 'Blog', url: 'https://ozmodigital.com/blog' },
    ]);

    expect(blogPosting['@type']).toBe('BlogPosting');
    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement).toHaveLength(2);
  });
});
