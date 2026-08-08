# OZMO Digital Fresh Start Website Design Spec

Date: 2026-08-08

## Goal

Create a fresh-start plan for the OZMO Digital marketing website. The site should be fast, visually distinctive, lead-generation focused, and useful for broad small to medium sized businesses that need a better website outcome.

The site should showcase what OZMO Digital can do for businesses that need a new site, businesses with no site, and businesses with an existing site that is slow, dated, unclear, or not converting.

This spec intentionally ignores previous design choices and prior work found in the repository. The only current project asset assumed in this plan is the OZMO Digital logo at `docs/ref/uploads/ozmo-logo-bo.png`, unless it is replaced later.

## Audience

The launch audience is broad SMBs. The main site should not target a single industry yet.

Primary visitor situations:

- They have an outdated or underperforming site.
- Their site is slow, unclear, hard to trust, or not bringing in leads.
- They need a new website for a new business.
- They do not have a website yet.
- They want plain-language guidance instead of technical jargon.

Future industry-specific landing pages can target segments such as local service businesses, professional services, trades, wellness, local retail, restaurants, startups, and other focused SMB categories.

## Positioning

OZMO Digital should be positioned as a performance-led, design-forward agency that speaks in clear SMB-friendly language.

Core positioning:

> OZMO Digital turns slow, outdated, unclear, or missing websites into fast, polished lead-generation sites.

The site should emphasize high-performing websites first, while also making redesign, rescue, and improvement work feel central to the offer.

## StoryBrand Messaging

The site should use StoryBrand principles without following a cookie-cutter StoryBrand page pattern.

- **Hero**: The visitor wants a site that looks credible, loads quickly, and brings in better leads.
- **Problem**: Their current site is slow, dated, unclear, hard to update, not converting, or missing entirely.
- **Guide**: OZMO understands that most SMB owners do not need more jargon. They need a clear site, a strong message, and a practical path to leads.
- **Plan**: Audit, Improve or Build, Launch, Optimize.
- **Primary CTA**: Free Site Audit.
- **Secondary CTA**: Schedule a Call.
- **Success**: A faster, clearer website that makes the business look credible and gives visitors an obvious next step.
- **Failure avoided**: More lost leads, more confusion, more wasted traffic, and a website that keeps working against the business.

Tone:

- Plainspoken, confident, and practical.
- Design-aware, but not precious.
- Performance-focused, but not overly technical.
- Avoid vague agency phrases unless tied directly to business outcomes.

## Creative Direction

The selected site direction is **Transformation Engine**.

The signature mechanic is a split-screen before/after transformation:

- **Before**: slow, outdated, unclear, low-conversion, visually stuck.
- **After**: fast, polished, structured, clear, lead-ready.

This split-screen idea should appear in the hero and recur throughout the site in service previews, portfolio placeholders, audit messaging, and case-study structures. It should make the site feel specific to OZMO rather than like a generic agency template.

The effect should be disciplined and useful. It should not become a gimmick or a heavy animation pattern.

## Visual System

Visual personality:

- Fast, crisp, modern, and confident.
- More performance workshop than boutique agency mood board.
- Strong typographic hierarchy.
- Clean layouts with controlled asymmetry.
- Clear contrast between "before" and "after" states.

Brand color direction:

- Use the logo's blue and orange as active brand colors.
- Blue should signal trust, structure, and the improved state.
- Orange should signal action, transformation, and primary CTAs.
- Balance brand colors with off-white, deep ink, and cool neutral grays.
- Avoid a one-note blue/orange theme by using color intentionally and sparingly.

Typography direction:

- Use a strong modern display sans for headlines, with enough roundness to relate to the logo.
- Use a highly legible body sans for clear SMB-friendly copy.
- Optionally use a utility or mono face for audit labels, status checks, or diagnostic details.

Starter type system:

- Display: Sora, 600-800, for hero and major section headlines.
- Body: Source Sans 3, 400-600, for paragraphs, navigation, forms, and supporting copy.
- Utility: IBM Plex Mono, 400-500, used sparingly for audit labels, speed checks, and diagnostic details.
- Fonts should be self-hosted as WOFF2 where practical and loaded with layout-shift prevention in mind.

Starter color tokens:

