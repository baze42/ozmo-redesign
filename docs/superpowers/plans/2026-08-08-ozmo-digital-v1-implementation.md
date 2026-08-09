# OZMO Digital V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V1 OZMO Digital website from the fresh-start design spec as a fast, honest, lead-generation-focused Astro site with WordPress-managed public content, Postgres-managed operational data, protected admin workflows, and Calendar-backed scheduling.

**Architecture:** Public marketing pages are Astro-rendered HTML and prerendered by default. Form actions, admin routes, scheduling routes, private token routes, webhooks, and cron processors use on-demand server rendering on Vercel. WordPress owns public content, while Neon Postgres owns leads, audits, bookings, admin notes, tokens, audit logs, Auth.js sessions, and last-known-good WordPress snapshots.

**Tech Stack:** Astro, TypeScript, Vercel adapter, Neon Postgres, Drizzle ORM, WordPress REST API, ACF, Resend, Plausible Analytics, Auth.js Google OAuth, Google Calendar API, Upstash Redis rate limiting, Vitest, Playwright, axe, Lighthouse CI.

## Global Constraints

- Source of truth is `docs/superpowers/specs/2026-08-08-ozmo-digital-fresh-start-design.md`; prior design or implementation history must not drive V1 decisions.
- Spec `MUST`, `MUST NOT`, `SHOULD`, and `MAY` language is binding at the levels defined in the spec.
- V1 launch audience is broad SMBs and must not target a single vertical industry at launch.
- Core positioning: "OZMO Digital turns slow, outdated, unclear, or missing websites into fast, polished lead-generation sites."
- Primary CTA is `Get a Free Site Review`; secondary CTA is `Schedule a Discovery Call`; tertiary CTA is `Contact OZMO`.
- Public content must be owned by WordPress from V1 launch.
- Private leads, audit requests, booking records, admin notes, scheduling tokens, Auth.js sessions, and audit trails must live in Postgres.
- Public pages are static-first Astro pages; forms, scheduling endpoints, admin routes, and token routes use on-demand server rendering.
- The site must not use fake testimonials, fake metrics, fake case studies, fake client names, false local-business schema, fake addresses, implied service areas, stock handshake imagery, decorative orbs, gradient blobs, or fake 3D dashboards.
- Testimonials and a testimonial WordPress content type are out of scope for V1.
- Placeholder transformation examples must live in WordPress and use honest qualitative language only.
- Accessibility, performance, legal, privacy, security, and SEO requirements are first-phase constraints, not launch polish.
- Google Calendar is authoritative for actual event time and availability; Postgres is authoritative for lead metadata, admin status, tokens, notes, and audit trail.
- Calendar availability must fail closed and must not show unverified available slots.
- No separate `.ics` file is sent by Resend for V1 bookings.
- Default and page-specific 1200 x 630 image assets must support Open Graph and Twitter/X summary-large metadata.

---

## Starting State

- Repository remote: `https://github.com/baze42/ozmo-redesign.git`
- Verified main commit before writing this plan: `958ed7a docs: resolve spec integrity review`
- Existing tracked files:
  - `.gitignore`
  - `docs/ref/uploads/ozmo-logo-bo.png`
  - `docs/superpowers/specs/2026-08-08-ozmo-digital-fresh-start-design.md`
- Existing brand asset:
  - `docs/ref/uploads/ozmo-logo-bo.png`, 392 x 157 PNG, RGBA
- This plan intentionally assumes no implemented Astro app exists yet.

## Major Architectural Decisions

1. Use Astro with the Vercel adapter and route-level rendering control. Public marketing pages stay prerendered; routes that require request-time data export `prerender = false`.
2. Use WordPress REST API and ACF for public content. Do not introduce GraphQL unless a later spec requires it.
3. Keep source-controlled WordPress configuration in `wordpress/` so CPTs, REST exposure, and ACF field definitions are reviewable with the Astro code.
4. Use Drizzle ORM over Neon Postgres for typed schema, migrations, and explicit SQL control. This keeps Auth.js tables, lead tables, booking tables, and audit logs in one migration system.
5. Use `@auth/core` with Google provider and a Drizzle adapter. Add an OZMO-specific admin guard for email allowlist, hidden unauthorized 404 responses, 8-hour idle checks, 7-day absolute checks, and CSRF validation on mutating admin actions.
6. Use direct Google Calendar REST calls with OAuth refresh-token management rather than a large client bundle. Calendar code is server-only.
7. Use Luxon for timezone-aware slot generation, DST handling, and IANA timezone validation. Do not use manual offset math.
8. Use Upstash Redis for rate limits and rebuild debounce locks. Do not use in-memory rate limiting in production.
9. Store last-known-good WordPress snapshots in Postgres. A build may read snapshots when WordPress is unavailable; the snapshot is a cache, not the source of truth.
10. Implement analytics as a thin Plausible event wrapper so public pages can track required conversion events without loading admin or scheduler code on marketing routes.

## Dependency Plan

Create `package.json` with these runtime dependencies:

- `astro`
- `@astrojs/vercel`
- `@astrojs/sitemap`
- `@auth/core`
- `@auth/drizzle-adapter`
- `@neondatabase/serverless`
- `drizzle-orm`
- `zod`
- `resend`
- `luxon`
- `@upstash/redis`
- `@upstash/ratelimit`

Create `package.json` with these dev dependencies:

- `typescript`
- `drizzle-kit`
- `vitest`
- `@vitest/coverage-v8`
- `playwright`
- `@playwright/test`
- `@axe-core/playwright`
- `@lhci/cli`
- `sharp`
- `eslint`
- `prettier`

Use local scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test tests/e2e/a11y.spec.ts",
    "test:lighthouse": "lhci autorun",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "wp:validate": "vitest run tests/unit/wordpress",
    "verify": "npm run check && npm run test && npm run test:e2e && npm run test:lighthouse"
  }
}
```

## Environment Variables

Create `.env.example` with every variable below and no secret values.

| Variable | Scope | Required by | Purpose |
| --- | --- | --- | --- |
| `PUBLIC_SITE_URL` | build/runtime | Phase 1 | Canonical base URL and metadata generation |
| `PUBLIC_PLAUSIBLE_DOMAIN` | runtime public | Phase 1 | Plausible domain |
| `PUBLIC_PLAUSIBLE_SRC` | runtime public | Phase 1 | Plausible script URL, default `https://plausible.io/js/script.js` |
| `WORDPRESS_API_BASE_URL` | build/runtime | Phase 2 | WordPress REST base URL |
| `WORDPRESS_WEBHOOK_SECRET` | runtime secret | Phase 2 | HMAC secret for WordPress rebuild webhooks |
| `VERCEL_DEPLOY_HOOK_URL` | runtime secret | Phase 2 | Deploy hook called by rebuild processor |
| `CRON_SECRET` | runtime secret | Phase 2 | Authorization for Vercel Cron processors |
| `DATABASE_URL` | build/runtime secret | Phase 3 | Neon Postgres TLS connection |
| `DATABASE_DIRECT_URL` | local/CI secret | Phase 3 | Direct migration connection if Neon pooling requires it |
| `UPSTASH_REDIS_REST_URL` | runtime secret | Phase 2 | Redis rate-limit and debounce storage |
| `UPSTASH_REDIS_REST_TOKEN` | runtime secret | Phase 2 | Redis rate-limit and debounce token |
| `RESEND_API_KEY` | runtime secret | Phase 3 | Transactional email sending |
| `RESEND_FROM_EMAIL` | runtime secret | Phase 3 | Default sender, e.g. `OZMO Digital <hello@mail.ozmodigital.com>` |
| `RESEND_REPLY_TO_EMAIL` | runtime secret | Phase 3 | Default `hello@ozmodigital.com` |
| `RESEND_WEBHOOK_SECRET` | runtime secret | Phase 3 | Bounce/complaint webhook verification |
| `AUTH_SECRET` | runtime secret | Phase 4 | Auth.js secret |
| `AUTH_GOOGLE_ID` | runtime secret | Phase 4 | Google OAuth client ID for admin auth |
| `AUTH_GOOGLE_SECRET` | runtime secret | Phase 4 | Google OAuth client secret for admin auth |
| `ADMIN_EMAIL_ALLOWLIST` | runtime secret | Phase 4 | Comma-separated allowed admin Google accounts |
| `ENCRYPTION_KEY` | runtime secret | Phase 4 | Base64 32-byte key for AES-256-GCM application encryption |
| `GOOGLE_CALENDAR_CLIENT_ID` | runtime secret | Phase 5 | Google OAuth client ID for scheduling owner consent |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | runtime secret | Phase 5 | Google OAuth client secret for scheduling owner consent |
| `GOOGLE_CALENDAR_REDIRECT_URI` | runtime secret | Phase 5 | Admin calendar connection callback URL |
| `GOOGLE_PRIMARY_BOOKING_CALENDAR_ID` | runtime secret | Phase 5 | Calendar that receives booking events |
| `GOOGLE_BUSY_CALENDAR_IDS` | runtime secret | Phase 5 | Comma-separated calendars checked for busy time |
| `OZMO_BUSINESS_TIMEZONE` | runtime | Phase 5 | Default `America/Chicago` |
| `OZMO_REVIEW_WEEKLY_CAPACITY` | runtime | Phase 5 | Default `5` |
| `INTERNAL_ALERT_EMAILS` | runtime secret | Phase 6 | OZMO and implementation-owner alert recipients |
| `PRODUCTION_LAUNCH_APPROVED` | build secret | Phase 6 | `true` only after launch content/legal approval |

## Route Inventory And Rendering Mode

