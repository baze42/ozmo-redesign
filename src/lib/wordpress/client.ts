import { getEnv } from '../config/env';

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
      const services = await fetchMappedCollection(
        'service',
        'service?status=publish&per_page=100&_embed=1',
        'wordpress:services',
        mapService,
      );

      if (services.length === 0) {
        throw new WordPressClientError(
          'required_content_empty',
          'service',
          'WordPress returned no published services. The /services build gate requires content.',
        );
      }

      return services;
    },

    async getTransformations() {
      const transformations = await fetchMappedCollection(
        'transformation',
        'transformation?status=publish&per_page=100&_embed=1',
        'wordpress:transformations',
        mapTransformation,
      );

      if (transformations.length === 0) {
        throw new WordPressClientError(
          'required_content_empty',
          'transformation',
          'WordPress returned no published transformations. The /portfolio build gate requires content.',
        );
      }

      return transformations;
    },

    async getPublishedPosts() {
      const posts = await fetchMappedCollection(
        'post',
        'posts?status=publish&per_page=100&_embed=1',
        'wordpress:posts',
        mapPost,
      );

      if (productionLaunchApproved && posts.length < 3) {
        throw new WordPressClientError(
          'blog_launch_minimum_not_met',
          'post',
          'Production launch requires at least 3 published WordPress posts.',
        );
      }

      return posts;
    },
  };
}

export function getServices() {
  return createDefaultClient().getServices();
}

export function getTransformations() {
  return createDefaultClient().getTransformations();
}

export function getPublishedPosts() {
  return createDefaultClient().getPublishedPosts();
}

function createDefaultClient() {
  const env = getEnv();

  return createWordPressClient({
    apiBaseUrl: env.WORDPRESS_API_BASE_URL,
    productionLaunchApproved: env.PRODUCTION_LAUNCH_APPROVED,
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