- OZMO Blue: `#2B3F8F` for structure, trust, and "after" state emphasis.
- OZMO Orange: `#F45B00` for CTAs, transformation markers, and action states.
- Deep Ink: `#171923` for primary text.
- Clean Surface: `#FAFAF7` for the main background.
- Before Gray: `#D8DDE7` for the muted "before" state.
- Line Gray: `#B7C0D0` for borders, dividers, and diagnostic structure.
- Signal Teal: `#00A6A6` used sparingly for positive status and confirmation states.

These tokens should be refined during visual design, but the implementation should preserve the role of each color so the site does not drift into a generic agency palette.

Motion direction:

- Lightweight and performance-safe.
- Hero split-screen reveal or wipe.
- Subtle before-to-after hover states on transformation cards.
- No scroll-jacking.
- No animation that delays content.
- Respect `prefers-reduced-motion`.

Avoid:

- Generic agency hero layouts.
- Gradient blobs, bokeh, decorative orbs, and vague abstract SaaS backgrounds.
- Fake 3D dashboards.
- Stock office handshake imagery.
- Claims of client results that do not exist yet.
- Overly technical copy that speaks over SMB owners.

## Site Structure

Launch sitemap:

- `/` Home
- `/services` Services
- `/portfolio` Portfolio / Transformations
- `/blog` Blog index
- `/blog/[slug]` Blog detail
- `/contact` Contact
- `/free-site-audit` Free Site Audit
- `/schedule` Schedule a Call

Later sitemap additions:

- `/industries/[slug]` for vertical-specific landing pages.
- `/services/[slug]` if individual service pages become useful.
- `/portfolio/[slug]` once real client case studies exist.
- `/resources` if the blog expands into guides, checklists, or downloads.

## Homepage Flow

The homepage should use a StoryBrand-informed flow while avoiding a templated page pattern.

1. **Header**
   - OZMO logo.
   - Primary navigation.
   - Persistent Free Site Audit CTA.

2. **Hero**
   - Split-screen before/after transformation.
   - Plain-language headline around turning underperforming or missing sites into fast lead-generation sites.
   - Primary CTA: Free Site Audit.
   - Secondary CTA: Schedule a Call.

3. **Problem**
   - Name what underperforming websites cost SMBs: trust, speed, clarity, leads, and time.
   - Avoid fear-based copy.

4. **Guide**
   - Position OZMO as the practical partner who can connect design, performance, messaging, and lead flow.

5. **Plan**
   - Audit.
   - Improve or Build.
   - Launch.
   - Optimize.

6. **Services Preview**
   - Summarize the core services and link to `/services`.

7. **Transformation Proof**
   - Use honest placeholder transformation patterns until real portfolio work exists.
   - Do not invent client names, testimonials, or metrics.

8. **Audit CTA**
   - Make the Free Site Audit feel consultative and low-risk.

9. **Blog Preview**
   - Show practical articles once content exists.
   - Use audit CTA language as a natural next step.

10. **Footer**
   - Logo and short positioning line.
   - Contact details.
   - Key links.
   - CTA links.

## Services

The Services page should present launch-ready services in outcome-focused language.

Services:

- Website design and builds.
- Website redesigns and performance improvements.
- Messaging and conversion strategy.
- Local SEO and basic SEO setup.
- Lead capture forms and follow-up automation.
- Ongoing website care and optimization.

Service presentation should connect each service to business outcomes:

- Look credible.
- Load quickly.
- Explain the offer clearly.
- Capture leads.
- Make follow-up easier.
- Improve over time.

## Portfolio / Transformations

There is no real portfolio work available at launch, so the site must not pretend otherwise.

Launch approach:

- Use "example transformation paths" or "common site improvements" instead of fake case studies.
- Each entry should show a common SMB problem and how OZMO would improve it.
- Structure each entry like a future case study:
  - Before state.
  - What is not working.
  - OZMO improvement path.
  - Expected business impact.
  - CTA to request an audit.

Later approach:

- Replace placeholder transformation paths with real client work.
- Add individual portfolio detail pages when there is enough proof.
- Add real metrics only when measured and approved for publication.

## Blog

The blog should support trust, SEO, and lead generation.

Content should be practical and SMB-friendly, with topics such as:

- Why website speed affects leads.
- How to tell if your homepage message is unclear.
- What a small business website needs before running ads.
- Website redesign warning signs.
- Simple lead capture improvements.
- What happens during a Free Site Audit.

Blog CTAs should connect naturally to the audit:

> Want to know what this means for your site? Request a Free Site Audit.

