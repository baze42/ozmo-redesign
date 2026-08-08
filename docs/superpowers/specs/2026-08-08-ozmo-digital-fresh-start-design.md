# OZMO Digital Fresh Start Website Design Spec

| Field | Value |
| --- | --- |
| Version | 0.3 |
| Owner | OZMO Digital |
| Author | Codex |
| Status | Draft for approval |
| Created | 2026-08-08 |
| Last updated | 2026-08-08 |
| Primary artifact | `docs/superpowers/specs/2026-08-08-ozmo-digital-fresh-start-design.md` |

## Requirement Levels

This document uses RFC-style requirement levels.

- **MUST** means the requirement is binding for V1 launch.
- **MUST NOT** means the behavior is prohibited for V1 launch.
- **SHOULD** means the requirement is the default for V1; deviations require a written implementation note and owner approval.
- **MAY** means the feature or behavior is allowed, but not required for V1.

Any requirement not marked MUST, MUST NOT, SHOULD, or MAY is context, rationale, or a design note.

## Open Decisions

These decisions require human sign-off before production launch. Each has a default so implementation can proceed.

| Decision | Default | Owner | Required by |
| --- | --- | --- | --- |
| Production domain | `ozmodigital.com` | OZMO Digital | Launch operations |
| Email sending domain | `mail.ozmodigital.com` | OZMO Digital | Email setup |
| Public reply-to address | `hello@ozmodigital.com` | OZMO Digital | Email setup |
| Admin email allowlist | One OZMO owner Google account | OZMO Digital | Admin authentication |
| Local market posture | Geography-agnostic; no local address shown | OZMO Digital | SEO/schema launch |
| Weekly free audit capacity | 5 audit/readiness reviews per week | OZMO Digital | Lead operations |
| Legal policy approval | Owner-approved privacy, terms, and cookie notice copy | OZMO Digital | Launch |

## Decision Log

| Date | Decision |
| --- | --- |
| 2026-08-08 | Treat the project as a fresh start and ignore prior repo design work. |
| 2026-08-08 | Target broad SMBs for launch; create industry landing pages later. |
| 2026-08-08 | Position OZMO around fast, polished, lead-generation websites and underperforming-site rescue. |
| 2026-08-08 | Use the Transformation Engine concept with a split-screen before/after signature. |
| 2026-08-08 | Use WordPress as the headless CMS for public content from the start. |
| 2026-08-08 | Use Astro as the frontend framework with static-first rendering and selected on-demand routes. |
| 2026-08-08 | Store leads, audits, bookings, and admin notes in Postgres, not WordPress. |
| 2026-08-08 | Include a protected Astro admin console in V1. |
| 2026-08-08 | Use Resend for transactional email. |
| 2026-08-08 | Use Plausible Analytics for privacy-friendly measurement. |

## Goal

Create a fast, visually distinctive, lead-generation-focused marketing website for OZMO Digital. The site MUST show how OZMO helps broad SMBs improve slow, dated, unclear, missing, or low-converting websites.

The site MUST support:

- New websites for businesses without a site.
- Website redesigns and performance improvements.
- Messaging and conversion strategy.
- Local SEO and basic SEO setup as a client service.
- Lead capture forms and follow-up automation.
- Ongoing website care and optimization.

## Audience

The launch audience is broad SMBs. The site MUST NOT target a single vertical industry at launch.

Primary visitor states:

- Existing site is outdated or underperforming.
- Existing site is slow, unclear, hard to trust, or not generating leads.
- Business needs a first website.
- Business owner wants practical guidance without technical jargon.

Future landing pages MAY target local service businesses, professional services, trades, wellness, retail, restaurants, startups, or other SMB segments.

## Positioning

OZMO Digital MUST be positioned as a performance-led, design-forward agency that speaks in clear SMB-friendly language.

Core positioning:

> OZMO Digital turns slow, outdated, unclear, or missing websites into fast, polished lead-generation sites.

OZMO MUST remain geography-agnostic at launch. OZMO MAY sell local SEO as a client service without presenting the agency itself as a local-only business.

OZMO's own site MUST demonstrate local SEO knowledge through service copy, educational content, and future client examples. It MUST NOT publish false local-business structured data, a fake address, or an implied service area.

## StoryBrand Messaging

The site MUST use StoryBrand principles without copying a generic StoryBrand page template.

- **Hero**: The visitor wants a credible, fast, lead-ready website.
- **Problem**: Their current site is slow, dated, unclear, hard to update, not converting, or missing.
- **Guide**: OZMO understands SMB owners need a clear site, strong message, and practical lead path.
- **Plan**: Review, Improve or Build, Launch, Optimize.
- **Primary CTA**: `Get a Free Site Review`.
- **Secondary CTA**: `Schedule a Discovery Call`.
- **Success**: A faster, clearer website that builds trust and gives visitors an obvious next step.
- **Failure avoided**: Lost leads, wasted traffic, unclear messaging, and a website that works against the business.

Tone MUST be plainspoken, confident, practical, design-aware, and performance-focused. Copy MUST NOT speak over SMB owners.

## Naming And Routing Table

The phrase "Free Site Audit" is overloaded in earlier drafts. V1 MUST use the following naming table.

| Usage | User-facing label | Internal identifier | Route |
| --- | --- | --- | --- |
| Primary nav CTA | Get a Free Site Review | `primary_site_review_cta` | `/free-site-audit` |
| Existing-site form path | Free Site Audit | `existing_site_audit` | `/free-site-audit?type=existing` |
| No-website form path | Website Launch Readiness Review | `new_site_readiness_review` | `/free-site-audit?type=new` |
| Manual deliverable | Site Review Summary | `site_review_summary` | Admin-only record |
| Prepared walkthrough call | Site Review Walkthrough | `site_review_walkthrough` | `/schedule/review/[token]` |
| Public sales call | Discovery Call | `discovery_call` | `/schedule?type=discovery` |
| Contact form | Contact OZMO | `contact_inquiry` | `/contact` |

## Site Structure And Route Inventory

Routes MUST use the following inventory.

