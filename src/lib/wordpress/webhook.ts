import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

import { Redis } from '@upstash/redis';
import { and, desc, eq, inArray, lte } from 'drizzle-orm';

import { buildAdminBuildFailureEmail } from '../../emails/admin-alert-build-failure';
import { getEnv, type AppEnv } from '../config/env';
import { getDb, type Database } from '../db/client';
import { rebuildEvents } from '../db/schema';
import { sendEmail, type EmailSender } from '../email/resend';
import { parseEmailList } from '../email/templates';
import {
  createVercelDeploymentTracker,
  type VercelDeploymentRecord,
  type VercelDeploymentState,
  type VercelDeploymentTracker,
} from '../vercel/deployments';

const relevantContentTypes = new Set(['post', 'page', 'service', 'transformation', 'landing_page']);
const debounceMs = 120_000;
const longBuildThresholdMs = 5 * 60_000;
const rebuildLockKey = 'wordpress:rebuild:deploy';
const rebuildEnqueueLockKey = 'wordpress:rebuild:enqueue';
const rebuildLockTtlSeconds = 300;
const rebuildEnqueueLockTtlSeconds = 10;

export type WordPressWebhookErrorCode =
  | 'invalid_json'
  | 'invalid_payload'
  | 'invalid_signature'
  | 'missing_secret';

export interface WordPressWebhookPayload {
  contentType: string;
  contentId: number | string;
  slug: string;
  status: string;
  transition: string;
  timestamp: string;
  signature: string;
  sourceIp: string;
  rawBody: string;
}

export interface RebuildEventRecord {
  id: string;
  source: string;
  contentType: string;
  contentId: string;
  slug: string;
  transition: string;
  status: string;
  payload: unknown;
  eventHash: string;
  sourceIp: string;
  receivedAt: Date;
  scheduledAt: Date;
  processedAt: Date | null;
  deployStartedAt: Date | null;
  deployTriggeredAt: Date | null;
  deployFinishedAt: Date | null;
  buildDurationMs: number | null;
  deployResponseStatus: number | null;
  deploymentId: string | null;
  deploymentState: string | null;
  deploymentUrl: string | null;
  error: string | null;
  longBuildReviewRequired: boolean;
}

export interface RebuildProcessResult {
  triggered: boolean;
  processedEvents: number;
  failedEvents: number;
  buildDurationMs: number;
  architectureReviewRequired: boolean;
  skippedReason?: 'no_due_events' | 'lock_held' | 'deployment_pending';
}

export interface RebuildEventStore {
  insertEvent(record: RebuildEventRecord): Promise<boolean>;
  getLatestPendingScheduledAt(): Promise<Date | null>;
  reschedulePendingEvents(scheduledAt: Date): Promise<void>;
  listDuePendingEvents(now: Date): Promise<RebuildEventRecord[]>;
  listTriggeredEvents(): Promise<RebuildEventRecord[]>;
  markEventsProcessing(ids: string[], deployStartedAt: Date): Promise<void>;
  markEventsTriggered(
    ids: string[],
    values: {
      deployTriggeredAt: Date;
      deployResponseStatus: number;
    },
  ): Promise<void>;
  markEventsCompleted(
    ids: string[],
    values: {
      processedAt: Date;
      deployStartedAt: Date;
      deployFinishedAt: Date;
      buildDurationMs: number;
      deployResponseStatus: number | null;
      deploymentId: string;
      deploymentState: string;
      deploymentUrl: string | null;
      longBuildReviewRequired: boolean;
    },
  ): Promise<void>;
  markEventsFailed(
    ids: string[],
    values: {
      processedAt: Date;
      deployStartedAt: Date;
      deployFinishedAt: Date;
      buildDurationMs: number;
      deployResponseStatus: number | null;
      deploymentId: string | null;
      deploymentState: string | null;
      deploymentUrl: string | null;
      error: string;
      longBuildReviewRequired: boolean;
    },
  ): Promise<void>;
}

export interface RebuildLockStore {
  acquire(key: string, ttlSeconds: number): Promise<boolean>;
  release(key: string): Promise<void>;
}