| Route | File | Mode | Indexing | Data source |
| --- | --- | --- | --- | --- |
| `/` | `src/pages/index.astro` | prerender | index | WordPress services/posts/transformations plus local layout |
| `/services` | `src/pages/services.astro` | prerender | index | WordPress `service` CPT |
| `/portfolio` | `src/pages/portfolio.astro` | prerender | index | WordPress `transformation` CPT |
| `/blog` | `src/pages/blog/index.astro` | prerender | index when at least 3 posts; noindex before then | WordPress `post` |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | prerender | index for published posts | WordPress `post` |
| `/contact` | `src/pages/contact.astro` | on-demand | index | Astro form action and Postgres |
| `/free-site-audit` | `src/pages/free-site-audit.astro` | on-demand | index | Astro form action and Postgres |
| `/schedule` | `src/pages/schedule/index.astro` | on-demand | index | Calendar availability, Postgres holds |
| `/schedule/review/[token]` | `src/pages/schedule/review/[token].astro` | on-demand | noindex | Postgres scheduling token, Calendar availability |
| `/schedule/manage/[token]` | `src/pages/schedule/manage/[token].astro` | on-demand | noindex | Postgres booking token, Calendar API |
| `/thank-you/contact` | `src/pages/thank-you/contact.astro` | prerender | noindex | Static confirmation copy |
| `/thank-you/site-review` | `src/pages/thank-you/site-review.astro` | prerender | noindex | Static confirmation copy |
| `/thank-you/booking` | `src/pages/thank-you/booking.astro` | prerender | noindex | Static confirmation copy |
| `/privacy` | `src/pages/privacy.astro` | prerender | index | Owner-approved legal copy |
| `/terms` | `src/pages/terms.astro` | prerender | index | Owner-approved legal copy |
| `/cookie-notice` | `src/pages/cookie-notice.astro` | prerender | index | Owner-approved legal copy |
| `/admin` | `src/pages/admin/index.astro` | on-demand | noindex, sitemap-excluded | Postgres |
| `/admin/leads` | `src/pages/admin/leads/index.astro` | on-demand | noindex, sitemap-excluded | Postgres |
| `/admin/leads/[id]` | `src/pages/admin/leads/[id].astro` | on-demand | noindex, sitemap-excluded | Postgres |
| `/admin/audits` | `src/pages/admin/audits/index.astro` | on-demand | noindex, sitemap-excluded | Postgres |
| `/admin/bookings` | `src/pages/admin/bookings/index.astro` | on-demand | noindex, sitemap-excluded | Postgres and Calendar refresh action |
| `/404` | `src/pages/404.astro` | prerender | noindex | Static |
| `/500` | `src/pages/500.astro` | prerender | noindex | Static |
| `/rss.xml` | `src/pages/rss.xml.ts` | prerender | feed | WordPress `post`, only active once 3 posts are published |

## File Structure To Create

### Project Foundation

- `package.json` - scripts, package manager constraints, dependencies
- `package-lock.json` or `pnpm-lock.yaml` - lockfile chosen during scaffold
- `astro.config.mjs` - Vercel adapter, sitemap integration, site URL
- `tsconfig.json` - strict TypeScript configuration
- `.env.example` - complete environment variable inventory
- `.npmrc` - package manager behavior
- `.prettierrc` - formatting rules
- `eslint.config.js` - linting rules
- `drizzle.config.ts` - Drizzle migration config
- `playwright.config.ts` - browser matrix and web server config
- `lighthouserc.cjs` - Lighthouse CI routes and budgets
- `tests/setup/vitest.ts` - test setup
- `tests/setup/env.ts` - safe test environment defaults

### Astro Source

- `src/assets/brand/` - generated brand SVG, PNG fallback, favicon, app icons, OG images
- `src/assets/fonts/` - self-hosted WOFF2 files for Sora and Source Sans 3
- `src/styles/tokens.css` - color, typography, spacing, motion, focus tokens
- `src/styles/global.css` - global reset and base element rules
- `src/layouts/BaseLayout.astro` - metadata, fonts, Plausible, skip link, base shell
- `src/layouts/AdminLayout.astro` - admin shell and noindex headers
- `src/components/nav/Header.astro` - desktop and mobile navigation CTA hierarchy
- `src/components/nav/Footer.astro` - contact, legal, and CTA links
- `src/components/hero/TransformationHero.astro` - H1 and split-screen before/after mockups
- `src/components/hero/TransformationMockup.astro` - abstract before/after visual states
- `src/components/content/ServiceCard.astro` - service preview
- `src/components/content/TransformationCard.astro` - transformation entry preview
- `src/components/content/BlogCard.astro` - blog preview
- `src/components/forms/ContactForm.astro` - progressive form markup
- `src/components/forms/SiteReviewWizard.astro` - two-step branch wizard
- `src/components/forms/FormErrorSummary.astro` - focusable error summary
- `src/components/scheduling/Scheduler.astro` - scheduler shell
- `src/components/scheduling/TimezoneSelect.astro` - timezone override
- `src/components/scheduling/SlotPicker.astro` - accessible slot picker
- `src/components/admin/AdminTable.astro` - admin table shell
- `src/components/admin/StatusBadge.astro` - canonical status display
- `src/components/admin/StatusTransitionForm.astro` - CSRF-protected status form
- `src/components/admin/InternalNotes.astro` - admin notes list and form
- `src/components/admin/CalendarConnectionPanel.astro` - Google Calendar connection state

### TypeScript Libraries

- `src/lib/config/env.ts` - typed environment validation
- `src/lib/seo/metadata.ts` - title, description, canonical, robots, OG helpers
- `src/lib/seo/schema.ts` - Organization, Service, BlogPosting, BreadcrumbList JSON-LD
- `src/lib/seo/routes.ts` - route inventory and indexing rules
- `src/lib/analytics/plausible.ts` - event names and client-safe dispatch helper
- `src/lib/security/crypto.ts` - token generation, SHA-256 hashing, AES-256-GCM encryption
- `src/lib/security/csrf.ts` - CSRF issue/verify helpers for mutating actions
- `src/lib/security/rate-limit.ts` - Upstash rate limit definitions
- `src/lib/db/client.ts` - Neon client and Drizzle instance
- `src/lib/db/schema.ts` - Drizzle table definitions
- `src/lib/db/enums.ts` - record, lead status, booking status, token status enums
- `src/lib/db/migrations/` - generated migration SQL
- `src/lib/leads/types.ts` - normalized lead interfaces
- `src/lib/leads/validation.ts` - Zod schemas for contact and site review branches
- `src/lib/leads/repository.ts` - lead insert, read, status, notes, export queries
- `src/lib/leads/status.ts` - allowed status transitions
- `src/lib/wordpress/client.ts` - REST client with timeout and schema validation
- `src/lib/wordpress/mappers.ts` - WordPress to Astro view-model mapping
- `src/lib/wordpress/snapshots.ts` - last-known-good read/write behavior
- `src/lib/wordpress/webhook.ts` - HMAC verification and publish-event filtering
- `src/lib/email/resend.ts` - Resend send wrapper and suppression checks
- `src/lib/email/templates.ts` - template registry
- `src/lib/scheduling/timezones.ts` - IANA validation and timezone conversion
- `src/lib/scheduling/availability.ts` - availability rules, buffers, daily caps, date windows
- `src/lib/scheduling/calendar.ts` - Google Calendar free/busy, event create/cancel/read
- `src/lib/scheduling/holds.ts` - booking hold create/validate/convert
- `src/lib/scheduling/tokens.ts` - private review and management token lifecycle
- `src/lib/scheduling/bookings.ts` - booking creation, cancellation, rescheduling, refresh
- `src/lib/auth/auth.ts` - Auth.js configuration
- `src/lib/auth/admin.ts` - require-admin guard, allowlist check, 404 hiding behavior
- `src/lib/auth/session-activity.ts` - 8-hour idle and 7-day absolute session checks

### Server Actions And API Routes

- `src/actions/contact.ts` - contact submit action
- `src/actions/site-review.ts` - existing-site and no-website review submit actions
- `src/actions/scheduling.ts` - availability lookup, hold, confirm, request-time actions
- `src/actions/admin.ts` - status updates, notes, CSV export, token revoke, no-show
- `src/pages/api/auth/[...auth].ts` - Auth.js endpoint
- `src/pages/api/webhooks/wordpress.ts` - HMAC WordPress rebuild webhook
- `src/pages/api/webhooks/resend.ts` - bounce and complaint webhook
- `src/pages/api/cron/process-rebuilds.ts` - debounced deploy-hook processor
- `src/pages/api/admin/calendar/connect.ts` - start Calendar owner OAuth flow
- `src/pages/api/admin/calendar/callback.ts` - store encrypted Calendar refresh token

### WordPress Configuration

- `wordpress/mu-plugins/ozmo-content-types.php` - CPT registration for `service`, `transformation`, and `landing_page`
- `wordpress/mu-plugins/ozmo-rebuild-webhook.php` - signed publish-only webhook dispatch
- `wordpress/acf-json/group_ozmo_service.json` - service fields
- `wordpress/acf-json/group_ozmo_transformation.json` - transformation fields
- `wordpress/acf-json/group_ozmo_landing_page.json` - future landing page fields
- `wordpress/README.md` - deployment steps for WordPress plugin and ACF JSON

### Tests

- `tests/unit/seo/metadata.test.ts`
- `tests/unit/seo/schema.test.ts`
- `tests/unit/seo/routes.test.ts`
- `tests/unit/design/color-contrast.test.ts`
- `tests/unit/design/font-budget.test.ts`
- `tests/unit/wordpress/client.test.ts`
- `tests/unit/wordpress/mappers.test.ts`
- `tests/unit/wordpress/snapshots.test.ts`
- `tests/unit/leads/validation.test.ts`
- `tests/unit/leads/status.test.ts`
- `tests/unit/security/crypto.test.ts`
- `tests/unit/security/rate-limit.test.ts`
- `tests/unit/auth/admin.test.ts`
- `tests/unit/email/templates.test.ts`
- `tests/unit/scheduling/timezones.test.ts`
- `tests/unit/scheduling/availability.test.ts`
- `tests/unit/scheduling/holds.test.ts`
- `tests/unit/scheduling/tokens.test.ts`
- `tests/unit/scheduling/calendar-fail-closed.test.ts`
- `tests/e2e/public-pages.spec.ts`
- `tests/e2e/site-review.spec.ts`
- `tests/e2e/contact.spec.ts`
- `tests/e2e/scheduling.spec.ts`
- `tests/e2e/admin-auth.spec.ts`
- `tests/e2e/admin-workflows.spec.ts`
- `tests/e2e/a11y.spec.ts`
- `tests/e2e/visual-viewports.spec.ts`