| Route | Purpose | Indexing |
| --- | --- | --- |
| `/` | Homepage | index |
| `/services` | Services overview | index |
| `/portfolio` | Transformation examples | index |
| `/blog` | Blog index | index when at least 3 posts are published; noindex before then |
| `/blog/[slug]` | Blog detail | index for published posts |
| `/contact` | General inquiry page | index |
| `/free-site-audit` | Site review entry page | index |
| `/schedule` | Public Discovery Call scheduler | index |
| `/schedule/review/[token]` | Private Site Review Walkthrough scheduler | noindex |
| `/schedule/manage/[token]` | Visitor booking management | noindex |
| `/thank-you/contact` | Contact confirmation | noindex |
| `/thank-you/site-review` | Site review confirmation | noindex |
| `/thank-you/booking` | Booking confirmation | noindex |
| `/privacy` | Privacy policy | index |
| `/terms` | Terms of service | index |
| `/cookie-notice` | Cookie and analytics notice | index |
| `/admin` | Admin dashboard | noindex, sitemap-excluded |
| `/admin/leads` | Admin lead list | noindex, sitemap-excluded |
| `/admin/leads/[id]` | Admin lead detail | noindex, sitemap-excluded |
| `/admin/audits` | Admin review queue | noindex, sitemap-excluded |
| `/admin/bookings` | Admin booking list | noindex, sitemap-excluded |
| `/404` | Not found | noindex |
| `/500` | Server error | noindex |

Later routes MAY include:

- `/industries/[slug]`
- `/services/[slug]`
- `/portfolio/[slug]`
- `/resources`

## Admin Discovery Rules

Admin routes MUST be excluded from the sitemap. `robots.txt` MUST disallow `/admin/`.

Admin responses MUST include `X-Robots-Tag: noindex, nofollow`.

Unauthenticated visitors to `/admin/*` MUST be redirected to the admin login flow. Authenticated users not on the admin allowlist MUST receive a 404 response so admin route existence is not confirmed to unauthorized users.

## CTA Hierarchy

The CTA hierarchy MUST be:

1. Primary: `Get a Free Site Review`.
2. Secondary: `Schedule a Discovery Call`.
3. Tertiary: `Contact OZMO`.

Header desktop navigation MUST show the primary CTA as the most prominent action and the secondary CTA as a lower-emphasis link or button. Mobile navigation MUST show both CTAs after the page links, with the primary CTA first.

`Contact OZMO` MUST appear in the footer, Contact page, and contextual support copy. It MUST NOT visually compete with the primary CTA in the header.

All three lead paths MUST normalize into a shared admin model:

- `record_type`: `contact_inquiry`, `existing_site_audit`, `new_site_readiness_review`, `discovery_call`, or `site_review_walkthrough`.
- `source_route`
- `source_cta`
- `contact_name`
- `contact_email`
- `business_name`
- `status`
- `created_at`
- `updated_at`

## Homepage Flow

The homepage MUST follow this structure:

1. Header with logo, navigation, primary CTA, and secondary CTA.
2. Hero with split-screen transformation and StoryBrand-aligned headline.
3. Problem section naming speed, clarity, trust, and lead loss.
4. Guide section positioning OZMO as the practical partner.
5. Plan section: Review, Improve or Build, Launch, Optimize.
6. Services preview.
7. Transformation examples preview.
8. Site review CTA band.
9. Blog preview when at least 3 posts are published.
10. Footer with contact, legal, and CTA links.

## Creative Direction

The site direction is **Transformation Engine**.

The signature visual mechanic MUST be split-screen before/after transformation:

- **Before**: slow, dated, unclear, cluttered, low-conversion.
- **After**: fast, polished, structured, clear, lead-ready.

The mechanic MUST appear in the hero and MAY recur in service previews, portfolio entries, and site review messaging. It MUST NOT become a heavy animation pattern or gimmick.

The site MUST NOT use fabricated client proof, fake client names, invented testimonials, invented metrics, generic agency hero layouts, gradient blobs, decorative orbs, fake 3D dashboards, or stock handshake imagery.

## Visual System

### Color Tokens

| Token | Hex | Role |
| --- | --- | --- |
| Clean Surface | `#FAFAF7` | Primary background |
| White | `#FFFFFF` | Form and panel surface |
| Deep Ink | `#171923` | Primary text |
| Muted Ink | `#4B5563` | Secondary text |
| OZMO Blue | `#2B3F8F` | Structure and after-state emphasis |
| After Blue Soft | `#EEF2FF` | After-state surface |
| OZMO Orange | `#F45B00` | Decoration and brand energy only |
| Action Orange Dark | `#B23A00` | Text-safe CTA orange |
| Orange Soft | `#FFF1E8` | CTA soft background |
| Signal Teal | `#00A6A6` | Decoration only |
| Signal Teal Dark | `#006B6B` | Text-safe success color |
| Teal Soft | `#E6F7F7` | Success soft background |
| Before Gray | `#D8DDE7` | Before-state surface |
| Line Gray | `#B7C0D0` | Borders and dividers only |

### Approved Contrast Pairings

Contrast ratios were calculated from the token hex values.

| Foreground | Background | Ratio | Body text | Large text | UI component | Decoration |
| --- | --- | ---: | --- | --- | --- | --- |
| Deep Ink | Clean Surface | 16.74:1 | yes | yes | yes | yes |
| Muted Ink | Clean Surface | 7.23:1 | yes | yes | yes | yes |
| OZMO Blue | Clean Surface | 9.09:1 | yes | yes | yes | yes |
| OZMO Orange | Clean Surface | 3.17:1 | no | yes | no | yes |
| Action Orange Dark | Clean Surface | 5.74:1 | yes | yes | yes | yes |
| Signal Teal | Clean Surface | 2.87:1 | no | no | no | yes |
| Signal Teal Dark | Clean Surface | 6.06:1 | yes | yes | yes | yes |
| White | OZMO Blue | 9.50:1 | yes | yes | yes | yes |
| White | OZMO Orange | 3.31:1 | no | yes | no | yes |
| White | Action Orange Dark | 6.00:1 | yes | yes | yes | yes |
| Deep Ink | Before Gray | 12.85:1 | yes | yes | yes | yes |
| Muted Ink | Before Gray | 5.55:1 | yes | yes | yes | yes |
| OZMO Blue | After Blue Soft | 8.50:1 | yes | yes | yes | yes |
| Action Orange Dark | Orange Soft | 5.43:1 | yes | yes | yes | yes |
| Signal Teal Dark | Teal Soft | 5.73:1 | yes | yes | yes | yes |
| Line Gray | Clean Surface | 1.75:1 | no | no | no | borders only |