## Contact Page

The Contact page should support general inquiries without competing with the Free Site Audit.

Fields:

- Name.
- Email.
- Business name.
- Message.
- Optional interest selector.

The page should also include links to Free Site Audit and Schedule a Call for visitors who know their next step.

## Free Site Audit Flow

The Free Site Audit is the primary conversion path.

The selected audit model is a hybrid:

1. Visitor submits site details.
2. OZMO prepares a focused review.
3. Visitor receives an audit summary or next-step communication.
4. Visitor can schedule a walkthrough call.

Audit form fields:

- Name.
- Email.
- Business name.
- Website URL, optional because some businesses may not have a site yet.
- What do you need help with?
  - Improve my current site.
  - Build a new site.
  - Make my site faster.
  - Get more leads.
  - Clarify my messaging.
  - Add forms or follow-up automation.
- Biggest website/business challenge.
- Preferred next step:
  - Send me the audit summary.
  - Schedule an audit walkthrough.
  - Not sure yet.

Audit handling:

- Validate server-side.
- Store the submission.
- Send an internal notification to OZMO.
- Send a confirmation email to the visitor.
- Show a confirmation state with an optional scheduling path.
- Track status such as new, reviewed, contacted, won, or closed.

## Schedule A Call Flow

The scheduler should support confirmed booking immediately. It should not use manual approval at launch.

Call types:

- Free Site Audit Walkthrough: 30 minutes.
- Discovery Call: 30 minutes.

Scheduling behavior:

1. Visitor chooses a call type.
2. Site requests available slots.
3. Server checks Google Calendar free/busy.
4. Server applies OZMO availability rules.
5. Visitor chooses a slot and enters contact details.
6. Server rechecks the slot before final booking.
7. Server creates the Google Calendar event.
8. Server stores the booking.
9. Confirmation emails go to the visitor and OZMO.

Availability rules should support:

- Allowed weekdays.
- Allowed hours.
- Blocked dates.
- Minimum notice.
- Buffer before and after meetings.
- Max bookings per day if desired.

The booking system must prevent duplicate bookings by rechecking calendar availability and local booking state before creating the event.

## Content Management

Use WordPress as the headless content backend from the start.

WordPress should manage:

- Blog posts.
- General pages as needed.
- Services.
- Portfolio / transformations.
- Testimonials.
- Future landing pages.

Recommended WordPress implementation:

- Use custom post types for structured content.
- Use Advanced Custom Fields for structured fields.
- Expose public content through the WordPress REST API.
- Enable REST visibility for custom post types and ACF field groups.
- Keep private or operational lead data outside WordPress.

Astro should consume WordPress content for public pages. Content should be fetched at build time when possible for speed. Webhooks should trigger frontend rebuilds when WordPress content changes.

## Technical Architecture

Astro is suitable for this project because the site is mostly content and marketing pages, with limited server-side functionality for forms and scheduling.

Recommended stack:

- Frontend: Astro and TypeScript.
- Rendering: static-first, with server-rendered actions only where needed.
- CMS: headless WordPress.
- Forms: Astro server actions.
- Database: Postgres for leads, audit requests, bookings, booking holds, and operational status.
- Email: Resend or Postmark for transactional notifications and confirmations.
- Calendar: Google Calendar API.
- Frontend hosting: Vercel.
- Database hosting: Neon Postgres.
- WordPress hosting: managed WordPress hosting such as Kinsta, Pressable, or WP Engine.

Deployment recommendation:

- Deploy Astro on Vercel for preview deployments, serverless form/scheduling actions, environment variables, and webhooks.
- Use Neon Postgres for serverless-friendly lead and booking storage.
- Host WordPress on a managed WordPress platform with staging, backups, SSL, plugin support, REST API access, and good admin performance.
- Use a transactional email provider for reliable form and booking notifications.

## Form And Booking Security

All form and scheduling flows should include:

- Server-side validation.
- Honeypot spam field.
- Basic rate limiting.
- Clear error messages near fields.
- Confirmation states.
- Internal logging for failed submissions.

CAPTCHA should not be required at launch unless spam becomes a real problem.

## SEO

SEO requirements:

- Crawlable Astro-rendered pages.
- Clean page titles and meta descriptions.
- Sitemap.
- Robots configuration.
- Open Graph and social metadata.
- RSS feed for blog posts if practical.
- Canonical URLs.
- Structured data where useful:
  - Organization.
  - ProfessionalService by default.
  - LocalBusiness only if OZMO publishes a real local address or local service area.
  - BlogPosting.
  - Service.
  - BreadcrumbList.