export interface RebuildProcessor {
  enqueueRebuildEvent(payload: WordPressWebhookPayload): Promise<void>;
  processDueRebuildEvents(now: Date): Promise<RebuildProcessResult>;
}

interface RebuildProcessorOptions {
  eventStore: RebuildEventStore;
  lockStore: RebuildLockStore;
  deployHookUrl: string;
  deploymentTracker?: VercelDeploymentTracker | null;
  fetcher?: typeof fetch;
  emailSender?: EmailSender;
  alertRecipients?: string[];
  now?: () => Date;
}

export class WordPressWebhookError extends Error {
  readonly code: WordPressWebhookErrorCode;
  readonly status: number;

  constructor(code: WordPressWebhookErrorCode, message: string, status: number) {
    super(message);
    this.name = 'WordPressWebhookError';
    this.code = code;
    this.status = status;
  }
}

let configuredProcessor: RebuildProcessor | null = null;
let defaultProcessor: RebuildProcessor | null = null;

export async function verifyWordPressWebhook(
  request: Request,
  options: {
    env?: Pick<AppEnv, 'WORDPRESS_WEBHOOK_SECRET'>;
    sourceIp?: string;
  } = {},
): Promise<WordPressWebhookPayload> {
  const rawBody = await request.text();
  const secret = options.env?.WORDPRESS_WEBHOOK_SECRET ?? getEnv().WORDPRESS_WEBHOOK_SECRET;
  const signature = normalizeSignature(request.headers.get('x-ozmo-signature'));

  if (!secret) {
    throw new WordPressWebhookError(
      'missing_secret',
      'WORDPRESS_WEBHOOK_SECRET is required to verify WordPress webhooks.',
      500,
    );
  }

  if (!isValidSignature(rawBody, secret, signature)) {
    throw new WordPressWebhookError(
      'invalid_signature',
      'WordPress webhook signature is invalid.',
      401,
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch (error) {
    throw new WordPressWebhookError('invalid_json', 'WordPress webhook payload is not JSON.', 400);
  }

  const record = asRecord(body);

  return {
    contentType: requiredString(record.content_type, 'content_type'),
    contentId: requiredNumberOrString(record.content_id, 'content_id'),
    slug: requiredString(record.slug, 'slug'),
    status: requiredString(record.status, 'status'),
    transition: requiredString(record.transition, 'transition'),
    timestamp: requiredDateString(record.timestamp, 'timestamp'),
    signature,
    sourceIp: options.sourceIp || 'unknown',
    rawBody,
  };
}

export function createRebuildProcessor(options: RebuildProcessorOptions): RebuildProcessor {
  const fetcher = options.fetcher ?? globalThis.fetch.bind(globalThis);
  const getNow = options.now ?? (() => new Date());
  const emailSender = options.emailSender ?? sendEmail;
  const alertRecipients = options.alertRecipients ?? [];
  const deploymentTracker = options.deploymentTracker ?? null;

  return {
    async enqueueRebuildEvent(payload) {
      if (!isRelevantPublishedPayload(payload)) {
        return;
      }

      const acquiredLock = await options.lockStore.acquire(
        rebuildEnqueueLockKey,
        rebuildEnqueueLockTtlSeconds,
      );
      if (!acquiredLock) {
        throw new Error('Rebuild enqueue lock is currently held.');
      }

      try {
        const eventHash = createHash('sha256').update(payload.rawBody).digest('hex');
        const eventTime = new Date(payload.timestamp);
        const scheduledAtFromEvent = new Date(eventTime.getTime() + debounceMs);
        const latestPendingScheduledAt = await options.eventStore.getLatestPendingScheduledAt();
        const scheduledAt =
          latestPendingScheduledAt && latestPendingScheduledAt > scheduledAtFromEvent
            ? latestPendingScheduledAt
            : scheduledAtFromEvent;

        const inserted = await options.eventStore.insertEvent({
          id: randomUUID(),
          source: 'wordpress',
          contentType: payload.contentType,
          contentId: String(payload.contentId),
          slug: payload.slug,
          transition: payload.transition,
          status: 'pending',
          payload: {
            contentType: payload.contentType,
            contentId: payload.contentId,
            slug: payload.slug,
            status: payload.status,
            transition: payload.transition,
            timestamp: payload.timestamp,
          },
          eventHash,
          sourceIp: payload.sourceIp || 'unknown',
          receivedAt: getNow(),
          scheduledAt,
          processedAt: null,
          deployStartedAt: null,
          deployTriggeredAt: null,
          deployFinishedAt: null,
          buildDurationMs: null,
          deployResponseStatus: null,
          deploymentId: null,
          deploymentState: null,
          deploymentUrl: null,
          error: null,
          longBuildReviewRequired: false,
        });

        if (inserted) {
          await options.eventStore.reschedulePendingEvents(scheduledAt);
        }
      } finally {
        await options.lockStore.release(rebuildEnqueueLockKey);
      }
    },

    async processDueRebuildEvents(now) {
      const triggeredEvents = await options.eventStore.listTriggeredEvents();
      if (triggeredEvents.length > 0) {
        return processTriggeredDeployment({
          events: triggeredEvents,
          deploymentTracker,
          eventStore: options.eventStore,
          emailSender,
          alertRecipients,
          now,
        });
      }

      const dueEvents = await options.eventStore.listDuePendingEvents(now);

      if (dueEvents.length === 0) {
        return emptyProcessResult('no_due_events');
      }

      const acquiredLock = await options.lockStore.acquire(rebuildLockKey, rebuildLockTtlSeconds);
      if (!acquiredLock) {
        return emptyProcessResult('lock_held');
      }

      const ids = dueEvents.map((event) => event.id);
      const deployStartedAt = getNow();
      await options.eventStore.markEventsProcessing(ids, deployStartedAt);

      try {
        const response = await fetcher(options.deployHookUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            source: 'wordpress',
            eventCount: dueEvents.length,
            eventIds: ids,
          }),
        });
        const deployTriggeredAt = getNow();
        const hookDurationMs = deployTriggeredAt.getTime() - deployStartedAt.getTime();

        if (!response.ok) {
          const failureReason = `Deploy hook returned HTTP ${response.status}.`;
          await options.eventStore.markEventsFailed(ids, {
            processedAt: deployTriggeredAt,
            deployStartedAt,
            deployFinishedAt: deployTriggeredAt,
            buildDurationMs: hookDurationMs,
            deployResponseStatus: response.status,
            deploymentId: null,
            deploymentState: null,
            deploymentUrl: null,
            error: failureReason,
            longBuildReviewRequired: false,
          });
          await sendBuildAlert(emailSender, alertRecipients, {
            reason: failureReason,
            eventCount: dueEvents.length,
            buildDurationMs: hookDurationMs,
            architectureReviewRequired: false,
            occurredAt: deployTriggeredAt,
          });

          return {
            triggered: false,
            processedEvents: 0,
            failedEvents: dueEvents.length,
            buildDurationMs: hookDurationMs,
            architectureReviewRequired: false,
          };
        }

        await options.eventStore.markEventsTriggered(ids, {
          deployTriggeredAt,
          deployResponseStatus: response.status,
        });

        return {
          triggered: true,
          processedEvents: dueEvents.length,
          failedEvents: 0,
          buildDurationMs: 0,
          architectureReviewRequired: false,
        };
      } catch (error) {
        const deployFinishedAt = getNow();
        const buildDurationMs = deployFinishedAt.getTime() - deployStartedAt.getTime();
        const architectureReviewRequired = buildDurationMs > longBuildThresholdMs;
        const failureReason =
          error instanceof Error ? error.message : 'Deploy hook failed before a response.';

        await options.eventStore.markEventsFailed(ids, {
          processedAt: deployFinishedAt,
          deployStartedAt,
          deployFinishedAt,
          buildDurationMs,
          deployResponseStatus: null,
          deploymentId: null,
          deploymentState: null,
          deploymentUrl: null,
          error: failureReason,
          longBuildReviewRequired: architectureReviewRequired,
        });
        await sendBuildAlert(emailSender, alertRecipients, {
          reason: failureReason,
          eventCount: dueEvents.length,
          buildDurationMs,
          architectureReviewRequired,
          occurredAt: deployFinishedAt,
        });

        return {
          triggered: false,
          processedEvents: 0,
          failedEvents: dueEvents.length,
          buildDurationMs,
          architectureReviewRequired,
        };
      } finally {
        await options.lockStore.release(rebuildLockKey);
      }
    },
  };
}

