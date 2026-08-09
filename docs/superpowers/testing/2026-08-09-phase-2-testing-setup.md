# OZMO Digital Phase 2 Testing Setup

This document describes the setup needed to test the project at the end of Phase 2. Phase 2 covers the Astro public site foundation, WordPress-owned public content, content snapshots, public pages, RSS/robots/sitemap behavior, the WordPress rebuild webhook, debounced rebuild processing, Vercel deploy-hook tracking, rate limiting, and alert email infrastructure.

Phase 3+ features are not implemented yet. Some environment variables already exist for later phases; they are documented here so `.env` stays complete, but they do not block Phase 2 public-content testing unless explicitly marked Phase 2.

Do not commit real secrets. `.env`, `.env.*`, `.vercel/`, build outputs, and test reports are ignored by git.

## 1. Confirm Repository State

Start from the pushed `main` branch.

```bash
cd /root/codex_projects/ozmo-redesign
git checkout main
git pull --ff-only origin main
git status --short
```

Expected:

- `git status --short` is empty.
- `git log -1 --oneline` shows Phase 2 at or after `d647cd0 fix: harden rebuild polling and fixture gates`.

## 2. Install Local Tooling

Use Node 22 or newer.

```bash
node --version
npm --version
npm install
npx playwright install --with-deps
```

The project is Astro + TypeScript with Vercel adapter output. Browser tests use Playwright; Lighthouse tests use the Playwright Chromium binary through `CHROME_PATH`.

## 3. Create Local Environment File

Copy the example and edit local values:

```bash
cp .env.example .env.local
```

Astro/Vite loads `.env` and `.env.local` during dev/build. Some CLI tools, especially Drizzle, read shell environment directly. For Drizzle migration commands, either export variables first or run them inline.

```bash
set -a
source .env.local
set +a
npm run db:migrate
```

or:

```bash
DATABASE_URL="postgresql://..." DATABASE_DIRECT_URL="postgresql://..." npm run db:migrate
```

## 4. Choose Testing Mode

There are two valid Phase 2 testing modes.

### Mode A: Local Fixture Verification

Use this when testing code, UI, browser behavior, RSS, sitemap, robots, accessibility, and performance without a live WordPress/Neon/Vercel stack.

The fixture path is intentionally explicit:

```bash
npm run build:local
npm run verify
```

`build:local` sets both:

```bash
OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES=true
OZMO_LOCAL_WORDPRESS_FIXTURE_CONTEXT=true
```

The code also blocks local fixtures when `VERCEL=1` or `CI=true`.

`npm run verify` runs:

```bash
npm run check
npm run test
npm run test:e2e
npm run test:lighthouse
```

### Mode B: Real Stack Verification

Use this to test true Phase 2 production behavior: WordPress REST content, Postgres content snapshots and rebuild events, Upstash rate limits and locks, Resend alerts, Vercel deploy hook triggering, and Vercel deployment polling.

In this mode, keep:

```bash
OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES=false
OZMO_LOCAL_WORDPRESS_FIXTURE_CONTEXT=false
```

Then configure WordPress, Neon, Upstash, Resend, and Vercel in the order below before running `npm run build`.

## 5. Environment Variables

Use `.env.local` for local testing and Vercel Project Settings -> Environment Variables for deployed testing. In Vercel, set production values on the Production environment; add Preview values only when testing preview deployments intentionally.

### Public Site

| Variable | Phase 2 need | How to set |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | Required for canonical URLs, robots sitemap URL, RSS links, and metadata. | Use `https://ozmodigital.com` for production. Use the deployed test URL only when intentionally testing a non-production canonical domain. |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Optional for Phase 2 analytics smoke testing. | Use the Plausible site domain, usually `ozmodigital.com`. |
| `PUBLIC_PLAUSIBLE_SRC` | Optional. | Usually `https://plausible.io/js/script.js`, unless using a first-party/proxy Plausible script URL. |

### WordPress And Rebuilds