## Performance And Accessibility

Performance goals:

- Static-first pages wherever possible.
- Minimal JavaScript on marketing pages.
- No large animation framework unless a specific interaction justifies it.
- Optimized responsive images using modern formats.
- Font loading tuned to avoid layout shift.
- Lazy-load below-the-fold media.
- Target 90+ Lighthouse/PageSpeed scores for performance, accessibility, best practices, and SEO.

Accessibility goals:

- Semantic HTML.
- Keyboard-accessible navigation, forms, and scheduler controls.
- Visible focus states.
- Sufficient color contrast.
- Form labels always visible.
- Errors placed near relevant fields.
- Reduced-motion support.
- No text overlap or fragile fixed layouts on mobile.

## Testing And Verification

Test coverage should match the risk of each area.

Recommended tests:

- Content rendering from WordPress API mappings.
- Fallback seed content for local development.
- Contact form validation.
- Audit form validation.
- Availability rule calculations.
- Google Calendar free/busy response handling.
- Booking conflict prevention.
- Booking confirmation flow.
- Basic browser tests for homepage, services, portfolio, blog, contact, audit, and schedule pages.
- Accessibility smoke checks.
- Responsive screenshot checks at common viewport widths.

## Implementation Phases

1. **Foundation**
   - Astro project setup.
   - TypeScript.
   - Styling system.
   - Layout shell.
   - Navigation and footer.
   - Brand tokens.
   - Basic SEO helpers.
   - Testing setup.

2. **Static Marketing Pages**
   - Homepage.
   - Services page.
   - Contact page.
   - Portfolio / transformations page.
   - Free Site Audit page.
   - Schedule landing page.
   - Split-screen transformation components.

3. **WordPress Headless CMS**
   - WordPress content model.
   - REST API fetch layer.
   - Blog index and detail pages.
   - Services and portfolio content mapping.
   - Local fallback seed content.
   - Webhook rebuild plan.

4. **Forms And Lead Storage**
   - Contact form.
   - Audit form.
   - Server-side validation.
   - Postgres lead tables.
   - Email notifications.
   - Confirmation pages and states.

5. **Scheduling**
   - Availability rules.
   - Google Calendar free/busy integration.
   - Slot generation.
   - Confirmed booking flow.
   - Calendar event creation.
   - Duplicate booking protection.
   - Confirmation emails.

6. **SEO, Performance, And Polish**
   - Image optimization.
   - Metadata.
   - Schema.
   - Sitemap and RSS.
   - Accessibility pass.
   - Responsive browser tests.
   - PageSpeed/Lighthouse review.

7. **Launch Operations**
   - Deploy frontend.
   - Configure WordPress backend.
   - Configure environment variables and secrets.
   - Set up rebuild webhooks.
   - Configure domain and DNS.
   - Add monitoring and error logging.
   - Add analytics.
   - Complete final QA checklist.

## Out Of Scope For First Launch

- Industry-specific landing pages.
- Real client case studies unless available before launch.
- Testimonials unless real testimonials are available.
- CRM integration beyond storing lead data and sending notifications.
- Marketing automation sequences beyond basic follow-up notifications.
- Client portal functionality.
- Paid ads landing page variants.

## Technical Reference Notes

- Astro supports WordPress as a headless CMS through the WordPress REST API.
- Astro Actions provide type-safe backend logic for forms and server calls.
- WordPress REST API exposes public content as JSON and can expose custom post types.
- Custom post types must be configured for REST access.
- ACF field groups must opt into REST visibility when their structured fields are needed by Astro.
- Google Calendar free/busy queries can return busy intervals for calendars.
- Google Calendar events can be inserted after server-side booking validation.

Reference URLs:

- https://docs.astro.build/en/guides/cms/wordpress/
- https://docs.astro.build/en/guides/actions/
- https://developer.wordpress.org/rest-api/
- https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/
- https://www.advancedcustomfields.com/resources/wp-rest-api-integration/
- https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query
- https://developers.google.com/workspace/calendar/api/v3/reference/
- https://docs.astro.build/en/guides/integrations-guide/vercel/
- https://vercel.com/marketplace/neon
- https://resend.com/docs/send-with-nodejs