async function processTriggeredDeployment(input: {
  events: RebuildEventRecord[];
  deploymentTracker: VercelDeploymentTracker | null;
  eventStore: RebuildEventStore;
  emailSender: EmailSender;
  alertRecipients: string[];
  now: Date;
}): Promise<RebuildProcessResult> {
  if (!input.deploymentTracker) {
    return emptyProcessResult('deployment_pending');
  }

  const deployment = await input.deploymentTracker.findLatestDeploymentStartedAfter({
    since: getEarliestDeployTriggeredAt(input.events),
  });

  if (!deployment || !isTerminalDeploymentState(deployment.state)) {
    return emptyProcessResult('deployment_pending');
  }

  const ids = input.events.map((event) => event.id);
  const eventCount = input.events.length;
  const deployStartedAt = deployment.buildingAt ?? deployment.createdAt;
  const deployFinishedAt = deployment.readyAt ?? input.now;
  const buildDurationMs = Math.max(0, deployFinishedAt.getTime() - deployStartedAt.getTime());
  const architectureReviewRequired = buildDurationMs > longBuildThresholdMs;

  if (deployment.state === 'READY') {
    await input.eventStore.markEventsCompleted(ids, {
      processedAt: deployFinishedAt,
      deployStartedAt,
      deployFinishedAt,
      buildDurationMs,
      deployResponseStatus: getSharedDeployResponseStatus(input.events),
      deploymentId: deployment.id,
      deploymentState: deployment.state,
      deploymentUrl: deployment.url,
      longBuildReviewRequired: architectureReviewRequired,
    });

    if (architectureReviewRequired) {
      await sendBuildAlert(input.emailSender, input.alertRecipients, {
        reason: 'Build duration exceeded five minutes.',
        eventCount,
        buildDurationMs,
        architectureReviewRequired,
        occurredAt: deployFinishedAt,
      });
    }

    return {
      triggered: false,
      processedEvents: eventCount,
      failedEvents: 0,
      buildDurationMs,
      architectureReviewRequired,
    };
  }

  const failureReason = getDeploymentFailureReason(deployment);
  await input.eventStore.markEventsFailed(ids, {
    processedAt: deployFinishedAt,
    deployStartedAt,
    deployFinishedAt,
    buildDurationMs,
    deployResponseStatus: getSharedDeployResponseStatus(input.events),
    deploymentId: deployment.id,
    deploymentState: deployment.state,
    deploymentUrl: deployment.url,
    error: failureReason,
    longBuildReviewRequired: architectureReviewRequired,
  });
  await sendBuildAlert(input.emailSender, input.alertRecipients, {
    reason: failureReason,
    eventCount,
    buildDurationMs,
    architectureReviewRequired,
    occurredAt: deployFinishedAt,
  });

  return {
    triggered: false,
    processedEvents: 0,
    failedEvents: eventCount,
    buildDurationMs,
    architectureReviewRequired,
  };
}

