import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const contentSnapshots = pgTable('content_snapshots', {
  contentType: text('content_type').notNull(),
  snapshotKey: text('snapshot_key').primaryKey(),
  payload: jsonb('payload').notNull(),
  payloadHash: text('payload_hash').notNull(),
  capturedAt: timestamp('captured_at', { withTimezone: true }).notNull().defaultNow(),
  usedAt: timestamp('used_at', { withTimezone: true }),
});