Body text and form labels MUST use approved body-text pairings. OZMO Orange and Signal Teal MUST NOT be used as normal-size text on Clean Surface. Line Gray MUST NOT convey required information alone.

### Non-Color State Requirements

Before/after states MUST be communicated through at least two non-color signals:

- Persistent text labels: `Before` and `After`.
- Structural difference: the before side uses broken hierarchy, low-density CTA treatment, and disordered blocks; the after side uses clear hierarchy, primary CTA position, and aligned sections.
- Icons or status labels MAY reinforce state, but color MUST NOT be the only indicator.

### Typography And Font Loading

V1 MUST use two font families only:

- Display: Sora.
- Body/UI: Source Sans 3.

V1 MUST NOT load IBM Plex Mono or any third font family. Diagnostic labels MUST use Source Sans 3 with uppercase styling and tabular numerals.

Weights and subsets:

- Sora 700, Latin subset.
- Sora 600, Latin subset.
- Source Sans 3 400, Latin subset.
- Source Sans 3 600, Latin subset.

Font payload budget:

- Total compressed WOFF2 font payload MUST be 110 KB or less.

Loading strategy:

- Fonts MUST be self-hosted as WOFF2.
- `font-display: swap` MUST be used.
- The above-the-fold headline font file and body regular font file MUST be preloaded.
- Fallback stacks MUST be:
  - Display: `Arial Rounded MT Bold`, `Trebuchet MS`, `Arial`, sans-serif.
  - Body: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif.
- CSS metric overrides using `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` MUST be defined after final font files are selected to minimize CLS.

## Hero Split-Screen Specification

The hero split-screen MUST use original OZMO-created abstract website mockups and wireframes. It MUST NOT use real client screenshots for V1, because no client permission workflow exists yet and no real portfolio proof is available.

Hero content:

- Before side MUST show an abstract slow/unclear website mockup with cluttered content, weak CTA, and muted structure.
- After side MUST show an abstract fast/clear lead-generation mockup with strong headline, clear CTA, trust block, and form path.
- Both sides MUST include visible `Before` and `After` labels.
- Mockups MUST NOT contain fake client names, fake metrics, fake testimonials, or recognizable third-party UI.

Interaction:

- The desktop hero MAY use a passive CSS reveal on first load.
- The hero MUST NOT require drag, hover, or pointer interaction to understand the message.
- The H1 text MUST remain the LCP target unless performance testing proves another element is LCP and still meets the LCP budget.
- The reveal MUST NOT delay text rendering.

Mobile behavior:

- Below 400px viewport width, the hero MUST stack the After state above the Before state after the H1 and CTA group.
- The mobile layout MUST avoid horizontal sliders.

Reduced motion:

- With `prefers-reduced-motion: reduce`, the hero MUST render a static split or stacked comparison with no wipe, no transform animation, and no delayed reveal.

## Services

The Services page MUST present:

- Website design and builds.
- Website redesigns and performance improvements.
- Messaging and conversion strategy.
- Local SEO and basic SEO setup.
- Lead capture forms and follow-up automation.
- Ongoing website care and optimization.

Each service MUST connect to business outcomes: credibility, speed, clarity, lead capture, easier follow-up, and ongoing improvement.

## Portfolio And Transformation Examples

V1 placeholder transformations MUST live in WordPress, not Astro. WordPress MUST own portfolio/transformation content from launch so Phase 2 does not duplicate Phase 3.

The `/portfolio` page MUST render WordPress transformation entries. Local seed data MAY exist only for development and test fallback.

Testimonials are deferred entirely for V1. WordPress MUST NOT include a testimonial content type in V1. The public site MUST NOT render testimonial sections until real testimonials exist and a later spec adds that content model.

Transformation entries MUST be honest examples, not fake case studies. Each entry MUST include:

- Before state.
- What is not working.
- OZMO improvement path.
- Expected business impact.
- CTA to request a site review.

Expected business impact MUST use qualitative, hypothetical language. It MUST NOT include percentages, dollar figures, invented rankings, invented speed scores, invented lead counts, or benchmark claims.

Example entry 1:

- **Title**: Service business homepage with no clear next step.
- **Before state**: The homepage explains the company history before it explains what the visitor can do next.
- **What is not working**: The CTA is buried, the offer is unclear, and mobile visitors have to search for the contact path.
- **OZMO improvement path**: Rework the hero message, move the primary CTA above the fold, simplify service blocks, and add a short quote/contact path.
- **Expected business impact**: Visitors can understand the offer faster and reach the inquiry path with less friction.
- **CTA**: Get a Free Site Review.

Example entry 2:

- **Title**: New business launch with no website.
- **Before state**: The business relies on social profiles and word of mouth, with no owned website to explain the offer.
- **What is not working**: Prospects cannot find a clear service overview, trust markers, or a reliable inquiry path.
- **OZMO improvement path**: Create a lean launch site with clear positioning, core service copy, local search basics, and a simple lead form.
- **Expected business impact**: The business has a credible owned destination to send referrals, search visitors, and social traffic.
- **CTA**: Start a Website Launch Readiness Review.

## Blog

The blog MUST support trust, SEO, and lead generation.

Production launch MUST include at least 3 published blog posts. Prelaunch deployments MAY show an empty blog state with `noindex`.

Minimum launch topics:

- Why website speed affects leads.
- How to tell whether homepage messaging is unclear.
- What a small business website needs before running ads.

Blog CTAs MUST connect naturally to the site review offer.

## Contact Page

The Contact page MUST support general inquiries. It MUST include:

- Name.
- Email.
- Business name.
- Message.
- Interest selector.

The page MUST include secondary links to `Get a Free Site Review` and `Schedule a Discovery Call`.

## Site Review Flow

The top-level route `/free-site-audit` MUST support two branches.

Initial branching question:

- Do you currently have a website?
  - Yes, I have a website.
  - No, I need a new website.

Branch behavior:

- Existing-site branch MUST use `/free-site-audit?type=existing`.
- No-website branch MUST use `/free-site-audit?type=new`.
- JavaScript-enabled branch changes MUST update visible copy, H1, browser history query string, and form fields without a full page reload.
- Non-JavaScript branch selection MUST submit to the same route and return the correct server-rendered branch.

Existing-site branch metadata:

- Browser title: `Free Site Audit for Small Business Websites | OZMO Digital`
- H1: `Get a Free Site Audit`
- Meta description: `Find out what is slowing down your website, weakening your message, or costing you leads.`
- OG image: default site review OG image with before/after website mockup.