| Variable | Phase 2 need | How to set |
| --- | --- | --- |
| `WORDPRESS_API_BASE_URL` | Required for real-stack `npm run build`. | WordPress REST v2 base, for example `https://cms.example.com/wp-json/wp/v2`. Do not set this to the WordPress admin URL. |
| `WORDPRESS_WEBHOOK_SECRET` | Required to verify WordPress publish webhooks. | Generate a long random secret. Use the same value in Astro/Vercel and the WordPress runtime. |
| `OZMO_ALLOW_LOCAL_WORDPRESS_FIXTURES` | Local fixture testing only. | `false` for real stack and Vercel. `true` only for deliberate local fixture commands. |
| `OZMO_LOCAL_WORDPRESS_FIXTURE_CONTEXT` | Local fixture testing only. | `false` for real stack and Vercel/CI. `true` only with `build:local` or `dev`. |
| `VERCEL_DEPLOY_HOOK_URL` | Required for rebuild processing. | Create a Vercel Deploy Hook for branch `main`; paste the generated secret URL. |
| `VERCEL_API_TOKEN` | Required in production to poll Vercel deployment status. | Create a Vercel account/team token with access to this project. |
| `VERCEL_PROJECT_ID` | Required in production to list deployments for the correct project. | Use the Vercel Project ID, typically `prj_...`. |
| `VERCEL_TEAM_ID` | Required only for team-owned Vercel projects. | Use the Vercel Team/Org ID. Leave blank for personal projects if API calls work without it. |
| `VERCEL_DEPLOY_TARGET` | Required by deployment polling. | Keep `production` for Phase 2 production rebuild testing. |
| `VERCEL_DEPLOY_BRANCH` | Required by deployment polling. | Keep `main`. |
| `CRON_SECRET` | Required to call `/api/cron/process-rebuilds`. | Generate a long random secret. Pass it as `Authorization: Bearer <secret>` or `x-cron-secret: <secret>`. |

### Database

| Variable | Phase 2 need | How to set |
| --- | --- | --- |
| `DATABASE_URL` | Required for real-stack snapshots and rebuild events. | Neon pooled Postgres connection string with TLS, normally ending with `?sslmode=require`. |
| `DATABASE_DIRECT_URL` | Required for migrations when using Neon pooling. | Neon direct connection string for Drizzle migration commands. If not using a separate direct URL locally, use the same value as `DATABASE_URL`. |

### Redis / Rate Limiting

| Variable | Phase 2 need | How to set |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` | Required in production for webhook rate limiting and rebuild locks. | Upstash Redis REST HTTPS URL. |
| `UPSTASH_REDIS_REST_TOKEN` | Required in production. | Upstash Redis REST token, not the read-only token. |

### Email

| Variable | Phase 2 need | How to set |
| --- | --- | --- |
| `RESEND_API_KEY` | Required to send snapshot fallback and rebuild failure alerts. | Resend API key with sending access for the verified sender domain. |
| `RESEND_FROM_EMAIL` | Required to send emails. | Example: `OZMO Digital <hello@mail.ozmodigital.com>`. The domain must be verified in Resend. |
| `RESEND_REPLY_TO_EMAIL` | Recommended. | Example: `hello@ozmodigital.com`. |
| `RESEND_WEBHOOK_SECRET` | Reserved for Phase 3 bounce/complaint webhook testing. | Leave blank for Phase 2 unless testing future email webhook behavior. |
| `INTERNAL_ALERT_EMAILS` | Required for production snapshot fallback and rebuild alerts. | Comma-separated recipients, for example `owner@ozmodigital.com,dev@example.com`. |

### Launch Gates

| Variable | Phase 2 need | How to set |
| --- | --- | --- |
| `PRODUCTION_LAUNCH_APPROVED` | Controls blog minimum enforcement. | `false` during prelaunch testing. Set `true` only after content/legal launch approval and after at least 3 published WordPress posts exist. |

### Reserved For Later Phases

These are present in `.env.example` because the V1 plan will need them, but Phase 2 does not exercise the admin console or scheduling flows yet.

| Variable | Later use | Setup guidance |
| --- | --- | --- |
| `AUTH_SECRET` | Auth.js admin auth. | Generate a cryptographically secure secret, for example `npx auth secret` or `openssl rand -base64 32`. |
| `AUTH_GOOGLE_ID` | Auth.js Google OAuth admin login. | Google Cloud OAuth 2.0 Web Client ID. |
| `AUTH_GOOGLE_SECRET` | Auth.js Google OAuth admin login. | Google Cloud OAuth 2.0 Web Client Secret. |
| `ADMIN_EMAIL_ALLOWLIST` | Admin access guard. | Comma-separated Google account emails allowed into admin. |
| `ENCRYPTION_KEY` | App-level encryption for future tokens/secrets. | Generate 32 bytes and base64 encode them: `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`. |
| `GOOGLE_CALENDAR_CLIENT_ID` | Scheduling owner OAuth. | Google Cloud OAuth 2.0 Web Client ID with Calendar API enabled. |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | Scheduling owner OAuth. | Google Cloud OAuth 2.0 Web Client Secret. |
| `GOOGLE_CALENDAR_REDIRECT_URI` | Scheduling OAuth callback. | Future route: `https://<site-domain>/api/admin/calendar/callback`. |
| `GOOGLE_PRIMARY_BOOKING_CALENDAR_ID` | Calendar event creation. | Calendar ID that will receive booking events. |
| `GOOGLE_BUSY_CALENDAR_IDS` | Free/busy checks. | Comma-separated calendar IDs to check for conflicts. |
| `OZMO_BUSINESS_TIMEZONE` | Scheduling defaults. | Default `America/Chicago`. |
| `OZMO_REVIEW_WEEKLY_CAPACITY` | Site review capacity. | Default `5`. |