export function configureRebuildProcessor(processor: RebuildProcessor | null) {
  configuredProcessor = processor;
}

export async function enqueueRebuildEvent(payload: WordPressWebhookPayload): Promise<void> {
  await getActiveRebuildProcessor().enqueueRebuildEvent(payload);
}

export async function processDueRebuildEvents(now: Date): Promise<RebuildProcessResult> {
  return getActiveRebuildProcessor().processDueRebuildEvents(now);
}

export function createInMemoryRebuildEventStore(): RebuildEventStore & {
  records: RebuildEventRecord[];
} {
  const records: RebuildEventRecord[] = [];

  return {
    records,

    async insertEvent(record) {
      if (records.some((existingRecord) => existingRecord.eventHash === record.eventHash)) {
        return false;
      }

      records.push(record);
      return true;
    },

    async getLatestPendingScheduledAt() {
      const pendingScheduledAt = records
        .filter((record) => record.status === 'pending')
        .map((record) => record.scheduledAt.getTime());

      if (pendingScheduledAt.length === 0) {
        return null;
      }

      return new Date(Math.max(...pendingScheduledAt));
    },

    async reschedulePendingEvents(scheduledAt) {
      for (const record of records) {
        if (record.status === 'pending') {
          record.scheduledAt = scheduledAt;
        }
      }
    },

    async listDuePendingEvents(now) {
      return records.filter(
        (record) => record.status === 'pending' && record.scheduledAt <= now,
      );
    },

    async listTriggeredEvents() {
      return records.filter((record) => record.status === 'triggered');
    },

    async markEventsProcessing(ids, deployStartedAt) {
      for (const record of records) {
        if (ids.includes(record.id)) {
          record.status = 'processing';
          record.deployStartedAt = deployStartedAt;
        }
      }
    },

    async markEventsTriggered(ids, values) {
      for (const record of records) {
        if (ids.includes(record.id)) {
          Object.assign(record, {
            status: 'triggered',
            deployTriggeredAt: values.deployTriggeredAt,
            deployResponseStatus: values.deployResponseStatus,
            error: null,
          });
        }
      }
    },

    async markEventsCompleted(ids, values) {
      for (const record of records) {
        if (ids.includes(record.id)) {
          Object.assign(record, {
            status: 'completed',
            processedAt: values.processedAt,
            deployStartedAt: values.deployStartedAt,
            deployFinishedAt: values.deployFinishedAt,
            buildDurationMs: values.buildDurationMs,
            deployResponseStatus: values.deployResponseStatus,
            deploymentId: values.deploymentId,
            deploymentState: values.deploymentState,
            deploymentUrl: values.deploymentUrl,
            error: null,
            longBuildReviewRequired: values.longBuildReviewRequired,
          });
        }
      }
    },

    async markEventsFailed(ids, values) {
      for (const record of records) {
        if (ids.includes(record.id)) {
          Object.assign(record, {
            status: 'failed',
            processedAt: values.processedAt,
            deployStartedAt: values.deployStartedAt,
            deployFinishedAt: values.deployFinishedAt,
            buildDurationMs: values.buildDurationMs,
            deployResponseStatus: values.deployResponseStatus,
            deploymentId: values.deploymentId,
            deploymentState: values.deploymentState,
            deploymentUrl: values.deploymentUrl,
            error: values.error,
            longBuildReviewRequired: values.longBuildReviewRequired,
          });
        }
      }
    },
  };
}