No-website branch metadata:

- Browser title: `Website Launch Readiness Review | OZMO Digital`
- H1: `Start a Website Launch Readiness Review`
- Meta description: `Get clear next steps for launching a fast, credible, lead-ready website for your business.`
- OG image: launch readiness OG image with first-site planning mockup.

Shared form fields:

- Name.
- Email.
- Business name.
- Help areas.
- Biggest website/business challenge.
- Preferred next step.

Existing-site fields:

- Website URL, required.

No-website fields:

- Business type or industry.
- Primary service or offer.
- Target customer.
- Current online presence.
- Website goal.

Preferred next step options:

- Send me the Site Review Summary.
- Tell me when my review is ready to schedule.
- Not sure yet.

Audit walkthrough timing:

- New submissions MUST NOT immediately expose Site Review Walkthrough slots.
- OZMO MUST prepare the review first.
- Admin MUST mark the request `ready_to_schedule`.
- The system MUST then send a private scheduling link for the Site Review Walkthrough.

Manual deliverable:

- OZMO MUST deliver a written Site Review Summary.
- The summary MUST include 3-5 prioritized findings or launch-readiness recommendations.
- The summary MUST include a plain-language next-step recommendation.
- V1 MUST NOT require PDF generation or recorded walkthroughs.
- Turnaround SLA MUST be 3 business days.
- Default capacity MUST be 5 free reviews per week.

Confirmation copy MUST state:

> Your request is in. OZMO will review your details and send a written Site Review Summary within 3 business days. If a walkthrough is the right next step, you will receive a private scheduling link after the review is prepared.

## Branching Form Accessibility

The site review form MUST use a two-step wizard:

1. Step 1 asks the branch question using radio-card controls.
2. Step 2 shows fields for the selected branch.

Accessibility requirements:

- Radio controls MUST be native inputs or fully equivalent accessible controls.
- On branch change, focus MUST move to the Step 2 heading.
- Revealed branch fields MUST be announced through an `aria-live="polite"` region.
- Removed branch fields MUST NOT remain focusable.
- Server-side validation MUST mirror client-side validation.
- Validation errors MUST be linked to fields with `aria-describedby`.
- Error summaries MUST receive focus after failed submission.
- Error text MUST be announced to screen readers.
- Users MUST be able to go back to Step 1 without losing entered compatible shared fields.

## Scheduling And Booking

### Call Types

| Call type | Identifier | Booking access | Duration |
| --- | --- | --- | --- |
| Discovery Call | `discovery_call` | Public `/schedule?type=discovery` | 30 minutes |
| Site Review Walkthrough | `site_review_walkthrough` | Private `/schedule/review/[token]` | 30 minutes |

Site Review Walkthrough slots MUST be unavailable until an admin marks a review request `ready_to_schedule`.

### Private Scheduling Tokens

Private review scheduling links MUST use `/schedule/review/[token]`.

Token rules:

- Tokens MUST be generated with at least 128 bits of cryptographic randomness.
- Raw tokens MUST NOT be stored in the database.
- Token hashes MUST be stored using SHA-256 or stronger.
- Tokens MUST expire 14 days after creation.
- Tokens MUST be single-use after a booking is confirmed.
- Admin MUST be able to revoke a token.
- Tokens MUST be tied to one review request and one recipient email.

Token states:

- Invalid token page copy: `This scheduling link is not valid. Contact OZMO if you need a new link.`
- Expired token page copy: `This scheduling link has expired. Request a new walkthrough link and we will help you find a time.`
- Already-used token page copy: `This walkthrough has already been scheduled. Use your booking management link to cancel or reschedule.`
- Revoked token page copy: `This scheduling link is no longer active. Contact OZMO for help.`

### Timezone Handling

OZMO business timezone MUST default to `America/Chicago`.

Scheduling behavior MUST be:

1. Visitor chooses a call type.
2. Site detects visitor timezone with `Intl.DateTimeFormat().resolvedOptions().timeZone` when JavaScript is available.
3. UI allows manual timezone override.
4. Server validates the timezone as an IANA timezone name.
5. Server generates possible slots from OZMO availability rules in the OZMO business timezone.
6. Server checks Google Calendar free/busy using absolute UTC timestamps.
7. Server converts available slots into the visitor timezone for display.
8. Visitor chooses a slot.
9. System creates a booking hold.
10. Server revalidates calendar availability and local holds before final booking.
11. Server creates the Google Calendar event.
12. Server stores UTC start/end, OZMO timezone, and visitor timezone.
13. Confirmation screens and emails display both visitor local time and OZMO business time.

Timezone conversion MUST use timezone-aware date utilities. Manual offset math MUST NOT be used.

### Availability Rules

Availability rules MUST support:

- Allowed weekdays in OZMO business timezone.
- Allowed hours in OZMO business timezone.
- Blocked dates in OZMO business timezone.
- Minimum notice of 24 hours.
- 15-minute buffer before and after meetings.
- Maximum of 4 scheduled calls per day.
- Date window of 14 days by default.

Empty availability state copy MUST be:

> No available times are showing for this date range. Try the next two weeks or request a time and OZMO will follow up.

The empty state MUST offer:

- Extend date range by 14 days.
- Request a time.

`Request a time` MUST create a `scheduling_request` record in Postgres and notify OZMO.

### Booking Holds

Booking holds are IN for V1.

A hold MUST be created when the visitor selects a slot and enters the booking details step.

Hold rules:

- Hold TTL MUST be 10 minutes.
- Holds MUST be stored in Postgres with UTC start/end, call type, email, and `expires_at`.
- Expired holds MUST be ignored during availability checks.
- A successful booking MUST convert the hold into a booking.
- Leaving the page MAY rely on TTL expiry; explicit release MAY be attempted with `navigator.sendBeacon`.
- Final booking revalidation MUST reject slots blocked by active holds except the visitor's own hold.

### Google Calendar Auth Model

V1 MUST use Google OAuth user consent for one OZMO scheduling owner account.

Calendar rules:

- Free/busy MUST query the configured primary booking calendar and any configured busy calendars.
- Events MUST be written to the primary booking calendar.
- Visitor email MUST be added as an attendee.
- OAuth refresh tokens MUST be encrypted before storage.
- Token rotation MUST occur by reconnecting the Google account from the admin setup screen.
- Token expiry or revocation MUST surface in admin as `calendar_connection_required`.
- Public scheduling MUST fail closed when the calendar connection is invalid.