## 6. Generate Secrets

Use one of these for random non-provider secrets:

```bash
openssl rand -hex 32
```

or:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Use generated values for:

- `WORDPRESS_WEBHOOK_SECRET`
- `CRON_SECRET`
- `RESEND_WEBHOOK_SECRET` when Phase 3 email webhooks are tested

Use a base64 32-byte value for:

- `ENCRYPTION_KEY`

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

## 7. Set Up WordPress First

The production-like Astro build depends on WordPress REST content, so configure WordPress before running `npm run build` against real data.

1. Install WordPress on the CMS host.
2. Install and activate Advanced Custom Fields Pro.
3. Copy `wordpress/mu-plugins/` into `wp-content/mu-plugins/`.
4. Sync `wordpress/acf-json/` into the WordPress ACF JSON directory.
5. In WordPress admin, sync the ACF field groups:
   - `OZMO Service Fields`
   - `OZMO Transformation Fields`
   - `OZMO Landing Page Fields`
6. Confirm these custom post types exist and are exposed through REST:
   - `service`
   - `transformation`
   - `landing_page`
7. Do not add testimonials. Testimonials are out of scope for V1.
8. Set WordPress runtime variables:

```bash
WORDPRESS_WEBHOOK_SECRET=<same value used by Astro/Vercel>
OZMO_REBUILD_WEBHOOK_URL=https://<site-domain>/api/webhooks/wordpress
```

`OZMO_REBUILD_WEBHOOK_URL` is a WordPress runtime variable used by `wordpress/mu-plugins/ozmo-rebuild-webhook.php`; it is not part of the Astro `.env.example`.

## 8. Seed Required WordPress Content

For real-stack build testing, create and publish WordPress content before building.

### Services

Create 6 published `service` entries:

1. Website design and builds
2. Website redesigns and performance improvements
3. Messaging and conversion strategy
4. Local SEO and basic SEO setup
5. Lead capture forms and follow-up automation
6. Ongoing website care and optimization

Each service needs:

- `summary`
- `business_outcomes`
- `body_sections`
- `cta_label`
- `cta_url`
- `sort_order`
- `seo_title`
- `seo_description`
- `og_image` if available

The build fails when published services are empty.

### Transformations

Create at least one published `transformation`; three are recommended to match fixture coverage:

1. Service business homepage with no clear next step
2. New business launch with no website
3. Lead form path that loses context

Use honest qualitative language only. Do not use fake testimonials, fake client names, fake metrics, dollar figures, invented rankings, invented speed scores, or invented lead counts.

The build fails when published transformations are empty.

### Blog Posts

For prelaunch:

- `PRODUCTION_LAUNCH_APPROVED=false`
- Fewer than 3 posts are allowed.
- `/blog` is `noindex` when fewer than 3 posts exist.
- RSS and sitemap blog URLs are gated until 3 posts exist.

