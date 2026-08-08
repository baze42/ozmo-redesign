type UnknownRecord = Record<string, unknown>;

export interface ContentImage {
  url: string;
  alt: string;
}

export interface ContentSeo {
  title: string;
  description: string;
  ogImage?: ContentImage;
}

export interface ServiceViewModel {
  id: number;
  slug: string;
  title: string;
  summary: string;
  bodyHtml: string;
  businessOutcomes: string[];
  sections: Array<{ heading: string; body: string }>;
  cta: {
    label: string;
    url: string;
  };
  sortOrder: number;
  seo: ContentSeo;
  updatedAt: string;
}

export interface TransformationViewModel {
  id: number;
  slug: string;
  title: string;
  beforeState: string;
  whatIsNotWorking: string;
  ozmoImprovementPath: string;
  expectedBusinessImpact: string;
  cta: {
    label: string;
    url: string;
  };
  mockupVariant: string;
  sortOrder: number;
  seo: ContentSeo;
  updatedAt: string;
}

export interface PostViewModel {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  updatedAt: string;
  canonicalPath: string;
  rss: {
    title: string;
    description: string;
    link: string;
    pubDate: string;
  };
  seo: ContentSeo;
}

export class WordPressMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WordPressMappingError';
  }
}

export function mapService(input: unknown): ServiceViewModel {
  const record = asRecord(input, 'service record');
  const acf = asRecord(record.acf, 'service acf fields');
  const title = getRenderedText(record.title, 'service title');
  const summary = requiredString(acf.summary, 'service summary');
  const bodyHtml = getRenderedHtml(record.content, 'service content');

  return {
    id: requiredNumber(record.id, 'service id'),
    slug: requiredString(record.slug, 'service slug'),
    title,
    summary,
    bodyHtml,
    businessOutcomes: mapRepeater(acf.business_outcomes, 'service business outcomes', (item) =>
      requiredString(item.outcome, 'service business outcome'),
    ),
    sections: mapRepeater(acf.body_sections, 'service body sections', (item) => ({
      heading: requiredString(item.heading, 'service body section heading'),
      body: requiredString(item.body, 'service body section body'),
    })),
    cta: mapCta(acf, 'service'),
    sortOrder: requiredNumber(acf.sort_order, 'service sort order'),
    seo: mapSeo(acf, title, summary),
    updatedAt: mapDate(record.modified_gmt, 'service modified date'),
  };
}

export function mapTransformation(input: unknown): TransformationViewModel {
  const record = asRecord(input, 'transformation record');
  const acf = asRecord(record.acf, 'transformation acf fields');
  const title = getRenderedText(record.title, 'transformation title');
  const expectedBusinessImpact = requiredString(
    acf.expected_business_impact,
    'transformation expected business impact',
  );

  assertQualitativeImpact(expectedBusinessImpact);

  return {
    id: requiredNumber(record.id, 'transformation id'),
    slug: requiredString(record.slug, 'transformation slug'),
    title,
    beforeState: requiredString(acf.before_state, 'transformation before state'),
    whatIsNotWorking: requiredString(acf.what_is_not_working, 'transformation what is not working'),
    ozmoImprovementPath: requiredString(
      acf.ozmo_improvement_path,
      'transformation improvement path',
    ),
    expectedBusinessImpact,
    cta: mapCta(acf, 'transformation'),
    mockupVariant: requiredString(acf.mockup_variant, 'transformation mockup variant'),
    sortOrder: requiredNumber(acf.sort_order, 'transformation sort order'),
    seo: mapSeo(
      acf,
      title,
      textFromRendered(record.excerpt, 'transformation excerpt') || expectedBusinessImpact,
    ),
    updatedAt: mapDate(record.modified_gmt, 'transformation modified date'),
  };
}

export function mapPost(input: unknown): PostViewModel {
  const record = asRecord(input, 'post record');
  const acf = asRecord(record.acf ?? {}, 'post acf fields');
  const title = getRenderedText(record.title, 'post title');
  const excerpt = textFromRendered(record.excerpt, 'post excerpt');
  const slug = requiredString(record.slug, 'post slug');
  const canonicalPath = `/blog/${slug}`;
  const publishedAt = mapDate(record.date_gmt, 'post published date');

  return {
    id: requiredNumber(record.id, 'post id'),
    slug,
    title,
    excerpt,
    contentHtml: getRenderedHtml(record.content, 'post content'),
    publishedAt,
    updatedAt: mapDate(record.modified_gmt, 'post modified date'),
    canonicalPath,
    rss: {
      title,
      description: excerpt,
      link: canonicalPath,
      pubDate: publishedAt,
    },
    seo: mapSeo(acf, title, excerpt),
  };
}

function mapCta(acf: UnknownRecord, label: string) {
  return {
    label: requiredString(acf.cta_label, `${label} cta label`),
    url: requiredString(acf.cta_url, `${label} cta url`),
  };
}

function mapSeo(
  acf: UnknownRecord,
  fallbackTitle: string,
  fallbackDescription: string,
): ContentSeo {
  return {
    title: optionalString(acf.seo_title) || fallbackTitle,
    description: optionalString(acf.seo_description) || fallbackDescription,
    ogImage: mapImage(acf.og_image),
  };
}

function mapImage(value: unknown): ContentImage | undefined {
  if (!value) {
    return undefined;
  }

  const image = asRecord(value, 'image field');
  const url = requiredString(image.url, 'image url');

  return {
    url,
    alt: optionalString(image.alt) || '',
  };
}

function mapRepeater<T>(value: unknown, label: string, mapper: (item: UnknownRecord) => T): T[] {
  if (!Array.isArray(value)) {
    throw new WordPressMappingError(`Invalid ${label}: expected an array.`);
  }

  return value.map((item, index) => mapper(asRecord(item, `${label} item ${index + 1}`)));
}

function assertQualitativeImpact(value: string) {
  const prohibitedMetricPattern =
    /(%|\$|#\s*\d+|\b\d+(?:\.\d+)?\b|\bPageSpeed\b|\bspeed score\b|\blead count\b|\bleads?\s+per\b|\branking\b|\branked\b|\bbenchmark\b)/i;

  if (prohibitedMetricPattern.test(value)) {
    throw new WordPressMappingError(
      'Transformation expected impact must use qualitative language without invented metrics.',
    );
  }
}

function getRenderedText(value: unknown, label: string): string {
  return stripHtml(getRenderedHtml(value, label));
}

function textFromRendered(value: unknown, label: string): string {
  return stripHtml(getRenderedHtml(value, label));
}

function getRenderedHtml(value: unknown, label: string): string {
  const record = asRecord(value, label);
  return requiredString(record.rendered, `${label} rendered value`);
}

function asRecord(value: unknown, label: string): UnknownRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new WordPressMappingError(`Invalid ${label}: expected an object.`);
  }

  return value as UnknownRecord;
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new WordPressMappingError(`Invalid ${label}: expected a non-empty string.`);
  }

  return decodeHtmlEntities(value.trim());
}

function optionalString(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return decodeHtmlEntities(value.trim());
}

function requiredNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new WordPressMappingError(`Invalid ${label}: expected a number.`);
  }

  return value;
}

function mapDate(value: unknown, label: string): string {
  const raw = requiredString(value, label);
  const date = new Date(`${raw.replace(/Z$/, '')}Z`);

  if (Number.isNaN(date.getTime())) {
    throw new WordPressMappingError(`Invalid ${label}: expected an ISO date string.`);
  }

  return date.toISOString();
}

function stripHtml(value: string): string {
  return decodeHtmlEntities(
    value
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}