### Calendar API Failure Behavior

Calendar availability MUST fail closed. The site MUST NOT show unverified available slots.

Rationale:

- Fail-open risks double-booking.
- Fail-closed MAY temporarily show zero availability, but it preserves calendar integrity.

Failure policy:

- Free/busy timeout: 5 seconds.
- Retry policy: 2 retries with exponential backoff.
- Quota exhaustion: no slots shown; admin alert sent.
- Google API 5xx: no slots shown after retries.
- Google API 401/403: no slots shown; admin alert sent to reconnect calendar.

Visitor copy:

> Scheduling is temporarily unavailable. You can request a time and OZMO will follow up.

### Booking Source Of Truth

Google Calendar MUST be authoritative for actual event time and availability. Postgres MUST be authoritative for lead metadata, admin status, tokens, notes, and audit trail.

When OZMO moves an event in Google Calendar:

- Google Calendar invite updates MUST notify the attendee.
- V1 admin MAY show stale Postgres time until the booking is manually refreshed.
- Admin MUST include a `Refresh from Google Calendar` action for a booking detail record.

When OZMO deletes or declines an event in Google Calendar:

- The next admin refresh MUST mark the booking `calendar_missing`.
- V1 MUST NOT include background sync-back.

### Cancel, Reschedule, And No-Show

V1 MUST include visitor-initiated cancellation and rescheduling through `/schedule/manage/[token]`.

Booking management token rules:

- Token MUST use at least 128 bits of cryptographic randomness.
- Raw token MUST NOT be stored.
- Token hash MUST be stored.
- Token MUST remain valid until 7 days after the scheduled event end.

Policy:

- Visitor cancellation MUST be allowed until 24 hours before the call.
- Visitor rescheduling MUST be implemented as cancel current booking then select a new available slot.
- Changes inside 24 hours MUST show copy directing the visitor to email OZMO.
- Cancellation MUST update Postgres and cancel the Google Calendar event.
- Rescheduling MUST create a new Google Calendar event and mark the old booking `rescheduled`.
- No-shows MUST be marked manually by admin in V1.

Confirmation emails MUST include the booking management link.

### Calendar Invites And ICS

V1 MUST create a Google Calendar event with the visitor as an attendee. Google Calendar invite email MUST be sent by Google.

V1 MUST NOT attach a separate `.ics` file from Resend to avoid duplicate calendar entries.

The event MUST include timezone metadata. The confirmation email MUST display visitor local time and OZMO business time.

## Content Management

WordPress MUST be the headless CMS for public content in V1.

WordPress MUST manage:

- Blog posts.
- Services.
- Portfolio/transformation examples.
- Future landing pages.

WordPress MUST NOT manage:

- Private leads.
- Audit requests.
- Booking records.
- Admin notes.
- Testimonials in V1.

Content models:

- `post`
- `page`
- `service`
- `transformation`
- `landing_page`

Custom post types MUST expose REST API data. ACF field groups required by Astro MUST expose fields in REST.

### WordPress Build And Runtime Strategy

V1 MUST prerender public marketing pages and blog routes by default.

Rebuild webhooks MUST fire only for published-content changes in relevant content types. Draft edits, autosaves, revisions, private updates, and trash transitions MUST NOT trigger public rebuilds.

If blog content volume or edit frequency creates rebuild fatigue, blog index and blog detail routes SHOULD move to cached on-demand rendering while core marketing pages remain prerendered.

The rendering strategy MUST be revisited when either threshold is reached:

- Average production build duration exceeds 5 minutes.
- WordPress publishes trigger more than 10 deploys per day for 3 consecutive business days.

### WordPress Failure Behavior

Builds MUST use last-known-good content snapshots for WordPress public content.

Behavior:

- If WordPress is unreachable and a last-known-good snapshot exists, production build MUST use that snapshot and send an alert.
- If WordPress is unreachable and no snapshot exists for required launch content, the build MUST fail.
- If `/services` content is empty at build time, the build MUST fail.
- If `/portfolio` transformations are empty at build time, the build MUST fail.
- If `/blog` has fewer than 3 posts for production launch, `/blog` MUST render an empty/prelaunch state with `noindex`; after launch approval, fewer than 3 posts MUST fail the build.

### Rebuild Webhook Mechanics

WordPress MUST trigger rebuilds on published changes for:

- `post`
- `page`
- `service`
- `transformation`
- `landing_page`

Webhook authentication:

- Webhook requests MUST include an HMAC-SHA256 signature.
- The signature MUST be computed with a shared secret stored outside the repository.
- Requests with invalid signatures MUST return 401.

Webhook processing:

- Rapid successive publish events MUST be debounced for 120 seconds.
- Build failures MUST alert OZMO and the implementation owner by email.
- Build duration above 5 minutes MUST trigger architecture review.

## Technical Architecture

Stack:

- Frontend MUST use Astro and TypeScript.
- Public pages MUST be static-first.
- Form actions, scheduling endpoints, admin routes, and token routes MUST use on-demand server rendering.
- Hosting MUST use Vercel for Astro.
- Database MUST use Neon Postgres.
- Email MUST use Resend.
- Analytics MUST use Plausible.
- Auth MUST use Google OAuth with database-backed sessions.

Astro MUST use the Vercel adapter for server actions and on-demand routes.

## Headless WordPress Justification And Reversibility

WordPress adds recurring cost, security maintenance, and build-time coupling. It is still the V1 CMS choice because OZMO intends to manage blog posts, services, transformations, and future landing pages through an editor-friendly interface with structured ACF fields.

WordPress is the right call when:

- OZMO wants non-developer content editing.
- Services, transformations, and landing pages need structured fields.
- Future client/editor workflows matter more than minimal launch infrastructure.
- Managed WordPress hosting is acceptable as an operational dependency.

Astro content collections or MDX would be the right call if:

- Only a few developer-authored posts are needed.
- No non-technical editor needs CMS access.
- Lower monthly cost and fewer moving parts matter more than editor UX.

Migration path from WordPress to Astro content collections:

- Export WordPress REST content to JSON.
- Convert posts to MDX.
- Convert services and transformations to Astro content collections.
- Replace WordPress fetch adapters with content collection queries.
- Preserve slugs and redirects.