For launch-approved production:

- `PRODUCTION_LAUNCH_APPROVED=true`
- At least 3 published WordPress posts are required.
- The build fails with fewer than 3 posts.

## 9. Set Up Neon Postgres

Phase 2 uses Postgres for:

- `content_snapshots`
- `rebuild_events`

Setup order:

1. Create a Neon project and database.
2. Create or select a role with password auth.
3. Copy a pooled connection string for `DATABASE_URL`.
4. Copy a direct connection string for `DATABASE_DIRECT_URL`.
5. Ensure both include TLS, usually `?sslmode=require`.
6. Export the variables locally before running migrations:

```bash
set -a
source .env.local
set +a
npm run db:migrate
```

7. In Vercel, add both values to the project environment variables.

Expected migration result:

- `content_snapshots` exists.
- `rebuild_events` exists.
- Drizzle journal is at migration index `0004`.

## 10. Set Up Upstash Redis

Phase 2 uses Upstash Redis for production webhook rate limiting and rebuild locks.

1. Create an Upstash Redis database.
2. Open the database details / REST API section.
3. Copy the REST URL into `UPSTASH_REDIS_REST_URL`.
4. Copy the REST token into `UPSTASH_REDIS_REST_TOKEN`.
5. Do not use the read-only token for this project.
6. Add both values to Vercel.

Local tests can run without Upstash because non-production code falls back to in-memory rate limiting and locks. Vercel production requires Upstash.

## 11. Set Up Resend

Phase 2 uses Resend for internal alerts when:

- WordPress is unreachable and a last-known-good snapshot is used.
- Rebuild/deploy processing fails or exceeds the long-build threshold.

Setup order:

1. Create or open a Resend account.
2. Add the sending domain or subdomain.
3. Add the DNS records Resend provides.
4. Wait for domain verification.
5. Create an API key with sending access scoped to the verified domain when possible.
6. Set:

```bash
RESEND_API_KEY=<resend key>
RESEND_FROM_EMAIL="OZMO Digital <hello@verified-domain.example>"
RESEND_REPLY_TO_EMAIL=hello@ozmodigital.com
INTERNAL_ALERT_EMAILS=owner@ozmodigital.com,dev@example.com
```

If `INTERNAL_ALERT_EMAILS` is empty and the app needs to use a WordPress snapshot, Phase 2 intentionally fails instead of silently serving stale content.

## 12. Set Up Vercel

Setup order:

1. Create or open the Vercel project connected to `https://github.com/baze42/ozmo-redesign.git`.
2. Confirm the production branch is `main`.
3. Add environment variables from this document in Project Settings -> Environment Variables.
4. Create a Deploy Hook:
   - Open the Vercel project.
   - Go to Settings -> Git -> Deploy Hooks.
   - Create a hook for branch `main`.
   - Copy the generated URL to `VERCEL_DEPLOY_HOOK_URL`.
5. Create a Vercel API token:
   - Open Vercel account/team settings.
   - Create a token with access to this project/team.
   - Store it as `VERCEL_API_TOKEN`.
6. Find the Vercel project/team IDs:
   - Project ID is usually visible in project settings or local `.vercel/project.json` after `vercel link`.
   - Team/org ID is required for team projects; local `.vercel/project.json` may expose it as `orgId` after linking.
   - Set `VERCEL_PROJECT_ID` and, if needed, `VERCEL_TEAM_ID`.
7. Set:

```bash
VERCEL_DEPLOY_TARGET=production
VERCEL_DEPLOY_BRANCH=main
CRON_SECRET=<random secret>
```

Phase 2 has the cron processor route at:

```text
/api/cron/process-rebuilds
```

Vercel Cron invokes cron paths with HTTP `GET`. The route also accepts `POST` for manual testing. This repo does not yet include a tracked `vercel.json` cron schedule. For Phase 2 testing, call the route manually or add a temporary Vercel Cron configuration in the dashboard if needed.

## 13. Optional Plausible Setup

Plausible does not require a secret for Phase 2 public page testing.

