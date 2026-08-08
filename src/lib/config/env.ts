import { z } from 'zod';

const optionalString = z.string().optional().default('');

const envSchema = z.object({
  PUBLIC_SITE_URL: z.url().optional().default('https://ozmodigital.com'),
  PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1).optional().default('ozmodigital.com'),
  PUBLIC_PLAUSIBLE_SRC: z.url().optional().default('https://plausible.io/js/script.js'),

  WORDPRESS_API_BASE_URL: optionalString,
  WORDPRESS_WEBHOOK_SECRET: optionalString,
  VERCEL_DEPLOY_HOOK_URL: optionalString,
  CRON_SECRET: optionalString,

  DATABASE_URL: optionalString,
  DATABASE_DIRECT_URL: optionalString,

  UPSTASH_REDIS_REST_URL: optionalString,
  UPSTASH_REDIS_REST_TOKEN: optionalString,

  RESEND_API_KEY: optionalString,
  RESEND_FROM_EMAIL: optionalString,
  RESEND_REPLY_TO_EMAIL: optionalString,
  RESEND_WEBHOOK_SECRET: optionalString,

  AUTH_SECRET: optionalString,
  AUTH_GOOGLE_ID: optionalString,
  AUTH_GOOGLE_SECRET: optionalString,
  ADMIN_EMAIL_ALLOWLIST: optionalString,
  ENCRYPTION_KEY: optionalString,

  GOOGLE_CALENDAR_CLIENT_ID: optionalString,
  GOOGLE_CALENDAR_CLIENT_SECRET: optionalString,
  GOOGLE_CALENDAR_REDIRECT_URI: optionalString,
  GOOGLE_PRIMARY_BOOKING_CALENDAR_ID: optionalString,
  GOOGLE_BUSY_CALENDAR_IDS: optionalString,

  OZMO_BUSINESS_TIMEZONE: z.string().min(1).optional().default('America/Chicago'),
  OZMO_REVIEW_WEEKLY_CAPACITY: z.coerce.number().int().positive().optional().default(5),
  INTERNAL_ALERT_EMAILS: optionalString,
  PRODUCTION_LAUNCH_APPROVED: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((value) => value === 'true'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(source: Record<string, string | undefined> = process.env): AppEnv {
  const parsed = envSchema.safeParse(source);

  if (parsed.success) {
    return parsed.data;
  }

  const invalidKeys = parsed.error.issues
    .map((issue) => issue.path.join('.'))
    .filter(Boolean)
    .join(', ');

  throw new Error(`Invalid environment configuration: ${invalidKeys}`);
}