Migration path from Astro content collections to WordPress:

- Create WordPress CPTs and ACF fields.
- Import collection content through WP-CLI or REST API scripts.
- Preserve slugs and redirects.
- Replace local collection queries with WordPress fetch adapters.

## Lead Management Access

Private lead data MUST live in Postgres. WordPress MUST remain the public content CMS only.

V1 MUST include a protected Astro admin area.

Admin routes:

- `/admin`
- `/admin/leads`
- `/admin/leads/[id]`
- `/admin/audits`
- `/admin/bookings`

Admin capabilities:

- View contact submissions.
- View existing-site audits.
- View new-site readiness reviews.
- View scheduled calls.
- Open detail records.
- Update canonical status.
- Add internal notes.
- Export leads as CSV.
- Refresh booking status from Google Calendar.
- Mark no-show.
- Revoke scheduling tokens.

CSV export is IN for V1. Only admin users on the allowlist MAY export CSV.

Transactional emails are notifications only. They MUST NOT be the system of record.

## Canonical Status Model

All lead-like records MUST use this canonical status enum unless a booking-specific status is required.

| Status | Applies to | Meaning |
| --- | --- | --- |
| `new` | all records | Submitted and unread |
| `needs_review` | audits/readiness reviews | Requires OZMO manual review |
| `reviewed` | audits/readiness reviews | Review prepared internally |
| `ready_to_schedule` | audits/readiness reviews | Private walkthrough link can be sent |
| `scheduled` | audits/readiness reviews/calls | Related call is booked |
| `contacted` | all records | OZMO has replied |
| `qualified` | all records | Lead is a fit for sales follow-up |
| `won` | all records | Converted to client/project |
| `closed_lost` | all records | Closed without conversion |
| `spam_rejected` | all records | Spam, abuse, or invalid submission |

Booking records MUST use this booking enum:

- `held`
- `booked`
- `cancelled`
- `rescheduled`
- `completed`
- `no_show`
- `calendar_missing`

Allowed lead status transitions:

- `new` -> `needs_review`, `contacted`, `qualified`, `spam_rejected`, `closed_lost`
- `needs_review` -> `reviewed`, `spam_rejected`, `closed_lost`
- `reviewed` -> `ready_to_schedule`, `contacted`, `qualified`, `closed_lost`
- `ready_to_schedule` -> `scheduled`, `contacted`, `closed_lost`
- `scheduled` -> `contacted`, `qualified`, `won`, `closed_lost`
- `contacted` -> `qualified`, `won`, `closed_lost`, `spam_rejected`
- `qualified` -> `won`, `closed_lost`

Every status change MUST be audit-logged with actor, timestamp, previous status, new status, and MAY include a note.

## Admin Authentication

V1 MUST use Auth.js with Google OAuth.

Session model:

- Sessions MUST be database-backed in Postgres.
- Session cookie MUST be `HttpOnly`, `Secure`, and `SameSite=Lax`.
- Session lifetime MUST be 8 hours idle and 7 days absolute.
- Logout MUST revoke the local session.
- Admin routes MUST require CSRF protection for every mutating action.
- Admin allowlist MUST be configured through `ADMIN_EMAIL_ALLOWLIST` as a comma-separated environment variable.
- Updating the allowlist in V1 MUST require an environment variable change and redeploy.

## Data Handling And Privacy

The system stores PII, including names, emails, business details, URLs, submitted messages, scheduling data, and admin notes.

Security requirements:

- All production traffic MUST use HTTPS.
- Database connections MUST use TLS.
- Neon encryption at rest MUST be enabled.
- OAuth refresh tokens and sensitive external API tokens MUST be encrypted at application level before storage.
- Scheduling tokens MUST be stored only as hashes.
- Backups MUST be enabled daily with 30-day retention.

Retention:

- Spam/rejected submissions MUST be deleted or anonymized after 90 days.
- Closed lost leads MUST be deleted or anonymized after 24 months.
- Won client records MAY be retained while an active client relationship exists.
- Booking records MUST be retained for 24 months.
- Audit logs MUST be retained for 36 months.

Deletion requests:

- Privacy policy MUST explain how to request deletion.
- OZMO MUST honor verified deletion requests within 30 days unless retention is legally required.
- Deletion MUST remove or anonymize matching records in Postgres and suppress future marketing contact.

CSV export:

- CSV export MUST be limited to admin allowlist users.
- CSV export MUST be audit-logged with actor, timestamp, record count, and export type.

## Forms, Spam, And Rate Limiting

All forms MUST use server-side validation, visible labels, honeypot fields, and clear error states.

Rate limiting storage MUST use Vercel KV or Upstash Redis. In-memory rate limiting MUST NOT be used in production.

Limits:

| Endpoint | Limit key | Limit |
| --- | --- | --- |
| Contact submit | IP + normalized email hash | 5 per IP per hour and 3 per email per day |
| Site review submit | IP + normalized email hash | 5 per IP per hour and 3 per email per day |
| Availability lookup | IP | 60 per hour |
| Booking hold | IP + normalized email hash | 20 per IP per hour and 5 per email per day |
| Booking confirm | IP + normalized email hash | 10 per IP per hour and 3 per email per day |
| Request a time | IP + normalized email hash | 5 per IP per hour and 3 per email per day |
| Rebuild webhook | signature + source IP | 30 per minute |

Rate-limit response MUST use HTTP 429.

Visitor copy:

> Too many attempts were received. Wait a little while and try again.

## Email

V1 MUST use Resend.

Email requirements:

- Sending domain MUST default to `mail.ozmodigital.com`.
- SPF, DKIM, and DMARC MUST be configured before production launch.
- DMARC policy MUST start as `p=none` for monitoring and MAY move to stricter policy after deliverability is verified.
- Reply-to MUST default to `hello@ozmodigital.com`.
- Email templates MUST live in `src/emails`.
- Every email MUST include HTML and plain-text alternatives.
- Bounce and complaint webhooks MUST be configured in Resend.
- Hard bounces and complaints MUST suppress future non-transactional email to that address.

V1 email types:

- Contact confirmation.
- Contact internal notification.
- Site review confirmation.
- Site review ready-to-schedule email.
- Booking confirmation.
- Booking cancellation.
- Booking reschedule confirmation.
- Admin alert for calendar/API failures.
- Admin alert for build failures.