export function createInMemoryRebuildLockStore(): RebuildLockStore {
  const locks = new Map<string, number>();

  return {
    async acquire(key, ttlSeconds) {
      const now = Date.now();
      const existingExpiry = locks.get(key);

      if (existingExpiry && existingExpiry > now) {
        return false;
      }

      locks.set(key, now + ttlSeconds * 1000);
      return true;
    },

    async release(key) {
      locks.delete(key);
    },
  };
}

export function createUpstashRebuildLockStore(redis = Redis.fromEnv()): RebuildLockStore {
  const ownerTokens = new Map<string, string>();

  return {
    async acquire(key, ttlSeconds) {
      const ownerToken = randomUUID();
      const result = await redis.set(key, ownerToken, { nx: true, ex: ttlSeconds });

      if (result === 'OK') {
        ownerTokens.set(key, ownerToken);
      }

      return result === 'OK';
    },

    async release(key) {
      const ownerToken = ownerTokens.get(key);
      if (!ownerToken) {
        return;
      }

      await redis.eval(
        'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end',
        [key],
        [ownerToken],
      );
      ownerTokens.delete(key);
    },
  };
}

export function createDrizzleRebuildEventStore(db: Database): RebuildEventStore {
  return {
    async insertEvent(record) {
      const rows = await db
        .insert(rebuildEvents)
        .values(record as typeof rebuildEvents.$inferInsert)
        .onConflictDoNothing({ target: rebuildEvents.eventHash })
        .returning({ id: rebuildEvents.id });

      return rows.length > 0;
    },

    async getLatestPendingScheduledAt() {
      const rows = await db
        .select()
        .from(rebuildEvents)
        .where(eq(rebuildEvents.status, 'pending'))
        .orderBy(desc(rebuildEvents.scheduledAt))
        .limit(1);

      return rows[0]?.scheduledAt ?? null;
    },

    async reschedulePendingEvents(scheduledAt) {
      await db
        .update(rebuildEvents)
        .set({ scheduledAt })
        .where(eq(rebuildEvents.status, 'pending'));
    },

    async listDuePendingEvents(now) {
      return db
        .select()
        .from(rebuildEvents)
        .where(and(eq(rebuildEvents.status, 'pending'), lte(rebuildEvents.scheduledAt, now)))
        .limit(100);
    },

    async listTriggeredEvents() {
      return db
        .select()
        .from(rebuildEvents)
        .where(eq(rebuildEvents.status, 'triggered'))
        .orderBy(desc(rebuildEvents.deployTriggeredAt))
        .limit(100);
    },

    async markEventsProcessing(ids, deployStartedAt) {
      await db
        .update(rebuildEvents)
        .set({ status: 'processing', deployStartedAt })
        .where(inArray(rebuildEvents.id, ids));
    },

    async markEventsTriggered(ids, values) {
      await db
        .update(rebuildEvents)
        .set({
          status: 'triggered',
          deployTriggeredAt: values.deployTriggeredAt,
          deployResponseStatus: values.deployResponseStatus,
          error: null,
        })
        .where(inArray(rebuildEvents.id, ids));
    },

    async markEventsCompleted(ids, values) {
      await db
        .update(rebuildEvents)
        .set({
          status: 'completed',
          processedAt: values.processedAt,
          deployStartedAt: values.deployStartedAt,
          deployFinishedAt: values.deployFinishedAt,
          buildDurationMs: values.buildDurationMs,
          deployResponseStatus: values.deployResponseStatus,
          deploymentId: values.deploymentId,
          deploymentState: values.deploymentState,
          deploymentUrl: values.deploymentUrl,
          longBuildReviewRequired: values.longBuildReviewRequired,
          error: null,
        })
        .where(inArray(rebuildEvents.id, ids));
    },

    async markEventsFailed(ids, values) {
      await db
        .update(rebuildEvents)
        .set({
          status: 'failed',
          processedAt: values.processedAt,
          deployStartedAt: values.deployStartedAt,
          deployFinishedAt: values.deployFinishedAt,
          buildDurationMs: values.buildDurationMs,
          deployResponseStatus: values.deployResponseStatus,
          deploymentId: values.deploymentId,
          deploymentState: values.deploymentState,
          deploymentUrl: values.deploymentUrl,
          error: values.error,
          longBuildReviewRequired: values.longBuildReviewRequired,
        })
        .where(inArray(rebuildEvents.id, ids));
    },
  };
}

