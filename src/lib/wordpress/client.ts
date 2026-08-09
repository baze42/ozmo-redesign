import { getEnv } from '../config/env';
import { buildWordPressSnapshotFallbackEmail } from '../../emails/admin-alert-wordpress-snapshot';
import { sendEmail } from '../email/resend';
import { parseEmailList } from '../email/templates';

import {
  WordPressMappingError,
  mapPost,
  mapService,
  mapTransformation,
  type PostViewModel,
  type ServiceViewModel,
  type TransformationViewModel,
} from './mappers';
import { defaultSnapshotStore, type SnapshotStore } from './snapshots';

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;
type ContentType = 'service' | 'transformation' | 'post';

type WordPressClientErrorCode =
  | 'blog_launch_minimum_not_met'
  | 'invalid_response'
  | 'required_content_empty'
  | 'wordpress_http_error'
  | 'wordpress_timeout'
  | 'wordpress_unreachable';

export interface WordPressAlert {
  contentType: ContentType;
  snapshotKey: string;
  error: WordPressClientError;
}

export interface WordPressClientOptions {
  apiBaseUrl: string;
  fetcher?: FetchLike;
  snapshots?: SnapshotStore;
  timeoutMs?: number;
  productionLaunchApproved?: boolean;
  onAlert?: (alert: WordPressAlert) => Promise<void> | void;
}

export interface WordPressClient {
  getServices(): Promise<ServiceViewModel[]>;
  getTransformations(): Promise<TransformationViewModel[]>;
  getPublishedPosts(): Promise<PostViewModel[]>;
}

export type DefaultWordPressClientEnv = Pick<
  ReturnType<typeof getEnv>,
  'WORDPRESS_API_BASE_URL' | 'PRODUCTION_LAUNCH_APPROVED' | 'INTERNAL_ALERT_EMAILS'
>;

export class WordPressClientError extends Error {
  readonly code: WordPressClientErrorCode;
  readonly contentType: ContentType;
  readonly status?: number;

  constructor(
    code: WordPressClientErrorCode,
    contentType: ContentType,
    message: string,
    options: { cause?: unknown; status?: number } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'WordPressClientError';
    this.code = code;
    this.contentType = contentType;
    this.status = options.status;
  }
}

export function createWordPressClient(options: WordPressClientOptions): WordPressClient {
  const apiBaseUrl = normalizeBaseUrl(options.apiBaseUrl);
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
  const snapshots = options.snapshots ?? defaultSnapshotStore;
  const timeoutMs = options.timeoutMs ?? 5000;
  const productionLaunchApproved = options.productionLaunchApproved ?? false;

  async function fetchMappedCollection<T>(
    contentType: ContentType,
    endpoint: string,
    snapshotKey: string,
    mapper: (item: unknown) => T,
    validate: (items: T[]) => void = () => undefined,
  ): Promise<T[]> {
    let rawItems: unknown[];

    try {
      rawItems = await fetchRawCollection(
        contentType,
        `${apiBaseUrl}/${endpoint}`,
        fetcher,
        timeoutMs,
      );
    } catch (error) {
      return readLastKnownGood<T>(contentType, snapshotKey, snapshots, normalizeClientError(error));
    }

    let mapped: T[];
    try {
      mapped = rawItems.map((item) => mapper(item)).sort(sortByOptionalSortOrder);
    } catch (error) {
      if (error instanceof WordPressMappingError) {
        throw new WordPressClientError('invalid_response', contentType, error.message, {
          cause: error,
        });
      }

      throw error;
    }

    validate(mapped);
    await snapshots.writeSnapshot(snapshotKey, mapped);

    return mapped;
  }

  async function readLastKnownGood<T>(
    contentType: ContentType,
    snapshotKey: string,
    store: SnapshotStore,
    error: WordPressClientError,
  ): Promise<T[]> {
    const snapshot = await store.readSnapshot<T[]>(snapshotKey);

    if (Array.isArray(snapshot)) {
      await options.onAlert?.({ contentType, snapshotKey, error });
      return snapshot;
    }

    throw error;
  }

  return {
    async getServices() {
      return fetchMappedCollection(
        'service',
        'service?status=publish&per_page=100&_embed=1',
        'wordpress:services',
        mapService,
        (services) => {
          if (services.length === 0) {
            throw new WordPressClientError(
              'required_content_empty',
              'service',
              'WordPress returned no published services. The /services build gate requires content.',
            );
          }
        },
      );
    },

    async getTransformations() {
      return fetchMappedCollection(
        'transformation',
        'transformation?status=publish&per_page=100&_embed=1',
        'wordpress:transformations',
        mapTransformation,
        (transformations) => {
          if (transformations.length === 0) {
            throw new WordPressClientError(
              'required_content_empty',
              'transformation',
              'WordPress returned no published transformations. The /portfolio build gate requires content.',
            );
          }
        },
      );
    },

    async getPublishedPosts() {
      return fetchMappedCollection(
        'post',
        'posts?status=publish&per_page=100&_embed=1',
        'wordpress:posts',
        mapPost,
        (posts) => {
          if (productionLaunchApproved && posts.length < 3) {
            throw new WordPressClientError(
              'blog_launch_minimum_not_met',
              'post',
              'Production launch requires at least 3 published WordPress posts.',
            );
          }
        },
      );
    },
  };
}