## SEO And Structured Data

SEO requirements:

- Public pages MUST be crawlable Astro-rendered HTML.
- Each indexable page MUST have title, meta description, canonical URL, and Open Graph metadata.
- Sitemap MUST include only indexable public pages.
- RSS feed is IN for V1 and MUST be available at `/rss.xml` once 3 posts are published.
- Robots configuration MUST exclude admin and tokenized routes.

Structured data:

- The site MUST emit `Organization` for OZMO.
- The site MUST emit `Service` for services.
- The site MUST emit `BlogPosting` for blog posts.
- The site MUST emit `BreadcrumbList` for eligible public pages.
- The site MUST NOT emit `ProfessionalService` in V1.
- The site MUST NOT emit `LocalBusiness` in V1.

Rationale: `ProfessionalService` inherits LocalBusiness semantics. V1 geography-agnostic positioning is better represented by `Organization` plus individual `Service` schema.

## Legal And Policy Pages

V1 MUST include:

- `/privacy`
- `/terms`
- `/cookie-notice`

Footer MUST link all three pages.

Privacy posture:

- V1 MUST use Plausible Analytics without cookies.
- V1 MUST NOT use ad pixels, cross-site tracking, or behavior remarketing.
- V1 MAY omit a cookie consent banner when only cookie-free Plausible is active.
- If non-essential cookies, ad pixels, or session replay tools are added later, a consent banner MUST be added before those tools load.

GDPR/CCPA posture:

- The privacy policy MUST describe collected data, purpose, retention, deletion requests, analytics, and processors.
- The site MUST accept privacy/deletion requests from any visitor because the audience is geography-agnostic.

## Analytics And Measurement

V1 MUST use Plausible Analytics.

Tracked conversion events:

- `cta_free_site_review_click`
- `audit_branch_existing_selected`
- `audit_branch_new_selected`
- `site_review_submit_existing`
- `site_review_submit_new`
- `discovery_call_started`
- `discovery_call_booked`
- `review_walkthrough_booked`
- `contact_submit`
- `request_time_submit`
- `blog_cta_click`
- `portfolio_cta_click`

Lead goal mapping:

- Primary lead goal: `site_review_submit_existing` + `site_review_submit_new`.
- Secondary lead goal: `discovery_call_booked` + `review_walkthrough_booked`.
- Support lead goal: `contact_submit` + `request_time_submit`.

## Business Success Metrics

30-day targets:

- Site launched with all legal, form, admin, and scheduling flows operating.
- At least 3 site review/readiness requests.
- At least 1 discovery call booked.
- Site review form completion rate of 20% or higher from form starts.

90-day targets:

- At least 8 site review/readiness requests per month.
- At least 4 booked calls per month.
- Site review form completion rate of 25% or higher.
- At least 3 qualified opportunities in the admin console.

180-day targets:

- At least 15 site review/readiness requests per month.
- At least 8 booked calls per month.
- At least 2 closed-won projects attributed to the site.
- Evidence from analytics and admin notes identifying the highest-converting CTA path.

## Performance And Accessibility

Performance targets MUST be measured on mobile Lighthouse CI with simulated throttling equivalent to Lighthouse mobile defaults unless implementation tooling documents a stricter profile.

Field and lab metric targets:

- LCP MUST be 2.5 seconds or less at p75.
- CLS MUST be 0.1 or less.
- INP MUST be 200 ms or less at p75 once field data exists.
- Marketing-page JavaScript MUST be 80 KB gzip or less per route, excluding admin and scheduler interactive chunks.
- Initial page weight for core marketing pages MUST be 1 MB or less.
- Admin and scheduler routes MAY exceed marketing JavaScript budgets, but unused admin code MUST NOT load on public marketing pages.

CI enforcement:

- Lighthouse CI budgets MUST run against `/`, `/services`, `/free-site-audit`, and `/schedule`.
- CI MUST fail when JavaScript or total page weight budgets are exceeded.
- Lighthouse score target MUST remain 90+ for Performance, Accessibility, Best Practices, and SEO.

Accessibility:

- Semantic HTML MUST be used.
- Keyboard access MUST work for nav, forms, admin controls, and scheduler controls.
- Focus states MUST be visible.
- Form labels MUST remain visible.
- Errors MUST be associated with fields.
- Reduced-motion support MUST be implemented for all non-essential motion.
- Text and controls MUST NOT overlap at supported viewport widths.

## Browser, Device, And JavaScript Support

Supported browsers:

- Latest 2 major versions of Chrome, Edge, Firefox, and Safari.
- iOS Safari 16+.
- Android Chrome 110+.

Minimum viewport:

- Layout MUST support 320 CSS px width.

JavaScript unavailable:

- Public marketing content and navigation MUST remain readable and usable.
- Site review branch selection MUST work through server-rendered form submission.
- Timezone auto-detection will not run; scheduler MUST default to America/Chicago and offer a manual timezone select when possible.
- Interactive slot booking MAY require JavaScript; when JavaScript is unavailable, `/schedule` MUST show the Request a Time fallback form.

## Launch Content Inventory

Production launch MUST include:

- Final homepage copy.
- Final services page copy for 6 services.
- Final contact page copy.
- Final site review page copy for both branches.
- Final schedule page copy.
- Final privacy, terms, and cookie notice pages.
- 3 published blog posts.
- 3 published transformation examples.
- Default 1200x630 OG image.
- Page-specific OG images for home, site review, services, portfolio, and blog.
- Complete icon and favicon set.

Authorship:

- OZMO Digital owns final business claims, legal policy approval, and service descriptions.
- Implementation owner drafts page copy, form copy, and system emails for OZMO approval.
- Blog posts and transformation examples MAY be drafted by implementation owner, but OZMO MUST approve them before production launch.

The site MUST NOT launch production with an empty blog. Prelaunch deployments MAY hide the blog from nav and render `/blog` as noindex.

## Brand Asset Requirements

The current PNG logo MAY be used as source reference only.

V1 launch MUST include:

- SVG logo.
- PNG fallback logo.
- Light logo variant.
- Dark logo variant.
- Horizontal lockup.
- Stacked or compact lockup.
- Favicon 16x16.
- Favicon 32x32.
- Favicon 48x48.
- Apple touch icon 180x180.
- Android/web app icon 192x192.
- Android/web app icon 512x512.
- Maskable app icon 512x512.
- Default OG image 1200x630.
- Per-page OG image template 1200x630.
- Twitter/X summary large image metadata using 1200x630 assets.