function getActiveRebuildProcessor(): RebuildProcessor {
  if (configuredProcessor) {
    return configuredProcessor;
  }

  defaultProcessor ??= createDefaultRebuildProcessor();
  return defaultProcessor;
}

function createDefaultRebuildProcessor(): RebuildProcessor {
  const env = getEnv();

  if (!env.VERCEL_DEPLOY_HOOK_URL) {
    throw new Error('VERCEL_DEPLOY_HOOK_URL is required before processing rebuild events.');
  }

  const alertRecipients = parseEmailList(env.INTERNAL_ALERT_EMAILS);
  if (isProductionRuntime() && alertRecipients.length === 0) {
    throw new Error('INTERNAL_ALERT_EMAILS is required for production rebuild alerts.');
  }

  return createRebuildProcessor({
    eventStore: createDrizzleRebuildEventStore(getDb()),
    lockStore: createDefaultLockStore(env),
    deployHookUrl: env.VERCEL_DEPLOY_HOOK_URL,
    deploymentTracker: createDefaultDeploymentTracker(env),
    alertRecipients,
  });
}

function createDefaultLockStore(env: Pick<AppEnv, 'UPSTASH_REDIS_REST_URL' | 'UPSTASH_REDIS_REST_TOKEN'>) {
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    return createUpstashRebuildLockStore();
  }

  if (isProductionRuntime()) {
    throw new Error(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required for production rebuild locking.',
    );
  }

  return createInMemoryRebuildLockStore();
}