export function getServices() {
  return createDefaultWordPressClient().getServices();
}

export function getTransformations() {
  return createDefaultWordPressClient().getTransformations();
}

export function getPublishedPosts() {
  return createDefaultWordPressClient().getPublishedPosts();
}

export function createDefaultWordPressClient(env: DefaultWordPressClientEnv = getEnv()) {
  const alertRecipients = parseEmailList(env.INTERNAL_ALERT_EMAILS);

  return createWordPressClient({
    apiBaseUrl: env.WORDPRESS_API_BASE_URL,
    productionLaunchApproved: env.PRODUCTION_LAUNCH_APPROVED,
    onAlert: async (alert) => {
      if (alertRecipients.length === 0) {
        throw new Error('INTERNAL_ALERT_EMAILS is required before using WordPress snapshots.');
      }

      await sendEmail({
        to: alertRecipients,
        ...buildWordPressSnapshotFallbackEmail(alert),
      });
    },
  });
}

async function fetchRawCollection(
  contentType: ContentType,
  url: string,
  fetcher: FetchLike,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetcher(url, { signal: controller.signal });

    if (!response.ok) {
      throw new WordPressClientError(
        'wordpress_http_error',
        contentType,
        `WordPress returned HTTP ${response.status} for ${contentType}.`,
        { status: response.status },
      );
    }

    const body: unknown = await response.json();
    if (!Array.isArray(body)) {
      throw new WordPressClientError(
        'invalid_response',
        contentType,
        `WordPress ${contentType} response must be an array.`,
      );
    }

    return body;
  } catch (error) {
    if (error instanceof WordPressClientError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new WordPressClientError(
        'wordpress_timeout',
        contentType,
        `WordPress ${contentType} request timed out after ${timeoutMs}ms.`,
        { cause: error },
      );
    }

    throw new WordPressClientError(
      'wordpress_unreachable',
      contentType,
      `WordPress ${contentType} request failed before a valid response was received.`,
      { cause: error },
    );
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeClientError(error: unknown): WordPressClientError {
  if (error instanceof WordPressClientError) {
    return error;
  }

  return new WordPressClientError(
    'wordpress_unreachable',
    'post',
    'WordPress request failed before a valid response was received.',
    { cause: error },
  );
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, '');
}

function sortByOptionalSortOrder<T>(left: T, right: T) {
  return getSortOrder(left) - getSortOrder(right);
}

function getSortOrder(value: unknown) {
  if (value && typeof value === 'object' && 'sortOrder' in value) {
    const sortOrder = (value as { sortOrder?: unknown }).sortOrder;

    if (typeof sortOrder === 'number') {
      return sortOrder;
    }
  }

  return 0;
}