1. Add the site in Plausible.
2. Set `PUBLIC_PLAUSIBLE_DOMAIN` to the domain Plausible expects.
3. Keep `PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js` unless using a proxy/first-party script.

Plausible may not record localhost traffic. This does not block Phase 2 tests.

## 14. Reserved Auth And Calendar Setup

These steps are not required to pass Phase 2, but the variables are already reserved.

### Auth.js Admin OAuth

1. Generate `AUTH_SECRET`:

```bash
npx auth secret
```

or:

```bash
openssl rand -base64 32
```

2. In Google Cloud Console, configure OAuth consent/branding.
3. Create an OAuth 2.0 Web Application client.
4. Add the future redirect URI:

```text
https://<site-domain>/api/auth/callback/google
```

5. Set:

```bash
AUTH_GOOGLE_ID=<client id>
AUTH_GOOGLE_SECRET=<client secret>
ADMIN_EMAIL_ALLOWLIST=owner@ozmodigital.com
```

### Google Calendar Scheduling OAuth

1. In Google Cloud Console, enable the Google Calendar API.
2. Create or reuse an OAuth 2.0 Web Application client.
3. Add the future redirect URI:

```text
https://<site-domain>/api/admin/calendar/callback
```

4. Set:

```bash
GOOGLE_CALENDAR_CLIENT_ID=<client id>
GOOGLE_CALENDAR_CLIENT_SECRET=<client secret>
GOOGLE_CALENDAR_REDIRECT_URI=https://<site-domain>/api/admin/calendar/callback
GOOGLE_PRIMARY_BOOKING_CALENDAR_ID=<calendar id>
GOOGLE_BUSY_CALENDAR_IDS=<comma-separated calendar ids>
OZMO_BUSINESS_TIMEZONE=America/Chicago
OZMO_REVIEW_WEEKLY_CAPACITY=5
```

Calendar integration is Phase 5 work. Do not expect Phase 2 tests to use these variables.

## 15. Local Verification Commands

Run these after dependency install.

```bash
npm run check
npm run test
npm run wp:validate
npm run build:local
npm run test:e2e -- tests/e2e/public-pages.spec.ts
npm run test:lighthouse
npm run verify
```

Expected at end of Phase 2:

- `npm run check`: 0 errors, 0 warnings.
- `npm run test`: all Vitest files pass.
- `npm run wp:validate`: all WordPress contract tests pass.
- `npm run build:local`: Astro builds using explicit local WordPress fixtures.
- `npm run test:e2e -- tests/e2e/public-pages.spec.ts`: public pages pass in Chromium, Firefox, and WebKit.
- `npm run test:lighthouse`: assertions pass for configured public routes.
- `npm run verify`: check, unit tests, full e2e, and Lighthouse pass.

## 16. Production-Like Build Test

Use this only after WordPress, Neon, and required alert env are configured.

```bash
set -a
source .env.local
set +a
npm run build
```

Expected:

- With valid `WORDPRESS_API_BASE_URL` and required content, the build passes.
- With no `WORDPRESS_API_BASE_URL`, the build fails. This is intentional because public content must be WordPress-owned.
- With `PRODUCTION_LAUNCH_APPROVED=true` and fewer than 3 posts, the build fails.
- With WordPress unreachable and a valid snapshot in Postgres, the build may use the snapshot only if `INTERNAL_ALERT_EMAILS` and Resend sending are configured.
- With WordPress unreachable and no snapshot, the build fails.

## 17. Manual Webhook Test

Use this after deploying to Vercel with real env, running migrations, and setting the WordPress runtime variables.

Create a signed payload:

```bash
export WORDPRESS_WEBHOOK_SECRET="<same secret used by Vercel and WordPress>"
body='{"content_type":"post","content_id":42,"slug":"phase-2-test","status":"publish","transition":"draft->publish","timestamp":"2026-08-09T12:00:00.000Z"}'
sig=$(node -e "const crypto=require('node:crypto'); const [body, secret]=process.argv.slice(1); console.log(crypto.createHmac('sha256', secret).update(body).digest('hex'))" "$body" "$WORDPRESS_WEBHOOK_SECRET")
```

Send it:

```bash
curl -i \
  -X POST "https://<site-domain>/api/webhooks/wordpress" \
  -H "content-type: application/json" \
  -H "x-ozmo-signature: $sig" \
  --data "$body"
```

Expected:

- Valid signature returns `202` with `{"queued":true}`.
- Invalid signature returns `401`.
- Repeated/rapid published events debounce to one deploy trigger.

## 18. Manual Cron Processor Test

Wait at least 120 seconds after queuing a valid webhook event, then call:

```bash
curl -i \
  "https://<site-domain>/api/cron/process-rebuilds" \
  -H "Authorization: Bearer <CRON_SECRET>"
```

or:

```bash
curl -i \
  "https://<site-domain>/api/cron/process-rebuilds" \
  -H "x-cron-secret: <CRON_SECRET>"
```

Expected:

- Invalid/missing secret returns `401`.
- If events are due, the route calls `VERCEL_DEPLOY_HOOK_URL`.
- The deploy hook response job ID and hook ID are stored on `rebuild_events`.
- Follow-up cron calls poll Vercel deployments using `VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, optional `VERCEL_TEAM_ID`, target, branch, deploy hook ID, and job metadata.
- Failed or long builds send Resend alerts to `INTERNAL_ALERT_EMAILS`.
- Triggered and processing states time out instead of blocking forever.

## 19. Database Inspection Queries

After webhook/cron tests, inspect records:

```sql
select status, content_type, slug, scheduled_at, deploy_triggered_at, deploy_hook_id,
       deploy_job_id, deployment_id, deployment_state, error, long_build_review_required
from rebuild_events
order by received_at desc
limit 20;
```

Snapshot inspection:

```sql
select content_type, snapshot_key, captured_at, used_at
from content_snapshots
order by captured_at desc;
```

Expected:

- `pending` before debounce window expires.
- `triggered` after deploy hook succeeds.
- `completed` after Vercel reports `READY`.
- `failed` after deploy hook failure, terminal Vercel failure, or stale timeout.
- `content_snapshots.used_at` updates when a valid snapshot fallback is used.

## 20. Troubleshooting

### `npm run build` fails locally with WordPress URL errors

Expected when no real WordPress API URL is configured. Use:

```bash
npm run build:local
```

for fixture-backed local verification, or configure `WORDPRESS_API_BASE_URL` and real WordPress content before using `npm run build`.

### Vercel production webhook route throws Upstash errors

Set both:

```bash
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Production does not use the in-memory fallback.

### Snapshot fallback fails even though snapshots exist

Set:

```bash
INTERNAL_ALERT_EMAILS
RESEND_API_KEY
RESEND_FROM_EMAIL
```

Snapshot fallback must alert. If it cannot alert, it fails deliberately.

### Cron route returns `401`

Pass the configured `CRON_SECRET` as either:

```text
Authorization: Bearer <CRON_SECRET>
```

or:

```text
x-cron-secret: <CRON_SECRET>
```

### Vercel deployment never completes in `rebuild_events`

Check:

- `VERCEL_API_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_TEAM_ID` for team projects
- `VERCEL_DEPLOY_TARGET`
- `VERCEL_DEPLOY_BRANCH`
- Whether the Vercel Deploy Hook was created for branch `main`
- Whether the deployment metadata includes the expected deploy hook ID

## 21. Reference Docs

- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel deploy hooks: https://vercel.com/docs/deploy-hooks
- Vercel cron jobs: https://vercel.com/docs/cron-jobs
- Vercel deployments API: https://vercel.com/docs/rest-api/deployments/list-deployments
- Neon connection strings: https://neon.com/docs/connect/connect-from-any-app
- Upstash Redis REST API: https://upstash.com/docs/redis/features/restapi
- Resend domains: https://resend.com/docs/dashboard/domains/introduction
- Resend API keys: https://resend.com/docs/dashboard/api-keys/introduction
- Auth.js environment variables: https://authjs.dev/guides/environment-variables
- Google OAuth web server flow: https://developers.google.com/identity/protocols/oauth2/web-server
- Google Workspace credentials: https://developers.google.com/workspace/guides/create-credentials
- Plausible script setup: https://plausible.io/docs/plausible-script
- ACF Local JSON: https://www.advancedcustomfields.com/resources/local-json/