## Data Model

Use Postgres enums:

- `record_type`: `contact_inquiry`, `existing_site_audit`, `new_site_readiness_review`, `discovery_call`, `site_review_walkthrough`, `scheduling_request`
- `lead_status`: `new`, `needs_review`, `reviewed`, `ready_to_schedule`, `scheduled`, `contacted`, `qualified`, `won`, `closed_lost`, `spam_rejected`
- `booking_status`: `held`, `booked`, `cancelled`, `rescheduled`, `completed`, `no_show`, `calendar_missing`
- `token_status`: `active`, `used`, `expired`, `revoked`
- `calendar_connection_status`: `connected`, `calendar_connection_required`, `revoked`, `error`
- `email_suppression_reason`: `hard_bounce`, `complaint`, `manual`, `deletion_request`

Create these tables in `src/lib/db/schema.ts` and generated migrations:

| Table | Key columns | Purpose |
| --- | --- | --- |
| `users` | Auth.js adapter columns | Admin Google OAuth users |
| `accounts` | Auth.js adapter columns plus encrypted tokens when needed | OAuth provider accounts |
| `sessions` | Auth.js adapter columns | Database-backed sessions |
| `verification_tokens` | Auth.js adapter columns | Auth.js verification support |
| `admin_session_activity` | `session_token_hash`, `user_id`, `created_at`, `last_seen_at`, `absolute_expires_at`, `revoked_at` | Enforce 8-hour idle and 7-day absolute sessions |
| `leads` | `id`, `record_type`, `source_route`, `source_cta`, `contact_name`, `contact_email`, `business_name`, `status`, `created_at`, `updated_at` | Shared admin model for all lead paths |
| `lead_details` | `lead_id`, `message`, `interest`, `website_url`, `help_areas`, `challenge`, `preferred_next_step`, `business_type`, `primary_offer`, `target_customer`, `current_online_presence`, `website_goal`, `metadata` | Branch-specific lead fields |
| `site_review_summaries` | `lead_id`, `findings`, `recommendation`, `prepared_by_user_id`, `prepared_at`, `sent_at` | Manual Site Review Summary record |
| `lead_notes` | `lead_id`, `author_user_id`, `note`, `created_at` | Internal admin notes |
| `lead_status_events` | `lead_id`, `actor_user_id`, `previous_status`, `new_status`, `note`, `created_at` | Required audit log for status changes |
| `admin_audit_events` | `actor_user_id`, `event_type`, `entity_type`, `entity_id`, `metadata`, `created_at` | CSV export, token revoke, no-show, deletion, calendar refresh events |
| `booking_holds` | `id`, `hold_token_hash`, `call_type`, `email_hash`, `start_at_utc`, `end_at_utc`, `visitor_timezone`, `expires_at`, `converted_booking_id` | 10-minute holds |
| `bookings` | `id`, `lead_id`, `call_type`, `status`, `start_at_utc`, `end_at_utc`, `ozmo_timezone`, `visitor_timezone`, `google_calendar_id`, `google_event_id`, `attendee_email`, `rescheduled_from_booking_id`, `created_at`, `updated_at` | Booked calls and lifecycle |
| `scheduling_tokens` | `token_hash`, `token_type`, `lead_id`, `booking_id`, `recipient_email_hash`, `status`, `expires_at`, `used_at`, `revoked_at`, `created_at` | Private review and booking management tokens |
| `scheduling_requests` | `lead_id`, `call_type`, `contact_name`, `contact_email`, `business_name`, `visitor_timezone`, `message`, `status`, `created_at` | Request-a-time fallback records |
| `calendar_connections` | `provider`, `google_account_email`, `primary_calendar_id`, `busy_calendar_ids`, `encrypted_refresh_token`, `access_token_expires_at`, `status`, `connected_by_user_id`, `updated_at` | Scheduling owner Calendar OAuth state |
| `email_suppressions` | `email_hash`, `reason`, `source`, `created_at` | Hard bounce, complaint, deletion suppression |
| `content_snapshots` | `content_type`, `snapshot_key`, `payload`, `payload_hash`, `captured_at`, `used_at` | Last-known-good WordPress public content snapshots |
| `rebuild_events` | `id`, `source`, `content_type`, `content_id`, `event_hash`, `scheduled_at`, `processed_at`, `status`, `error` | Debounced WordPress deploy-hook queue |
| `privacy_requests` | `email_hash`, `request_type`, `status`, `verified_at`, `completed_at`, `created_at` | Deletion and privacy request tracking |

Data rules:

- Store raw private scheduling tokens only in generated URLs and email bodies. Store only SHA-256 hashes in Postgres.
- Generate private scheduling and booking management tokens with at least 128 bits of cryptographic randomness.
- Encrypt OAuth refresh tokens and sensitive external API tokens before storage with AES-256-GCM using `ENCRYPTION_KEY`.
- Hash normalized emails for rate limits, token recipient ties, suppression matching, and privacy deletion matching.
- Every status transition runs through `src/lib/leads/status.ts` and writes `lead_status_events`.
- CSV export writes `admin_audit_events` with actor, timestamp, record count, and export type.

## Phase 1: Foundation, Design System, And Compliance

### Task 1.1: Astro, TypeScript, Vercel, And Test Scaffold

**Files:**

- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.env.example`
- Create: `playwright.config.ts`
- Create: `lighthouserc.cjs`
- Create: `tests/setup/vitest.ts`
- Create: `src/lib/config/env.ts`

**Interfaces:**

- Produces `getEnv(): AppEnv` from `src/lib/config/env.ts`.
- Produces Vercel adapter setup for on-demand routes.
- Produces test scripts used by every later phase.

**Steps:**

- [ ] Scaffold Astro with TypeScript strict mode and the Vercel adapter.
- [ ] Add the dependency set listed in "Dependency Plan".
- [ ] Create `.env.example` with the full environment table and comments for default values.
- [ ] Configure `astro.config.mjs` with `site: process.env.PUBLIC_SITE_URL`, `@astrojs/vercel`, and `@astrojs/sitemap`.
- [ ] Configure Vitest, Playwright, and Lighthouse CI scripts.
- [ ] Run `npm run check`; expected result is Astro/TypeScript check success.
- [ ] Run `npm run test`; expected result is an empty or scaffold test suite success.
- [ ] Commit with `chore: scaffold astro foundation`.

**Exit criteria:**

- `npm run build` completes on the empty scaffold.
- The app can serve at `astro dev`.
- Dynamic route support is available through Vercel adapter configuration.

### Task 1.2: Design Tokens, Fonts, Brand Assets, And Contrast Checks

**Files:**

- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/assets/fonts/`
- Create: `src/assets/brand/`
- Create: `scripts/build-brand-assets.ts`
- Create: `tests/unit/design/color-contrast.test.ts`
- Create: `tests/unit/design/font-budget.test.ts`
- Source reference: `docs/ref/uploads/ozmo-logo-bo.png`

**Interfaces:**

- Produces CSS custom properties for every spec color token.
- Produces self-hosted Sora and Source Sans 3 font-face rules.
- Produces launch-ready logo, favicon, app icon, and OG asset files.

**Steps:**

- [ ] Define all spec color tokens exactly: `#FAFAF7`, `#FFFFFF`, `#171923`, `#4B5563`, `#2B3F8F`, `#EEF2FF`, `#F45B00`, `#B23A00`, `#FFF1E8`, `#00A6A6`, `#006B6B`, `#E6F7F7`, `#D8DDE7`, `#B7C0D0`.
- [ ] Define body text rules that never use OZMO Orange or Signal Teal as normal-size text on Clean Surface.
- [ ] Self-host only Sora 700, Sora 600, Source Sans 3 400, and Source Sans 3 600 as WOFF2.
- [ ] Preload the above-the-fold Sora headline file and Source Sans 3 regular file in `BaseLayout.astro`.
- [ ] Add `font-display: swap` and CSS metric overrides after final WOFF2 files are selected.
- [ ] Generate SVG logo, PNG fallback, light logo, dark logo, horizontal lockup, compact lockup, favicons, app icons, maskable icon, default OG image, and per-page OG template assets.
- [ ] Generate page-specific 1200 x 630 assets for home, site review, services, portfolio, and blog metadata.
- [ ] Write color contrast tests for the approved pairings in the spec.
- [ ] Write font budget test that fails when compressed WOFF2 payload exceeds 110 KB.
- [ ] Run `npm run test -- tests/unit/design`; expected result is all design budget tests passing.
- [ ] Commit with `feat: add ozmo design tokens and brand assets`.

**Exit criteria:**

- Approved contrast pairings pass automated checks.
- Font payload is 110 KB compressed or less.
- All required brand asset formats exist.

### Task 1.3: Layout, Navigation, Footer, SEO Helpers, And Legal Shells

**Files:**

- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/nav/Header.astro`
- Create: `src/components/nav/Footer.astro`
- Create: `src/lib/seo/metadata.ts`
- Create: `src/lib/seo/schema.ts`
- Create: `src/lib/seo/routes.ts`
- Create: `src/pages/privacy.astro`
- Create: `src/pages/terms.astro`
- Create: `src/pages/cookie-notice.astro`
- Create: `src/pages/404.astro`
- Create: `src/pages/500.astro`
- Test: `tests/unit/seo/metadata.test.ts`
- Test: `tests/unit/seo/schema.test.ts`
- Test: `tests/unit/seo/routes.test.ts`

**Interfaces:**

- Produces `buildMetadata(input: MetadataInput): MetadataResult`.
- Produces `getRobotsForRoute(pathname: string): RobotsPolicy`.
- Produces `buildOrganizationSchema()`, `buildServiceSchema()`, `buildBlogPostingSchema()`, and `buildBreadcrumbSchema()`.

**Steps:**

- [ ] Build a base layout with skip link, semantic landmarks, metadata slots, canonical URL, OG metadata, Twitter/X summary-large metadata, Plausible script guard, and font preloads.
- [ ] Build desktop header with primary CTA as the most prominent action and secondary CTA as lower-emphasis link or button.
- [ ] Build mobile navigation with page links followed by `Get a Free Site Review` and `Schedule a Discovery Call`, in that order.
- [ ] Build footer with `Contact OZMO`, `/privacy`, `/terms`, `/cookie-notice`, and CTA links.
- [ ] Implement route inventory in `src/lib/seo/routes.ts` with index/noindex and sitemap inclusion decisions from the spec.
- [ ] Implement JSON-LD helpers for `Organization`, `Service`, `BlogPosting`, and `BreadcrumbList` only.
- [ ] Write tests proving `ProfessionalService` and `LocalBusiness` schemas are never emitted.
- [ ] Create legal page shells with clear "owner approval required before production launch" frontmatter metadata and no invented legal claims.
- [ ] Run `npm run test -- tests/unit/seo`; expected result is all SEO tests passing.
- [ ] Commit with `feat: add base layout seo and legal shells`.

**Exit criteria:**

- Route inventory test covers every required route.
- Admin and tokenized routes are noindex and sitemap-excluded.
- Footer links all legal pages.

### Task 1.4: Hero Split-Screen And Viewport Smoke Checks

**Files:**

- Create: `src/components/hero/TransformationHero.astro`
- Create: `src/components/hero/TransformationMockup.astro`
- Create: `src/pages/index.astro`
- Test: `tests/e2e/visual-viewports.spec.ts`
- Test: `tests/e2e/a11y.spec.ts`

**Interfaces:**

- Produces a homepage hero whose H1 remains the likely LCP target.
- Produces abstract before/after mockups with persistent `Before` and `After` labels.

**Steps:**

- [ ] Build original abstract website mockups, not real client screenshots.
- [ ] Show before state with cluttered hierarchy, weak CTA treatment, and disordered blocks.
- [ ] Show after state with clear headline, strong CTA, trust block, and form path.
- [ ] Use at least two non-color signals: persistent text labels and structural differences.
- [ ] Add passive CSS reveal for desktop only if it does not delay text rendering.
- [ ] Add reduced-motion CSS so the hero renders static with no wipe, transform animation, or delayed reveal.
- [ ] Stack After above Before below 400px width after the H1 and CTA group.
- [ ] Write Playwright viewport checks for 320px, 768px, 1024px, and 1440px with no horizontal overflow.
- [ ] Run `npm run test:e2e -- tests/e2e/visual-viewports.spec.ts`; expected result is all viewport checks passing.
- [ ] Commit with `feat: add transformation hero`.

**Exit criteria:**

- Hero is understandable without drag, hover, or pointer interaction.
- H1 is visible immediately and reveal does not block text rendering.
- No text or controls overlap at supported widths.

## Phase 2: WordPress Content Model And Public Content Pages

### Task 2.1: WordPress CPTs, ACF Fields, And Publish Webhook

**Files:**

- Create: `wordpress/mu-plugins/ozmo-content-types.php`
- Create: `wordpress/mu-plugins/ozmo-rebuild-webhook.php`
- Create: `wordpress/acf-json/group_ozmo_service.json`
- Create: `wordpress/acf-json/group_ozmo_transformation.json`
- Create: `wordpress/acf-json/group_ozmo_landing_page.json`
- Create: `wordpress/README.md`
- Test: `tests/unit/wordpress/cpt-contract.test.ts`

**Interfaces:**

- WordPress exposes `service`, `transformation`, and `landing_page` through REST.
- ACF fields needed by Astro are exposed in REST.
- Webhook payloads include content type, content ID, slug, status, transition, timestamp, and HMAC signature.

**Steps:**

- [ ] Register CPT `service` with REST enabled.
- [ ] Register CPT `transformation` with REST enabled.
- [ ] Register CPT `landing_page` with REST enabled for future landing pages.
- [ ] Do not register any testimonial CPT.
- [ ] Add service fields: `summary`, `business_outcomes`, `body_sections`, `cta_label`, `cta_url`, `sort_order`, `seo_title`, `seo_description`, `og_image`.
- [ ] Add transformation fields: `before_state`, `what_is_not_working`, `ozmo_improvement_path`, `expected_business_impact`, `cta_label`, `cta_url`, `sort_order`, `mockup_variant`, `seo_title`, `seo_description`, `og_image`.
- [ ] Add landing page fields sufficient for future launch without adding public routes in V1.
- [ ] Implement webhook filtering so only published changes for `post`, `page`, `service`, `transformation`, and `landing_page` dispatch.
- [ ] Exclude draft edits, autosaves, revisions, private updates, and trash transitions from webhook dispatch.
- [ ] Sign webhook requests with HMAC-SHA256 using `WORDPRESS_WEBHOOK_SECRET`.
- [ ] Commit with `feat: add wordpress content model`.

**Exit criteria:**

- WordPress public content model exists without testimonials.
- Published-content webhook rules match the spec.
- WordPress deployment steps are documented.

### Task 2.2: WordPress Client, Content Snapshots, And Failure Behavior

**Files:**

- Create: `src/lib/wordpress/client.ts`
- Create: `src/lib/wordpress/mappers.ts`
- Create: `src/lib/wordpress/snapshots.ts`
- Modify: `src/lib/db/schema.ts`
- Test: `tests/unit/wordpress/client.test.ts`
- Test: `tests/unit/wordpress/mappers.test.ts`
- Test: `tests/unit/wordpress/snapshots.test.ts`

**Interfaces:**

- Produces `getServices(): Promise<ServiceViewModel[]>`.
- Produces `getTransformations(): Promise<TransformationViewModel[]>`.
- Produces `getPublishedPosts(): Promise<PostViewModel[]>`.
- Produces `readSnapshot<T>(snapshotKey: string): Promise<T | null>`.
- Produces `writeSnapshot(snapshotKey: string, payload: unknown): Promise<void>`.

**Steps:**

- [ ] Implement REST fetch with timeout, schema validation, and clear error types.
- [ ] Map WordPress services to public view models with no private CMS fields leaking.
- [ ] Map WordPress transformations and reject entries with numeric metrics, dollar figures, invented rankings, invented speed scores, or invented lead counts in expected impact.
- [ ] Map WordPress posts to blog list/detail view models and RSS feed items.
- [ ] Store successful content payloads in `content_snapshots`.
- [ ] If WordPress is unreachable and a valid snapshot exists, use the snapshot and send an internal alert.
- [ ] If WordPress is unreachable and no snapshot exists for required launch content, fail the build.
- [ ] Fail build if `/services` content is empty.
- [ ] Fail build if `/portfolio` transformations are empty.
- [ ] Before production launch approval, render `/blog` empty/prelaunch with noindex when fewer than 3 posts exist.
- [ ] After `PRODUCTION_LAUNCH_APPROVED=true`, fail build when fewer than 3 published posts exist.
- [ ] Run `npm run wp:validate`; expected result is all WordPress contract tests passing.
- [ ] Commit with `feat: add wordpress adapter and snapshots`.

**Exit criteria:**

- WordPress failure behavior matches the spec.
- Build gating protects services, transformations, and launch blog minimums.
- Last-known-good snapshots are tested.

### Task 2.3: Public Pages, RSS, Sitemap, And Robots

**Files:**

- Create: `src/pages/services.astro`
- Create: `src/pages/portfolio.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/robots.txt.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/components/content/ServiceCard.astro`
- Modify: `src/components/content/TransformationCard.astro`
- Modify: `src/components/content/BlogCard.astro`
- Test: `tests/e2e/public-pages.spec.ts`
- Test: `tests/unit/seo/routes.test.ts`

**Interfaces:**

- Produces static public pages backed by WordPress content.
- Produces `/rss.xml` only once 3 published posts are available.

**Steps:**

- [ ] Build homepage sections in the spec order: header, hero, problem, guide, plan, services preview, transformations preview, site review CTA band, blog preview when at least 3 posts, footer.
- [ ] Build `/services` with all 6 required services and business outcome connections.
- [ ] Build `/portfolio` from WordPress transformation entries with honest qualitative impact language.
- [ ] Build `/blog` index with noindex prelaunch empty state and indexed state at 3 or more posts.
- [ ] Build `/blog/[slug]` with `BlogPosting` schema and natural site review CTA.
- [ ] Generate RSS feed at `/rss.xml` when 3 or more posts are published.
- [ ] Generate `robots.txt` that disallows `/admin/`, excludes tokenized routes, and allows public routes.
- [ ] Generate sitemap with only indexable public pages.
- [ ] Run `npm run test:e2e -- tests/e2e/public-pages.spec.ts`; expected result is all public route smoke tests passing.
- [ ] Commit with `feat: add wordpress public pages`.

**Exit criteria:**

- Public content comes from WordPress, not local hardcoded portfolio seed data.
- Blog behavior matches prelaunch and production launch rules.
- Sitemap and robots rules exclude admin and tokenized routes.

### Task 2.4: Astro WordPress Rebuild Webhook And Debounced Deploy Processor

**Files:**

- Create: `src/lib/wordpress/webhook.ts`
- Create: `src/lib/security/rate-limit.ts`
- Create: `src/lib/email/resend.ts`
- Create: `src/lib/email/templates.ts`
- Create: `src/emails/admin-alert-build-failure.ts`
- Create: `src/pages/api/webhooks/wordpress.ts`
- Create: `src/pages/api/cron/process-rebuilds.ts`
- Modify: `src/lib/db/schema.ts`
- Test: `tests/unit/wordpress/webhook.test.ts`
- Test: `tests/unit/security/rate-limit.test.ts`

**Interfaces:**

- Produces `verifyWordPressWebhook(request): Promise<VerifiedWebhookPayload>`.
- Produces `enqueueRebuildEvent(payload): Promise<void>`.
- Produces `processDueRebuildEvents(now): Promise<RebuildProcessResult>`.

**Steps:**

- [ ] Verify HMAC-SHA256 signatures with `WORDPRESS_WEBHOOK_SECRET`.
- [ ] Return HTTP 401 for invalid signatures.
- [ ] Rate-limit rebuild webhook requests by signature and source IP to 30 per minute.
- [ ] Store published-content webhook events in `rebuild_events` with `scheduled_at` set 120 seconds after the newest relevant event.
- [ ] Use Upstash Redis locks so rapid successive publish events are debounced into one deploy trigger.
- [ ] Process due rebuild events from `src/pages/api/cron/process-rebuilds.ts` only when `CRON_SECRET` is valid.
- [ ] Trigger `VERCEL_DEPLOY_HOOK_URL` for the debounced rebuild.
- [ ] Implement shared Resend send wrapper with HTML and plain-text support.
- [ ] Create admin build-failure alert email with HTML and plain-text output.
- [ ] Send build failure alerts to OZMO and the implementation owner.
- [ ] Record build duration and flag duration above 5 minutes for architecture review.
- [ ] Run `npm run test -- tests/unit/wordpress/webhook.test.ts tests/unit/security/rate-limit.test.ts`; expected result is webhook and rebuild rate-limit tests passing.
- [ ] Commit with `feat: add wordpress rebuild webhook processing`.

**Exit criteria:**

- Invalid webhook signatures receive 401.
- Published WordPress changes trigger debounced deploys.
- Build failure and long-build alert paths are test-covered.

## Phase 3: Forms, Lead Storage, And Site Review Branching

### Task 3.1: Lead Schema, Validation, Rate Limiting, And Email Base

**Files:**

- Modify: `src/lib/db/schema.ts`
- Create: `src/lib/leads/types.ts`
- Create: `src/lib/leads/validation.ts`
- Create: `src/lib/leads/repository.ts`
- Modify: `src/lib/security/rate-limit.ts`
- Modify: `src/lib/email/resend.ts`
- Modify: `src/lib/email/templates.ts`
- Create: `src/emails/contact-confirmation.ts`
- Create: `src/emails/contact-internal-notification.ts`
- Create: `src/emails/site-review-confirmation.ts`
- Create: `src/pages/api/webhooks/resend.ts`
- Test: `tests/unit/leads/validation.test.ts`
- Test: `tests/unit/security/rate-limit.test.ts`
- Test: `tests/unit/email/templates.test.ts`

**Interfaces:**

- Produces `ContactFormSchema`, `ExistingSiteAuditSchema`, and `NewSiteReadinessSchema`.
- Produces `createLead(input: NormalizedLeadInput): Promise<Lead>`.
- Produces `checkRateLimit(endpoint, keyParts): Promise<RateLimitResult>`.
- Produces email template renderers with HTML and plain-text alternatives.

**Steps:**

- [ ] Create lead, lead detail, note, status event, suppression, and privacy request tables.
- [ ] Validate contact fields: name, email, business name, message, interest selector, honeypot.
- [ ] Validate existing-site fields: shared fields plus required website URL.
- [ ] Validate no-website fields: shared fields plus business type or industry, primary service or offer, target customer, current online presence, website goal.
- [ ] Normalize shared admin fields: `record_type`, `source_route`, `source_cta`, `contact_name`, `contact_email`, `business_name`, `status`, `created_at`, `updated_at`.
- [ ] Implement Upstash rate limits exactly as the spec table defines.
- [ ] Return HTTP 429 with visitor copy: "Too many attempts were received. Wait a little while and try again."
- [ ] Extend the shared Resend template registry with contact and site review emails, each with HTML and plain-text alternatives.
- [ ] Implement Resend bounce and complaint webhook verification with `RESEND_WEBHOOK_SECRET`.
- [ ] Suppress hard bounces and complaints from future non-transactional email.
- [ ] Check email suppression before non-transactional sending.
- [ ] Run `npm run test -- tests/unit/leads tests/unit/security tests/unit/email`; expected result is all unit tests passing.
- [ ] Commit with `feat: add lead validation storage and email base`.

**Exit criteria:**

- All form validation is server-side and test-covered.
- In-memory rate limiting is not used.
- Email templates include HTML and plain text.

### Task 3.2: Contact Page And Confirmation Flow

**Files:**

- Create: `src/pages/contact.astro`
- Create: `src/pages/thank-you/contact.astro`
- Create: `src/components/forms/ContactForm.astro`
- Create: `src/actions/contact.ts`
- Test: `tests/e2e/contact.spec.ts`

**Interfaces:**

- Produces a contact submission that creates a `contact_inquiry` lead.
- Produces contact confirmation and internal notification emails.

**Steps:**

- [ ] Build Contact page with visible labels for name, email, business name, message, and interest selector.
- [ ] Include secondary links to `Get a Free Site Review` and `Schedule a Discovery Call`.
- [ ] Add honeypot field hidden from visual users but present for spam filtering.
- [ ] On validation failure, focus the error summary and link each error with `aria-describedby`.
- [ ] On successful submission, store lead in Postgres, send visitor confirmation, send internal notification, track `contact_submit`, and redirect to `/thank-you/contact`.
- [ ] Write Playwright tests for valid submit, invalid submit, honeypot rejection, keyboard navigation, and no-JavaScript form post.
- [ ] Run `npm run test:e2e -- tests/e2e/contact.spec.ts`; expected result is all contact tests passing.
- [ ] Commit with `feat: add contact inquiry flow`.

**Exit criteria:**

- Contact form is accessible with or without JavaScript.
- Contact lead appears in Postgres and admin model fields normalize correctly.

### Task 3.3: Site Review Branch Wizard And Confirmation Flow

**Files:**

- Create: `src/pages/free-site-audit.astro`
- Create: `src/pages/thank-you/site-review.astro`
- Create: `src/components/forms/SiteReviewWizard.astro`
- Create: `src/components/forms/FormErrorSummary.astro`
- Create: `src/actions/site-review.ts`
- Test: `tests/e2e/site-review.spec.ts`
- Test: `tests/e2e/a11y.spec.ts`

**Interfaces:**

- Produces `existing_site_audit` leads from `/free-site-audit?type=existing`.
- Produces `new_site_readiness_review` leads from `/free-site-audit?type=new`.
- Produces branch-specific metadata based on query string and submitted branch.

**Steps:**

- [ ] Build Step 1 with native radio-card controls for "Yes, I have a website" and "No, I need a new website."
- [ ] Build Step 2 fields for the selected branch and preserve compatible shared fields when navigating back.
- [ ] JavaScript branch changes update H1, visible copy, browser history query string, form fields, and metadata-relevant state without full page reload.
- [ ] Non-JavaScript branch selection posts to the same route and returns server-rendered selected branch.
- [ ] On branch change, move focus to the Step 2 heading.
- [ ] Announce revealed branch fields through `aria-live="polite"`.
- [ ] Ensure removed branch fields are not focusable.
- [ ] Use existing-site metadata exactly as the spec defines.
- [ ] Use no-website metadata exactly as the spec defines.
- [ ] On successful submission, create lead with status `needs_review`, send site review confirmation, track `site_review_submit_existing` or `site_review_submit_new`, and redirect to `/thank-you/site-review`.
- [ ] Use exact confirmation copy from the spec on `/thank-you/site-review`.
- [ ] Do not show Site Review Walkthrough slots after submission.
- [ ] Write tests for JS branch switching, no-JS branch selection, focus movement, aria-live announcement, validation errors, and successful submits for both branches.
- [ ] Run `npm run test:e2e -- tests/e2e/site-review.spec.ts tests/e2e/a11y.spec.ts`; expected result is all site review and related accessibility tests passing.
- [ ] Commit with `feat: add site review branching flow`.

**Exit criteria:**

- Both branches satisfy naming, routing, metadata, and accessibility requirements.
- New submissions require admin preparation before private scheduling links exist.

## Phase 4: Admin Console

### Task 4.1: Auth.js Google OAuth, Admin Guard, CSRF, And Hidden Unauthorized Routes

**Files:**

- Create: `src/lib/auth/auth.ts`
- Create: `src/lib/auth/admin.ts`
- Create: `src/lib/auth/session-activity.ts`
- Create: `src/lib/security/csrf.ts`
- Create: `src/pages/api/auth/[...auth].ts`
- Create: `src/layouts/AdminLayout.astro`
- Modify: `src/lib/db/schema.ts`
- Test: `tests/unit/auth/admin.test.ts`
- Test: `tests/e2e/admin-auth.spec.ts`

**Interfaces:**

- Produces `requireAdmin(AstroContext): Promise<AdminUser>`.
- Produces `requireAdminOr404(AstroContext): Promise<AdminUser>`.
- Produces `issueCsrfToken(sessionId): Promise<string>` and `verifyCsrfToken(token): Promise<boolean>`.

**Steps:**

- [ ] Configure Auth.js with Google OAuth and database-backed sessions.
- [ ] Request Google OAuth user identity scopes for admin login.
- [ ] Set session cookie flags `HttpOnly`, `Secure`, and `SameSite=Lax`.
- [ ] Enforce 7-day absolute session lifetime.
- [ ] Enforce 8-hour idle session lifetime with `admin_session_activity`.
- [ ] Parse `ADMIN_EMAIL_ALLOWLIST` as a comma-separated list.
- [ ] Redirect unauthenticated `/admin/*` visitors to admin login.
- [ ] Return 404 for authenticated users not on the allowlist.
- [ ] Add `X-Robots-Tag: noindex, nofollow` to all admin responses.
- [ ] Require CSRF verification for every mutating admin action.
- [ ] Run `npm run test -- tests/unit/auth` and `npm run test:e2e -- tests/e2e/admin-auth.spec.ts`; expected result is all auth tests passing.
- [ ] Commit with `feat: add protected admin authentication`.

**Exit criteria:**

- Unauthorized users cannot confirm admin route existence.
- Admin sessions are database-backed and bounded by idle and absolute rules.
- Admin mutations reject invalid CSRF tokens.

### Task 4.2: Admin Lead, Audit, Booking, Notes, Status, And CSV Workflows

**Files:**

- Create: `src/pages/admin/index.astro`
- Create: `src/pages/admin/leads/index.astro`
- Create: `src/pages/admin/leads/[id].astro`
- Create: `src/pages/admin/audits/index.astro`
- Create: `src/pages/admin/bookings/index.astro`
- Create: `src/components/admin/AdminTable.astro`
- Create: `src/components/admin/StatusBadge.astro`
- Create: `src/components/admin/StatusTransitionForm.astro`
- Create: `src/components/admin/InternalNotes.astro`
- Create: `src/actions/admin.ts`
- Create: `src/lib/leads/status.ts`
- Test: `tests/unit/leads/status.test.ts`
- Test: `tests/e2e/admin-workflows.spec.ts`

**Interfaces:**

- Produces admin list and detail screens for contact submissions, audits, readiness reviews, and bookings.
- Produces CSV export for allowlisted admins.
- Produces status transition and note creation actions.

**Steps:**

- [ ] Build dashboard counts for new leads, needs review, ready to schedule, scheduled calls, and calendar connection state.
- [ ] Build `/admin/leads` with filters for record type, status, and date range.
- [ ] Build `/admin/leads/[id]` with lead details, status history, internal notes, and allowed next statuses.
- [ ] Build `/admin/audits` with existing-site and no-website review queue.
- [ ] Build `/admin/bookings` with booking statuses and action links.
- [ ] Implement allowed lead status transitions exactly as the spec table defines.
- [ ] Audit-log every status change with actor, timestamp, previous status, new status, and optional note.
- [ ] Implement internal note creation with CSRF protection.
- [ ] Implement CSV export limited to allowlisted admins.
- [ ] Audit-log CSV export with actor, timestamp, record count, and export type.
- [ ] Implement manual no-show status update for bookings.
- [ ] Implement scheduling token revocation action for admins.
- [ ] Run `npm run test -- tests/unit/leads/status.test.ts` and `npm run test:e2e -- tests/e2e/admin-workflows.spec.ts`; expected result is all admin workflow tests passing.
- [ ] Commit with `feat: add admin lead management`.

**Exit criteria:**

- Admin can view, filter, update, note, export, and audit lead records.
- Canonical statuses and booking statuses are enforced.
- Transactional emails remain notifications only and are not the system of record.

### Task 4.3: Privacy, Retention, And Suppression Operations

**Files:**

- Create: `src/lib/privacy/retention.ts`
- Create: `src/lib/privacy/deletion.ts`
- Modify: `src/pages/admin/leads/[id].astro`
- Modify: `src/lib/email/resend.ts`
- Test: `tests/unit/privacy/retention.test.ts`
- Test: `tests/unit/privacy/deletion.test.ts`

**Interfaces:**

- Produces `anonymizeLead(leadId, actorUserId): Promise<void>`.
- Produces `applyRetentionPolicy(now): Promise<RetentionResult>`.
- Produces `suppressEmail(email, reason): Promise<void>`.

**Steps:**

- [ ] Implement spam/rejected deletion or anonymization after 90 days.
- [ ] Implement closed-lost deletion or anonymization after 24 months.
- [ ] Implement booking retention for 24 months.
- [ ] Implement audit log retention for 36 months.
- [ ] Implement verified deletion request processing within Postgres data and suppression records.
- [ ] Preserve legally required audit markers while removing or anonymizing PII.
- [ ] Add admin action for verified deletion completion.
- [ ] Run `npm run test -- tests/unit/privacy`; expected result is retention and deletion tests passing.
- [ ] Commit with `feat: add privacy retention operations`.

**Exit criteria:**

- Privacy policy claims are backed by operational behavior.
- Deleted or anonymized emails are suppressed from future marketing contact.

## Phase 5: Scheduling And Google Calendar Integration

### Task 5.1: Security Primitives, Calendar Connection, And Admin Calendar State

**Files:**

- Create: `src/lib/security/crypto.ts`
- Create: `src/lib/scheduling/calendar.ts`
- Create: `src/components/admin/CalendarConnectionPanel.astro`
- Create: `src/pages/api/admin/calendar/connect.ts`
- Create: `src/pages/api/admin/calendar/callback.ts`
- Modify: `src/lib/db/schema.ts`
- Modify: `src/pages/admin/index.astro`
- Test: `tests/unit/security/crypto.test.ts`
- Test: `tests/unit/scheduling/calendar-fail-closed.test.ts`

**Interfaces:**

- Produces `generateToken(bytes = 32): string`.
- Produces `hashToken(rawToken): string`.
- Produces `encryptSecret(plainText): EncryptedSecret`.
- Produces `decryptSecret(encrypted): string`.
- Produces `getCalendarConnection(): Promise<CalendarConnectionState>`.

**Steps:**

- [ ] Implement 256-bit token generation for private links and management links.
- [ ] Implement SHA-256 token hashing.
- [ ] Implement AES-256-GCM encryption for OAuth refresh tokens.
- [ ] Build admin calendar connection panel showing connected state or `calendar_connection_required`.
- [ ] Build Google OAuth owner consent flow for one OZMO scheduling owner account.
- [ ] Store encrypted refresh token and calendar IDs in Postgres.
- [ ] Surface token expiry or revocation as `calendar_connection_required`.
- [ ] Ensure public scheduling fails closed when the calendar connection is invalid.
- [ ] Run `npm run test -- tests/unit/security tests/unit/scheduling/calendar-fail-closed.test.ts`; expected result is all security and fail-closed tests passing.
- [ ] Commit with `feat: add calendar connection security`.

**Exit criteria:**

- No raw scheduling tokens or refresh tokens are stored.
- Admin can connect or reconnect the scheduling owner Google account.
- Invalid calendar connection prevents slot display.

### Task 5.2: Availability Rules, Timezones, Free/Busy, And Request-Time Fallback

**Files:**

- Create: `src/lib/scheduling/timezones.ts`
- Create: `src/lib/scheduling/availability.ts`
- Create: `src/actions/scheduling.ts`
- Create: `src/pages/schedule/index.astro`
- Create: `src/components/scheduling/Scheduler.astro`
- Create: `src/components/scheduling/TimezoneSelect.astro`
- Create: `src/components/scheduling/SlotPicker.astro`
- Create: `src/emails/admin-alert-calendar.ts`
- Modify: `src/lib/email/templates.ts`
- Test: `tests/unit/scheduling/timezones.test.ts`
- Test: `tests/unit/scheduling/availability.test.ts`
- Test: `tests/e2e/scheduling.spec.ts`

**Interfaces:**

- Produces `validateIanaTimezone(value): string`.
- Produces `generateCandidateSlots(callType, window, ozmoTimezone): Slot[]`.
- Produces `getAvailableSlots(input): Promise<AvailableSlot[]>`.

**Steps:**

- [ ] Default OZMO business timezone to `America/Chicago`.
- [ ] Detect visitor timezone with `Intl.DateTimeFormat().resolvedOptions().timeZone` when JavaScript is available.
- [ ] Provide manual timezone override and server-side IANA validation.
- [ ] Generate candidate slots from allowed weekdays, allowed hours, blocked dates, minimum notice of 24 hours, 15-minute buffers, maximum 4 calls per day, and 14-day default window.
- [ ] Query Google Calendar free/busy for primary booking calendar and configured busy calendars using UTC timestamps.
- [ ] Use 5-second free/busy timeout and 2 retries with exponential backoff.
- [ ] Show no slots when free/busy times out, quota exhausts, API returns 5xx after retries, or API returns 401/403.
- [ ] Show visitor copy: "Scheduling is temporarily unavailable. You can request a time and OZMO will follow up."
- [ ] Send admin alerts for quota exhaustion and Google API 401/403 responses.
- [ ] Send admin alerts when Calendar connection state becomes `calendar_connection_required`.
- [ ] Show empty availability copy exactly as the spec defines.
- [ ] Offer "Extend date range by 14 days" and "Request a time."
- [ ] Implement Request a Time to create `scheduling_request`, notify OZMO, and track `request_time_submit`.
- [ ] With JavaScript unavailable, `/schedule` shows Request a Time fallback form.
- [ ] Run `npm run test -- tests/unit/scheduling/timezones.test.ts tests/unit/scheduling/availability.test.ts` and `npm run test:e2e -- tests/e2e/scheduling.spec.ts`; expected result is scheduling tests passing for public availability.
- [ ] Commit with `feat: add scheduling availability`.

**Exit criteria:**

- Scheduler handles timezone display without manual offset math.
- Calendar failures fail closed.
- No-JavaScript visitors can request a time.

### Task 5.3: Booking Holds, Discovery Booking, Confirmation, And Management Links

**Files:**

- Create: `src/lib/scheduling/holds.ts`
- Create: `src/lib/scheduling/bookings.ts`
- Create: `src/lib/scheduling/tokens.ts`
- Create: `src/pages/thank-you/booking.astro`
- Create: `src/emails/booking-confirmation.ts`
- Create: `src/emails/booking-cancellation.ts`
- Create: `src/emails/booking-reschedule-confirmation.ts`
- Modify: `src/actions/scheduling.ts`
- Test: `tests/unit/scheduling/holds.test.ts`
- Test: `tests/unit/scheduling/tokens.test.ts`
- Test: `tests/e2e/scheduling.spec.ts`

**Interfaces:**

- Produces `createHold(input): Promise<BookingHold>`.
- Produces `confirmBooking(input): Promise<Booking>`.
- Produces `createManagementToken(bookingId, eventEnd): Promise<RawTokenResult>`.

**Steps:**

- [ ] Create a 10-minute booking hold when the visitor selects a slot and enters booking details.
- [ ] Store holds with UTC start/end, call type, email hash, visitor timezone, and `expires_at`.
- [ ] Ignore expired holds during availability checks.
- [ ] Reject final booking when an active hold blocks the slot unless it is the visitor's own hold.
- [ ] Revalidate Google Calendar availability immediately before event creation.
- [ ] Create Google Calendar event on the primary booking calendar with visitor email as attendee and `sendUpdates=all`.
- [ ] Store UTC start/end, OZMO timezone, visitor timezone, Google calendar ID, and Google event ID.
- [ ] Create booking management token valid until 7 days after scheduled event end.
- [ ] Send booking confirmation email with management link and both visitor local time and OZMO business time.
- [ ] Do not attach `.ics` files from Resend.
- [ ] Track `discovery_call_started` and `discovery_call_booked`.
- [ ] Run `npm run test -- tests/unit/scheduling/holds.test.ts tests/unit/scheduling/tokens.test.ts` and `npm run test:e2e -- tests/e2e/scheduling.spec.ts`; expected result is booking tests passing.
- [ ] Commit with `feat: add booking holds and discovery booking`.

**Exit criteria:**

- Booking holds prevent double booking during form entry.
- Google Calendar event creation is the final source of actual event time.
- Confirmation emails include management links and dual timezone display.

### Task 5.4: Private Review Walkthrough Scheduling

**Files:**

- Create: `src/pages/schedule/review/[token].astro`
- Create: `src/emails/site-review-ready-to-schedule.ts`
- Modify: `src/actions/admin.ts`
- Modify: `src/lib/scheduling/tokens.ts`
- Modify: `src/lib/scheduling/bookings.ts`
- Test: `tests/unit/scheduling/tokens.test.ts`
- Test: `tests/e2e/scheduling.spec.ts`
- Test: `tests/e2e/admin-workflows.spec.ts`

**Interfaces:**

- Produces private scheduling token lifecycle tied to one review request and one recipient email.
- Produces admin action to send Site Review Walkthrough link after `ready_to_schedule`.

**Steps:**

- [ ] Add admin action that marks a review request `ready_to_schedule`.
- [ ] Generate a private review scheduling token with at least 128 bits of randomness.
- [ ] Store token hash, recipient email hash, lead ID, expiration 14 days after creation, and status `active`.
- [ ] Send Site Review Walkthrough private scheduling email only after admin marks the review ready.
- [ ] Render `/schedule/review/[token]` only for valid active private tokens.
- [ ] Show exact invalid, expired, already-used, and revoked token copy from the spec.
- [ ] Mark token single-use after booking confirmation.
- [ ] Track `review_walkthrough_booked`.
- [ ] Run targeted token and E2E tests; expected result is valid, invalid, expired, used, and revoked states covered.
- [ ] Commit with `feat: add private review scheduling`.

**Exit criteria:**

- Review walkthrough slots are unavailable until OZMO prepares the review.
- Private scheduling links are hashed, expiring, revocable, recipient-tied, and single-use.

### Task 5.5: Visitor Booking Management, Refresh, Reschedule, Cancel, And No-Show

**Files:**

- Create: `src/pages/schedule/manage/[token].astro`
- Modify: `src/lib/scheduling/bookings.ts`
- Modify: `src/actions/scheduling.ts`
- Modify: `src/actions/admin.ts`
- Modify: `src/pages/admin/bookings/index.astro`
- Test: `tests/e2e/scheduling.spec.ts`
- Test: `tests/e2e/admin-workflows.spec.ts`

**Interfaces:**

- Produces visitor cancellation and rescheduling through management token.
- Produces admin `Refresh from Google Calendar` action.

**Steps:**

- [ ] Validate booking management token hash and expiration.
- [ ] Allow visitor cancellation until 24 hours before call.
- [ ] Inside 24 hours, show copy directing visitor to email OZMO.
- [ ] Cancellation updates Postgres and cancels Google Calendar event.
- [ ] Rescheduling cancels current booking, marks old booking `rescheduled`, selects a new available slot, creates a new Google Calendar event, and sends reschedule confirmation.
- [ ] Admin `Refresh from Google Calendar` reads Google event state.
- [ ] If Google event is missing, mark booking `calendar_missing`.
- [ ] Admin can manually mark no-show in V1.
- [ ] Do not add background Google Calendar sync-back.
- [ ] Run `npm run test:e2e -- tests/e2e/scheduling.spec.ts tests/e2e/admin-workflows.spec.ts`; expected result is cancellation, reschedule, refresh, and no-show tests passing.
- [ ] Commit with `feat: add booking management`.

**Exit criteria:**

- Visitor booking management works through `/schedule/manage/[token]`.
- Calendar deletions surface through manual admin refresh.
- No background sync-back exists in V1.

## Phase 6: Verification, Performance, And Launch Readiness

### Task 6.1: SEO, Robots, Sitemap, Structured Data, And Analytics Verification

**Files:**

- Modify: `src/lib/seo/routes.ts`
- Modify: `src/lib/seo/schema.ts`
- Modify: `src/lib/analytics/plausible.ts`
- Test: `tests/e2e/public-pages.spec.ts`
- Test: `tests/unit/seo/schema.test.ts`

**Steps:**

- [ ] Verify every indexable page has title, meta description, canonical URL, and Open Graph metadata.
- [ ] Verify private and tokenized routes are noindex.
- [ ] Verify admin routes are sitemap-excluded and return `X-Robots-Tag: noindex, nofollow`.
- [ ] Verify sitemap includes only indexable public pages.
- [ ] Verify RSS feed exists once 3 posts are published.
- [ ] Verify `Organization`, `Service`, `BlogPosting`, and `BreadcrumbList` schema output.
- [ ] Verify `ProfessionalService` and `LocalBusiness` are not emitted.
- [ ] Verify Plausible events: `cta_free_site_review_click`, `audit_branch_existing_selected`, `audit_branch_new_selected`, `site_review_submit_existing`, `site_review_submit_new`, `discovery_call_started`, `discovery_call_booked`, `review_walkthrough_booked`, `contact_submit`, `request_time_submit`, `blog_cta_click`, `portfolio_cta_click`.
- [ ] Run `npm run test -- tests/unit/seo` and `npm run test:e2e -- tests/e2e/public-pages.spec.ts`; expected result is SEO and analytics checks passing.
- [ ] Commit with `test: verify seo and analytics`.

**Exit criteria:**

- SEO and structured data behavior matches the spec.
- Required Plausible conversion events are wired.

### Task 6.2: Accessibility, Browser, And No-JavaScript Verification

**Files:**

- Modify: `tests/e2e/a11y.spec.ts`
- Modify: `tests/e2e/visual-viewports.spec.ts`
- Modify: `playwright.config.ts`

**Steps:**

- [ ] Test Chrome, Edge-compatible Chromium, Firefox, WebKit, iOS Safari emulation, and Android Chrome emulation.
- [ ] Test minimum viewport 320 CSS px.
- [ ] Test keyboard access for nav, forms, admin controls, and scheduler controls.
- [ ] Test visible focus states.
- [ ] Test visible labels on all forms.
- [ ] Test errors associated with fields.
- [ ] Test reduced-motion rendering for hero and non-essential motion.
- [ ] Test no-JavaScript readable public content and navigation.
- [ ] Test no-JavaScript site review branch selection through server-rendered submission.
- [ ] Test no-JavaScript scheduler Request a Time fallback.
- [ ] Run `npm run test:a11y`; expected result is accessibility suite passing.
- [ ] Commit with `test: verify accessibility matrix`.

**Exit criteria:**

- Supported browsers and device widths pass smoke checks.
- Accessibility requirements are verified before launch.

### Task 6.3: Performance Budgets, Bundle Isolation, And Lighthouse CI

**Files:**

- Modify: `lighthouserc.cjs`
- Create: `tests/unit/performance/bundle-budget.test.ts`
- Modify: `astro.config.mjs`

**Steps:**

- [ ] Run Lighthouse CI against `/`, `/services`, `/free-site-audit`, and `/schedule` with mobile defaults or stricter documented profile.
- [ ] Enforce Lighthouse score 90 or higher for Performance, Accessibility, Best Practices, and SEO.
- [ ] Enforce marketing-page JavaScript 80 KB gzip or less per route, excluding admin and scheduler interactive chunks.
- [ ] Enforce initial page weight 1 MB or less for core marketing pages.
- [ ] Verify admin code does not load on public marketing pages.
- [ ] Verify LCP target remains H1 unless performance evidence proves another target meets 2.5 seconds or less.
- [ ] Verify CLS is 0.1 or less.
- [ ] Record INP budget of 200 ms p75 for field data once available.
- [ ] Run `npm run test:lighthouse`; expected result is all budgets passing.
- [ ] Commit with `test: enforce performance budgets`.

**Exit criteria:**

- Performance budgets are CI-enforced.
- Admin and scheduler complexity does not leak into public marketing bundles.

### Task 6.4: External Service Verification And Launch Readiness Gate

**Files:**

- Create: `docs/launch/verification-checklist.md`
- Create: `docs/launch/content-approval-checklist.md`
- Create: `docs/launch/legal-approval-checklist.md`
- Create: `docs/launch/security-checklist.md`

**Steps:**

- [ ] Verify Resend sending domain `mail.ozmodigital.com` with SPF, DKIM, and DMARC `p=none`.
- [ ] Verify Resend bounce and complaint webhook and email suppression behavior.
- [ ] Verify Google Calendar owner connection and reconnect path.
- [ ] Verify WordPress rebuild webhook HMAC, debounce, deploy hook, failure alert, and build-duration alert threshold.
- [ ] Verify Neon TLS connection, encryption at rest, daily backups, and 30-day backup retention.
- [ ] Verify legal page copy has owner approval.
- [ ] Verify production launch content inventory: homepage copy, 6 services, contact page copy, site review branch copy, schedule page copy, privacy, terms, cookie notice, 3 blog posts, 3 transformation examples, default OG image, page-specific OG images, icon set, favicon set.
- [ ] Verify all end-to-end flows: contact, existing-site review, no-website review, discovery booking, private walkthrough booking, cancellation, rescheduling, admin follow-up, CSV export, deletion/anonymization.
- [ ] Run `npm run verify`; expected result is check, unit, E2E, and Lighthouse suites passing.
- [ ] Commit with `docs: add launch verification checklists`.

**Exit criteria:**

- Launch blockers are documented with owner and status.
- External integrations are verified in staging before production launch.

## Phase 7: Launch Operations

### Task 7.1: Production Environment, DNS, WordPress, Email, Analytics, And Backups

**Files:**

- Modify: `docs/launch/verification-checklist.md`
- Modify: `docs/launch/security-checklist.md`

**Steps:**

- [ ] Configure production domain default `ozmodigital.com` unless owner approves a different domain.
- [ ] Configure Vercel production project with all required environment variables.
- [ ] Configure Neon production database, TLS, encryption at rest, daily backups, and 30-day retention.
- [ ] Run production migrations with `npm run db:migrate`.
- [ ] Configure managed WordPress hosting, install OZMO mu-plugins, sync ACF JSON, and confirm REST access.
- [ ] Configure WordPress webhook secret and endpoint.
- [ ] Configure Resend sending domain `mail.ozmodigital.com`, SPF, DKIM, DMARC `p=none`, reply-to `hello@ozmodigital.com`, bounce webhook, and complaint webhook.
- [ ] Configure Plausible domain and verify events in staging.
- [ ] Configure Google OAuth clients for admin Auth.js and scheduling Calendar owner consent.
- [ ] Configure admin email allowlist with one OZMO owner Google account by default.
- [ ] Configure `OZMO_REVIEW_WEEKLY_CAPACITY=5`.
- [ ] Commit launch docs changes with `docs: document production operations`.

**Exit criteria:**

- Production environment is configured without secrets committed to the repository.
- DNS, email, analytics, CMS, database, auth, and calendar dependencies are ready for production smoke testing.

### Task 7.2: Production Deploy, Smoke Test, And Go-Live Verification

**Files:**

- Modify: `docs/launch/verification-checklist.md`

**Steps:**

- [ ] Set `PRODUCTION_LAUNCH_APPROVED=true` only after owner approves legal copy and launch content.
- [ ] Deploy production on Vercel.
- [ ] Verify production smoke test passes for `/`, `/services`, `/portfolio`, `/blog`, `/contact`, `/free-site-audit`, `/schedule`, `/privacy`, `/terms`, and `/cookie-notice`.
- [ ] Verify admin can log in.
- [ ] Submit a test contact lead, view it in admin, export CSV, and delete or anonymize the test record.
- [ ] Submit test existing-site review and no-website readiness review, verify admin queue, mark ready to schedule, and verify private scheduling email.
- [ ] Create, reschedule, and cancel a test booking.
- [ ] Verify Google Calendar event and attendee invite behavior.
- [ ] Verify Plausible receives required test conversion events.
- [ ] Verify robots and sitemap in production.
- [ ] Verify no fake testimonials, fake metrics, fake case studies, fake local-business schema, or fake address appear in production HTML.
- [ ] Record go-live result in `docs/launch/verification-checklist.md`.
- [ ] Commit with `docs: record production launch verification`.

**Exit criteria:**

- Production smoke test passes.
- Admin, forms, scheduling, analytics, and legal routes work in production.
- OZMO can operate lead review and booking workflows from the admin console.

## Phase Exit Criteria Summary

| Phase | Exit criteria |
| --- | --- |
| Phase 1 | Astro foundation builds, route inventory exists, design tokens and fonts pass budgets, legal shells exist, hero viewport and accessibility smoke checks pass |
| Phase 2 | WordPress CPT/ACF model exists, REST adapter and snapshots work, public pages render WordPress content, blog/RSS gating works, sitemap/robots rules pass |
| Phase 3 | Contact and site review forms validate server-side, store normalized leads, rate-limit correctly, send Resend email, and pass accessibility/no-JS tests |
| Phase 4 | Admin auth, allowlist, hidden unauthorized 404s, CSRF, status transitions, notes, CSV export, audit logs, privacy retention, and deletion operations work |
| Phase 5 | Public discovery booking, private review walkthrough scheduling, tokens, holds, fail-closed Calendar availability, cancellation, rescheduling, no-show, and refresh workflows work |
| Phase 6 | Lighthouse CI, accessibility, browser matrix, SEO, structured data, analytics, legal, email, Calendar, WordPress webhook, and end-to-end verification pass |
| Phase 7 | Production environment, DNS, email auth, WordPress, Neon, Plausible, Google OAuth, Vercel deployment, smoke tests, admin workflows, and analytics events are verified |

## Out Of Scope Guardrails For Implementers

- Do not add industry-specific landing pages in V1.
- Do not add testimonials or testimonial CMS models.
- Do not add real case studies unless real approved assets and a later spec revision authorize them.
- Do not add CRM integrations beyond the protected Astro admin lead console.
- Do not add automated nurture sequences.
- Do not add a client portal.
- Do not add paid ads landing page variants.
- Do not attach `.ics` files from Resend.
- Do not add background Google Calendar sync-back.
- Do not add session replay, ad pixels, or remarketing tags.
- Do not add a cookie consent banner while only cookie-free Plausible is active.

## Unresolved Assumptions And Owner Decisions

Implementation can proceed with spec defaults, but production launch requires owner sign-off on these items:

- Production domain default: `ozmodigital.com`
- Email sending domain default: `mail.ozmodigital.com`
- Public reply-to default: `hello@ozmodigital.com`
- Admin email allowlist default: one OZMO owner Google account
- Local market posture default: geography-agnostic with no local address shown
- Weekly free audit capacity default: 5 audit/readiness reviews per week
- Legal policy approval: owner-approved privacy, terms, and cookie notice copy
- Launch content approval: 3 blog posts, 3 transformations, service descriptions, and business claims approved by OZMO

## Self-Review Results

### Spec Coverage

- Requirement levels are preserved by carrying `MUST`, `MUST NOT`, `SHOULD`, and `MAY` constraints into Global Constraints and phase gates.
- Goal, audience, positioning, StoryBrand messaging, naming table, CTA hierarchy, homepage flow, creative direction, and visual system are covered in Phases 1 and 2.
- Services, portfolio, transformations, blog, contact, site review branching, and branch accessibility are covered in Phases 2 and 3.
- Scheduling call types, private tokens, timezone handling, availability rules, booking holds, Google Calendar auth, fail-closed behavior, booking source of truth, cancellation, rescheduling, no-show, and ICS prohibition are covered in Phase 5.
- WordPress content management, build/runtime strategy, failure behavior, and rebuild webhook mechanics are covered in Phase 2 and Phase 6.
- Technical architecture, admin access, canonical status model, Auth.js Google OAuth, privacy, retention, forms, spam, rate limiting, email, SEO, legal pages, analytics, performance, accessibility, browser support, JavaScript support, launch content, Open Graph/Twitter metadata, and brand assets are covered across Phases 1 through 7.
- Out-of-scope items are explicitly guarded in the plan.

### Contradiction Check

- The plan keeps WordPress as source of truth for public content and does not hardcode V1 portfolio examples in Astro.
- The plan keeps Postgres as source of truth for leads, audits, bookings, admin notes, tokens, sessions, and audit logs.
- The plan does not introduce testimonials, local-business schema, fake metrics, fake case studies, fake addresses, or fake client proof.
- The plan does not make scheduling available before Calendar verification or before private review tokens are created by admin readiness actions.
- The plan treats Phase 6 as verification of earlier work, not the first place accessibility, SEO, performance, privacy, or legal work appears.
- The plan creates shared rebuild rate limiting and email alert infrastructure in Phase 2 before Phase 3 extends it for lead forms and lead emails.

### Placeholder And Vagueness Check

- No task depends on unstated route names, hidden models, or unnamed external systems.
- Every phase lists exact files to create or modify, required interfaces, test files, commands, and exit criteria.
- Open owner decisions are listed as launch decisions with spec defaults, not engineering gaps.

### Ordering Check

- Foundation precedes WordPress pages so shared layout, SEO, tokens, fonts, and tests exist first.
- WordPress content model precedes public page rendering so public content ownership is correct from the start.
- Lead storage precedes admin console so admin screens have real data contracts.
- Admin console precedes private review walkthrough scheduling so `ready_to_schedule` and token revocation are available before private scheduler launch.
- Calendar connection and fail-closed availability precede booking confirmation.
- Launch operations occur only after verification and owner approvals.

## Recommended First Implementation Task

Start with Phase 1, Task 1.1: Astro, TypeScript, Vercel, and test scaffold. It creates the project foundation, typed environment validation, route rendering capability, and verification scripts that every later task depends on.
