type JsonLd = Record<string, unknown>;

const context = 'https://schema.org';
const organizationId = 'https://ozmodigital.com/#organization';

type ServiceSchemaInput = {
  name: string;
  description: string;
  url: string;
};

type BlogPostingSchemaInput = {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
};

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildOrganizationSchema(): JsonLd {
  return {
    '@context': context,
    '@id': organizationId,
    '@type': 'Organization',
    name: 'OZMO Digital',
    url: 'https://ozmodigital.com/',
    logo: 'https://ozmodigital.com/assets/ozmo-logo.png',
    sameAs: [],
  };
}

export function buildServiceSchema(input: ServiceSchemaInput): JsonLd {
  return {
    '@context': context,
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: input.url,
    provider: {
      '@id': organizationId,
      '@type': 'Organization',
      name: 'OZMO Digital',
    },
    areaServed: 'Geography-agnostic',
  };
}

export function buildBlogPostingSchema(input: BlogPostingSchemaInput): JsonLd {
  return {
    '@context': context,
    '@type': 'BlogPosting',
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: {
      '@id': organizationId,
      '@type': 'Organization',
      name: 'OZMO Digital',
    },
    publisher: buildOrganizationSchema(),
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': context,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
