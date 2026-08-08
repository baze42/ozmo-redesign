import { createHash } from 'node:crypto';

import { getTableColumns, getTableName } from 'drizzle-orm';
import { describe, expect, it, vi } from 'vitest';

import { contentSnapshots } from '../../../src/lib/db/schema';
import {
  configureSnapshotStore,
  createDrizzleSnapshotStore,
  createSnapshotStore,
  hashSnapshotPayload,
  readSnapshot,
  type SnapshotStore,
  writeSnapshot,
} from '../../../src/lib/wordpress/snapshots';

const now = new Date('2026-08-08T20:00:00.000Z');

describe('content snapshots schema', () => {
  it('defines the Postgres content_snapshots table required by WordPress failure behavior', () => {
    expect(getTableName(contentSnapshots)).toBe('content_snapshots');
    expect(Object.keys(getTableColumns(contentSnapshots)).sort()).toEqual([
      'capturedAt',
      'contentType',
      'payload',
      'payloadHash',
      'snapshotKey',
      'usedAt',
    ]);
  });
});

describe('hashSnapshotPayload', () => {
  it('creates stable SHA-256 hashes regardless of object key order', () => {
    const left = { b: 2, a: { d: 4, c: 3 } };
    const right = { a: { c: 3, d: 4 }, b: 2 };
    const expected = createHash('sha256').update('{"a":{"c":3,"d":4},"b":2}').digest('hex');

    expect(hashSnapshotPayload(left)).toBe(expected);
    expect(hashSnapshotPayload(right)).toBe(expected);
  });
});

describe('createSnapshotStore', () => {
  it('writes payloads with content type, stable hash, and capture timestamp', async () => {
    const adapter = {
      readLatestSnapshot: vi.fn(),
      upsertSnapshot: vi.fn(),
      markSnapshotUsed: vi.fn(),
    };
    const store = createSnapshotStore(adapter, { now: () => now });
    const payload = [{ slug: 'website-design' }];

    await store.writeSnapshot('wordpress:services', payload);

    expect(adapter.upsertSnapshot).toHaveBeenCalledWith({
      contentType: 'services',
      snapshotKey: 'wordpress:services',
      payload,
      payloadHash: hashSnapshotPayload(payload),
      capturedAt: now,
    });
  });

  it('returns valid snapshots and records that fallback content was used', async () => {
    const payload = [{ slug: 'website-design' }];
    const adapter = {
      readLatestSnapshot: vi.fn(async () => ({
        contentType: 'services',
        snapshotKey: 'wordpress:services',
        payload,
        payloadHash: hashSnapshotPayload(payload),
        capturedAt: now,
        usedAt: null,
      })),
      upsertSnapshot: vi.fn(),
      markSnapshotUsed: vi.fn(),
    };
    const store = createSnapshotStore(adapter, { now: () => now });

    const snapshot = await store.readSnapshot<Array<{ slug: string }>>('wordpress:services');

    expect(snapshot).toEqual(payload);
    expect(adapter.markSnapshotUsed).toHaveBeenCalledWith('wordpress:services', now);
  });

  it('rejects corrupted snapshots whose stored hash does not match the payload', async () => {
    const payload = [{ slug: 'website-design' }];
    const adapter = {
      readLatestSnapshot: vi.fn(async () => ({
        contentType: 'services',
        snapshotKey: 'wordpress:services',
        payload,
        payloadHash: 'not-the-real-hash',
        capturedAt: now,
        usedAt: null,
      })),
      upsertSnapshot: vi.fn(),
      markSnapshotUsed: vi.fn(),
    };
    const store = createSnapshotStore(adapter, { now: () => now });

    const snapshot = await store.readSnapshot('wordpress:services');

    expect(snapshot).toBeNull();
    expect(adapter.markSnapshotUsed).not.toHaveBeenCalled();
  });
});

describe('configured snapshot store', () => {
  it('delegates exported read and write helpers to the configured store', async () => {
    const readSnapshotSpy = vi.fn(async (_snapshotKey: string) => [{ slug: 'snapshot-service' }]);
    const writeSnapshotSpy = vi.fn();
    const store: SnapshotStore = {
      async readSnapshot<T>(snapshotKey: string) {
        return (await readSnapshotSpy(snapshotKey)) as T;
      },
      writeSnapshot: writeSnapshotSpy,
    };

    configureSnapshotStore(store);

    await expect(readSnapshot('wordpress:services')).resolves.toEqual([
      { slug: 'snapshot-service' },
    ]);
    await writeSnapshot('wordpress:services', [{ slug: 'fresh-service' }]);

    expect(readSnapshotSpy).toHaveBeenCalledWith('wordpress:services');
    expect(writeSnapshotSpy).toHaveBeenCalledWith('wordpress:services', [
      { slug: 'fresh-service' },
    ]);

    configureSnapshotStore(null);
  });
});

describe('createDrizzleSnapshotStore', () => {
  it('persists and reads snapshots through the content_snapshots table', async () => {
    const payload = [{ slug: 'website-design' }];
    const record = {
      contentType: 'services',
      snapshotKey: 'wordpress:services',
      payload,
      payloadHash: hashSnapshotPayload(payload),
      capturedAt: now,
      usedAt: null,
    };
    const onConflictDoUpdate = vi.fn();
    const values = vi.fn(() => ({ onConflictDoUpdate }));
    const insert = vi.fn(() => ({ values }));
    const limit = vi.fn(async () => [record]);
    const whereSelect = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where: whereSelect }));
    const select = vi.fn(() => ({ from }));
    const whereUpdate = vi.fn();
    const set = vi.fn(() => ({ where: whereUpdate }));
    const update = vi.fn(() => ({ set }));
    const db = { insert, select, update };
    const store = createDrizzleSnapshotStore(db, { now: () => now });

    await store.writeSnapshot('wordpress:services', payload);
    const snapshot = await store.readSnapshot('wordpress:services');

    expect(snapshot).toEqual(payload);
    expect(insert).toHaveBeenCalledWith(contentSnapshots);
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        contentType: 'services',
        snapshotKey: 'wordpress:services',
        payload,
        payloadHash: hashSnapshotPayload(payload),
        capturedAt: now,
      }),
    );
    expect(onConflictDoUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ target: contentSnapshots.snapshotKey }),
    );
    expect(select).toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(contentSnapshots);
    expect(set).toHaveBeenCalledWith({ usedAt: now });
  });
});