function createDefaultDeploymentTracker(
  env: Pick<
    AppEnv,
    | 'VERCEL_API_TOKEN'
    | 'VERCEL_PROJECT_ID'
    | 'VERCEL_TEAM_ID'
    | 'VERCEL_DEPLOY_TARGET'
    | 'VERCEL_DEPLOY_BRANCH'
  >,
) {
  if (env.VERCEL_API_TOKEN && env.VERCEL_PROJECT_ID) {
    return createVercelDeploymentTracker({
      apiToken: env.VERCEL_API_TOKEN,
      projectId: env.VERCEL_PROJECT_ID,
      teamId: env.VERCEL_TEAM_ID || undefined,
      target: env.VERCEL_DEPLOY_TARGET,
      branch: env.VERCEL_DEPLOY_BRANCH,
    });
  }

  if (isProductionRuntime()) {
    throw new Error('VERCEL_API_TOKEN and VERCEL_PROJECT_ID are required for production rebuild tracking.');
  }

  return null;
}

function isRelevantPublishedPayload(payload: WordPressWebhookPayload) {
  return payload.status === 'publish' && relevantContentTypes.has(payload.contentType);
}

function normalizeSignature(signature: string | null) {
  return (signature || '').replace(/^sha256=/, '').trim();
}

function isValidSignature(body: string, secret: string, signature: string) {
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  const actualBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new WordPressWebhookError('invalid_payload', 'Webhook payload must be an object.', 400);
  }

  return value as Record<string, unknown>;
}

function requiredString(value: unknown, label: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new WordPressWebhookError(
      'invalid_payload',
      `Webhook payload field ${label} must be a non-empty string.`,
      400,
    );
  }

  return value.trim();
}

function requiredNumberOrString(value: unknown, label: string) {
  if (
    (typeof value !== 'number' || !Number.isFinite(value)) &&
    (typeof value !== 'string' || value.trim() === '')
  ) {
    throw new WordPressWebhookError(
      'invalid_payload',
      `Webhook payload field ${label} must be a number or non-empty string.`,
      400,
    );
  }

  return value;
}

function requiredDateString(value: unknown, label: string) {
  const dateString = requiredString(value, label);
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    throw new WordPressWebhookError(
      'invalid_payload',
      `Webhook payload field ${label} must be a valid date string.`,
      400,
    );
  }

  return date.toISOString();
}

async function sendBuildAlert(
  emailSender: EmailSender,
  recipients: string[],
  input: {
    reason: string;
    eventCount: number;
    buildDurationMs: number;
    architectureReviewRequired: boolean;
    occurredAt: Date;
  },
) {
  if (recipients.length === 0) {
    throw new Error('INTERNAL_ALERT_EMAILS is required before sending rebuild alerts.');
  }

  const template = buildAdminBuildFailureEmail(input);

  await emailSender({
    to: recipients,
    ...template,
  });
}

function getEarliestDeployTriggeredAt(events: RebuildEventRecord[]) {
  const timestamps = events
    .map((event) => event.deployTriggeredAt?.getTime())
    .filter((timestamp): timestamp is number => typeof timestamp === 'number');

  if (timestamps.length === 0) {
    return new Date(0);
  }

  return new Date(Math.min(...timestamps));
}

function getSharedDeployResponseStatus(events: RebuildEventRecord[]) {
  return events.find((event) => event.deployResponseStatus !== null)?.deployResponseStatus ?? null;
}

function isTerminalDeploymentState(state: VercelDeploymentState) {
  return (
    state === 'READY' ||
    state === 'ERROR' ||
    state === 'CANCELED' ||
    state === 'BLOCKED' ||
    state === 'DELETED'
  );
}

function getDeploymentFailureReason(deployment: VercelDeploymentRecord) {
  if (deployment.errorMessage) {
    return deployment.errorMessage;
  }

  if (deployment.errorCode) {
    return `Vercel deployment failed with ${deployment.errorCode}.`;
  }

  return `Vercel deployment finished with ${deployment.state}.`;
}

function isProductionRuntime() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

function emptyProcessResult(
  skippedReason: 'no_due_events' | 'lock_held' | 'deployment_pending',
): RebuildProcessResult {
  return {
    triggered: false,
    processedEvents: 0,
    failedEvents: 0,
    buildDurationMs: 0,
    architectureReviewRequired: false,
    skippedReason,
  };
}
