import { createHash } from 'node:crypto';
import { eq } from 'drizzle-orm';

import { getEnv } from '../config/env';
import { getDb } from '../db/client';
import { contentSnapshots } from '../db/schema';

export interface ContentSnapshotRecord {
  contentType: string;
  snapshotKey: string;
  payload: unknown;
  payloadHash: string;
  capturedAt: Date;
  usedAt: Date | null;
}

export interface ContentSnapshotWrite {
  contentType: string;
  snapshotKey: string;
  payload: unknown;
  payloadHash: string;
  capturedAt: Date;
}

export interface SnapshotStore {
  readSnapshot<T>(snapshotKey: string): Promise<T | null>;
  writeSnapshot(snapshotKey: string, payload: unknown): Promise<void>;
}

export interface SnapshotStoreAdapter {
  readLatestSnapshot(snapshotKey: string): Promise<ContentSnapshotRecord | null>;
  upsertSnapshot(record: ContentSnapshotWrite): Promise<void>;
  markSnapshotUsed(snapshotKey: string, usedAt: Date): Promise<void>;
}

interface DrizzleSnapshotDatabase {
  select(): {
    from(table: typeof contentSnapshots): {
      where(condition: unknown): {
        limit(limit: number): Promise<ContentSnapshotRecord[]>;
      };
    };
  };
  insert(table: typeof contentSnapshots): {
    values(record: ContentSnapshotWrite): {
      onConflictDoUpdate(config: unknown): Promise<unknown> | unknown;
    };
  };
  update(table: typeof contentSnapshots): {
    set(values: { usedAt: Date | null }): {
      where(condition: unknown): Promise<unknown> | unknown;
    };
  };
}

let configuredStore: SnapshotStore | null = null;
let databaseSnapshotStore: SnapshotStore | null = null;

export function createSnapshotStore(
  adapter: SnapshotStoreAdapter,
  options: { now?: () => Date } = {},
): SnapshotStore {
  const getNow = options.now ?? (() => new Date());

  return {
    async readSnapshot<T>(snapshotKey: string): Promise<T | null> {
      const record = await adapter.readLatestSnapshot(snapshotKey);

      if (!record) {
        return null;
      }

      if (hashSnapshotPayload(record.payload) !== record.payloadHash) {
        return null;
      }

      await adapter.markSnapshotUsed(snapshotKey, getNow());

      return record.payload as T;
    },

    async writeSnapshot(snapshotKey: string, payload: unknown) {
      await adapter.upsertSnapshot({
        contentType: contentTypeFromSnapshotKey(snapshotKey),
        snapshotKey,
        payload,
        payloadHash: hashSnapshotPayload(payload),
        capturedAt: getNow(),
      });
    },
  };
}

export function createDrizzleSnapshotStore(
  db: DrizzleSnapshotDatabase,
  options: { now?: () => Date } = {},
): SnapshotStore {
  return createSnapshotStore(
    {
      async readLatestSnapshot(snapshotKey) {
        const rows = await db
          .select()
          .from(contentSnapshots)
          .where(eq(contentSnapshots.snapshotKey, snapshotKey))
          .limit(1);

        return rows[0] ?? null;
      },

      async upsertSnapshot(record) {
        await db
          .insert(contentSnapshots)
          .values(record)
          .onConflictDoUpdate({
            target: contentSnapshots.snapshotKey,
            set: {
              contentType: record.contentType,
              payload: record.payload,
              payloadHash: record.payloadHash,
              capturedAt: record.capturedAt,
              usedAt: null,
            },
          });
      },

      async markSnapshotUsed(snapshotKey, usedAt) {
        await db
          .update(contentSnapshots)
          .set({ usedAt })
          .where(eq(contentSnapshots.snapshotKey, snapshotKey));
      },
    },
    options,
  );
}

export function configureSnapshotStore(store: SnapshotStore | null) {
  configuredStore = store;
}

export async function readSnapshot<T>(snapshotKey: string): Promise<T | null> {
  const store = getActiveSnapshotStore();
  if (!store) {
    return null;
  }

  return store.readSnapshot<T>(snapshotKey);
}

export async function writeSnapshot(snapshotKey: string, payload: unknown): Promise<void> {
  const store = getActiveSnapshotStore();
  if (!store) {
    return;
  }

  await store.writeSnapshot(snapshotKey, payload);
}

export function hashSnapshotPayload(payload: unknown): string {
  return createHash('sha256').update(stableStringify(payload)).digest('hex');
}

export const defaultSnapshotStore: SnapshotStore = {
  readSnapshot,
  writeSnapshot,
};

function contentTypeFromSnapshotKey(snapshotKey: string): string {
  const parts = snapshotKey.split(':').filter(Boolean);
  return parts.at(-1) || snapshotKey;
}

function getActiveSnapshotStore(): SnapshotStore | null {
  if (configuredStore) {
    return configuredStore;
  }

  const env = getEnv();
  if (!env.DATABASE_URL) {
    return null;
  }

  databaseSnapshotStore ??= createDrizzleSnapshotStore(getDb());
  return databaseSnapshotStore;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
}