## Implementation Phases And Exit Criteria

### Phase 1: Foundation, Design System, And Compliance

Build:

- Astro + TypeScript project.
- Vercel adapter.
- Base layouts.
- Navigation and footer.
- Requirement-level design tokens.
- Accessible color pairings.
- Font loading.
- SEO metadata utilities.
- Legal route shells.
- Test tooling.

Tests and exit criteria:

- Unit tests for metadata helpers.
- Static checks for route inventory.
- Visual smoke check for 320px, 768px, 1024px, and 1440px.
- Color contrast checks pass for approved pairings.
- Font payload budget verified.

### Phase 2: WordPress Content Model And Public Content Pages

Build:

- WordPress CPTs for services, transformations, and landing pages.
- ACF fields.
- WordPress fetch adapter.
- Last-known-good snapshot system.
- Homepage.
- Services page.
- Portfolio/transformation page.
- Blog index/detail.
- RSS feed.

Tests and exit criteria:

- WordPress mapping tests.
- Empty/failure content behavior tests.
- RSS generation test.
- Public page browser smoke tests.
- Build fails for missing required services or transformations.

### Phase 3: Forms, Lead Storage, And Site Review Branching

Build:

- Contact form.
- Site review branch wizard.
- Server-side validation.
- Postgres lead/review tables.
- Rate limiting.
- Confirmation pages.
- Resend email templates for contact and site review.

Tests and exit criteria:

- Contact validation tests.
- Existing-site audit validation tests.
- No-website readiness validation tests.
- Accessibility tests for branch focus and error announcements.
- Rate-limit tests.
- Email template rendering tests.

### Phase 4: Admin Console

Build:

- Auth.js Google OAuth.
- Admin allowlist.
- Admin lead list/detail.
- Status transitions.
- Internal notes.
- CSV export.
- Audit logging.

Tests and exit criteria:

- Admin allowlist tests.
- Unauthenticated redirect tests.
- Unauthorized 404 tests.
- CSRF tests for mutations.
- Status transition tests.
- CSV export audit-log tests.

### Phase 5: Scheduling And Calendar Integration

Build:

- Discovery Call scheduler.
- Private Site Review Walkthrough scheduler.
- Token generation and hashing.
- Booking holds.
- Google OAuth calendar connection.
- Free/busy checks.
- Booking confirmation.
- Cancel/reschedule management.
- Request a Time fallback.

Tests and exit criteria:

- Availability rule tests.
- Timezone and DST tests.
- Hold TTL tests.
- Booking conflict tests.
- Calendar failure fail-closed tests.
- Token invalid/expired/used/revoked tests.
- Cancel/reschedule tests.

### Phase 6: Verification, Performance, And Launch Readiness

Phase 6 MUST verify work created in earlier phases; it MUST NOT be the first phase where accessibility, SEO, or performance decisions are made.

Tests and exit criteria:

- Lighthouse CI passes budgets.
- Browser support matrix smoke tests pass.
- Sitemap and robots checks pass.
- Legal pages approved.
- Analytics events verified.
- Resend domain verified.
- Calendar connection verified.
- WordPress rebuild webhook verified.
- End-to-end flows pass for contact, existing-site review, no-website review, discovery booking, private walkthrough booking, cancellation, and admin follow-up.

### Phase 7: Launch Operations

Build:

- Production environment variables.
- Domain and DNS.
- Monitoring and alerts.
- Backup checks.
- Final content approval.
- Production deployment.

Exit criteria:

- Production smoke test passes.
- Admin can log in.
- Test lead can be submitted, viewed, exported, and deleted.
- Test booking can be created, rescheduled, and cancelled.
- Analytics events arrive in Plausible.

## Out Of Scope For V1

- Industry-specific landing pages.
- Real case studies unless available and approved before launch.
- Testimonials and testimonial CMS model.
- Full CRM integration beyond the protected Astro admin lead console.
- Automated nurture sequences.
- Client portal functionality.
- Paid ads landing page variants.
- Separate `.ics` attachments from Resend.
- Background Google Calendar sync-back.
- Session replay, ad pixels, and remarketing tags.

## Assumptions And Risks

| Risk | Owner | Mitigation |
| --- | --- | --- |
| Manual site review capacity limits lead follow-up speed. | OZMO Digital | Default capacity is 5 reviews/week; admin status and SLA copy set expectations. |
| Launch content may not be ready. | OZMO Digital | Minimum inventory is explicit; production launch requires 3 blog posts and 3 transformations. |
| Scheduling timezone handling can create wrong-time bookings. | Implementation owner | Store UTC plus both timezones; test DST and timezone conversion cases. |
| WordPress availability can affect builds. | Implementation owner | Use last-known-good snapshots; fail build only when no valid snapshot exists for required content. |
| No real proof exists at launch. | OZMO Digital | Use honest transformation examples with no fake clients, testimonials, or metrics. |
| Legal copy may lag technical implementation. | OZMO Digital | Legal pages are V1 routes and launch exit criteria. |
| Auth and PII handling increase scope. | Implementation owner | Use Google OAuth, admin allowlist, encrypted tokens, retention rules, and audit logs. |

## Technical Reference Notes

- Astro supports WordPress as a headless CMS through the WordPress REST API.
- Astro Actions support backend logic for forms and server calls.
- Astro pages are prerendered by default, and selected routes can use on-demand rendering when request-time behavior is required.
- WordPress REST API exposes public content as JSON and can expose custom post types.
- Custom post types MUST be configured for REST access.
- ACF field groups MUST opt into REST visibility when their structured fields are needed by Astro.
- Google Calendar free/busy queries return busy intervals for calendars.
- Google Calendar events can be inserted after server-side booking validation.

Reference URLs:

- https://docs.astro.build/en/guides/cms/wordpress/
- https://docs.astro.build/en/guides/actions/
- https://docs.astro.build/en/guides/on-demand-rendering/
- https://developer.wordpress.org/rest-api/
- https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/
- https://www.advancedcustomfields.com/resources/wp-rest-api-integration/
- https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query
- https://developers.google.com/workspace/calendar/api/v3/reference/
- https://docs.astro.build/en/guides/integrations-guide/vercel/
- https://vercel.com/marketplace/neon
- https://resend.com/docs/send-with-nodejs
