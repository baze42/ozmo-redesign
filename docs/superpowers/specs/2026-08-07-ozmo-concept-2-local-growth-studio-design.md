# OZMO Concept 2 Local Growth Studio Design

Date: 2026-08-07

## Goal

Build the second production-testable OZMO Digital website concept in its own self-contained directory: `concepts/02-local-growth-studio/`.

Concept 2 keeps the approved six-page structure and StoryBrand-style strategy, but shifts the emotional center from "digital operations partner" to "local growth studio." It should feel warmer, more local, more photography-forward, and easier for a small business owner to understand quickly. The visitor remains the hero: OZMO helps local service businesses get found, trusted, chosen, and followed up with, without forcing the owner to become a marketer.

## Approved Direction

- Primary lead action: `Request a site audit`.
- Primary audience: established local service businesses, including contractors, clinics, consultants, professional services, and home-service businesses.
- Primary positioning for Concept 2: local website and marketing studio for businesses that need clearer visibility, stronger trust, and a steadier lead path.
- Tone: warm, practical, local, energetic, and relationship-driven.
- Proof strategy: use honest trust signals, practical standards, audit previews, owner outcomes, and proof-ready layout slots. Do not invent fake testimonials, fake clients, fake awards, or fake results.
- The site should feel more community-aware than Concept 1 without becoming casual, cute, or generic.

## Repository Architecture

Create Concept 2 at:

```text
concepts/
  02-local-growth-studio/
    index.html
    services.html
    site-audit.html
    about.html
    insights.html
    contact.html
    assets/
      css/
      js/
      img/
      logos/
```

The root `index.html` remains a private comparison hub. Update it so Concept 2 links to the implemented site and Concept 3 remains clearly marked as coming next.

Each concept must be deployable by itself. Do not rely on Concept 1 CSS, JavaScript, image files, or generated assets. Copy approved OZMO logo assets from `docs/ref/assets` into Concept 2.

## Design System Requirements

Use the OZMO design system in `docs/ref` as the source of truth.

- Use navy `#1F3A5F` as the trust anchor.
- Use terracotta `#C1622D` more visibly than Concept 1 through section accents, badges, small dividers, and warm CTA treatments.
- Use cream `#F5EFE6` and paper `#FBF8F2` as the main page and raised surfaces.
- Use spark orange `#F05000` only for one high-emphasis lead action or tiny energy detail per view.
- Use Fraunces for major headlines and large owner-outcome numbers.
- Use Karla for body, navigation, UI, forms, and labels.
- Use IBM Plex Mono only for small metadata, location-like labels, audit labels, and system details.
- Use gentle motion only: rise-in, underline wipe, soft button lift, and subtle spark pulse.
- Use Lucide-style line icons where icons clarify services, outcomes, or local growth stages.
- Avoid heavy gradients, decorative blobs, harsh shadows, stocky dark overlays, fake glass effects, and one-note color palettes.

## Concept 2 StoryBrand Flow

The customer problem:

- You rely on local reputation, referrals, and repeat customers, but your website and marketing do not make the next step clear.
- People may find you through search, maps, referrals, or social proof, then lose confidence because pages are stale, generic, slow, or hard to act on.
- Leads can slip away when the message, local visibility, and follow-up rhythm are disconnected.

OZMO as guide:

- We understand local businesses need practical visibility, trust, and follow-up rather than marketing noise.
- We help shape the website, service pages, local search basics, content, and simple automations into one approachable growth rhythm.
- We bring careful design and steady execution without asking the owner to run a marketing department.

The plan:

1. Request a site audit.
2. See the clearest local growth opportunities.
3. Build the website, content, and follow-up rhythm that helps customers choose you.

Success:

- More local customers understand what you do and how to start.
- Your website feels trustworthy, current, and useful.
- Marketing feels easier to maintain because the plan is visible and practical.
- Follow-up becomes more consistent without feeling cold.

Failure avoided:

- Wasted ad spend, unclear local search presence, stale service pages, missed inquiries, slow follow-up, and a website that does not match the quality of the business.

## Pages

### Home

The home page is the primary StoryBrand sales page for local growth.

Required sections:

- Header with logo, navigation, and primary CTA `Request a site audit`.
- Hero with local-growth headline, owner-focused supporting copy, audit CTA, secondary contact CTA, and generated hero imagery.
- Quick outcomes: be easier to find, be easier to trust, be easier to choose.
- Problem section about local marketing friction and unclear customer paths.
- Guide section positioning OZMO as a practical local growth partner.
- Services overview in this order:
  1. Website design for local trust.
  2. Local SEO and service-page clarity.
  3. Content and campaign support.
  4. Lead follow-up and simple automation.
- Local growth path showcase connecting search, website, service page, inquiry, and follow-up.
- Three-step plan.
- Credibility section using honest trust signals: local audit checks, content standards, response standard, proof-ready standards.
- Insights teaser.
- Final CTA band.
- Footer.

### Services

The services page should make growth feel tangible and approachable.

Required sections:

- Services hero.
- Connected local growth overview.
- Four detailed service sections in the approved order:
  1. Website design for local trust.
  2. Local SEO and service-page clarity.
  3. Content and campaign support.
  4. Lead follow-up and simple automation.
- For each service: owner problem, what we handle, signs you need this, and owner outcome.
- Engagement model showing how audit, focused project work, and ongoing growth support can connect.
- CTA to request a site audit.

### Site Audit

The site audit page remains the primary lead-capture page.

Required sections:

- Audit hero focused on "find the clearest opportunities to earn more local trust."
- Audit checklist preview showing what OZMO reviews:
  - local first impression and message clarity
  - maps and local search basics
  - mobile speed and usability
  - service-page clarity
  - trust signals and proof readiness
  - inquiry path and follow-up
  - care and content rhythm
- Site audit form.
- What happens next after submission.
- Expectations: practical review and fit conversation, not a fake instant score.
- Secondary CTA to contact OZMO.

Site audit form fields:

```text
Name
Email
Company
Website URL
What local growth goal matters most right now?
Services you are interested in
Timeline
Notes
```

### About / Approach

The about page should make OZMO feel steady, local-minded, and detail-oriented without over-centering OZMO.

Required sections:

- Positioning hero: the studio behind clearer local growth.
- Plain-spoken explanation of why OZMO exists: `we do what we do so you can better do what you do`.
- Approach pillars:
  - understand the local customer path
  - clarify the message before promotion
  - design for trust and action
  - keep the website cared for
  - improve follow-up without losing warmth
- Design-system and standards showcase with a warmer local-growth treatment.
- Working rhythm: audit, clarify, build, promote, care, improve.
- Trust signals and proof-ready layout slots filled with standards or audit examples.
- CTA to request a site audit.

### Insights

The insights page is a practical local-growth resource archive.

Required sections:

- Insights hero for local business owners.
- Featured article.
- Article grid with realistic owner-facing summaries.
- Static topic filters for:
  - local search
  - website trust
  - service pages
  - content rhythm
  - lead follow-up
- CTA to request a site audit.

Article topics:

- How local customers decide whether to trust your website.
- What your service pages should answer before someone calls.
- Why local SEO starts with clear, useful pages.
- Simple ways to keep marketing moving without doing everything.
- What to check before boosting a post or running ads.
- How faster follow-up helps good local leads choose you.

### Contact

The contact page is the secondary lead path.

Required sections:

- Contact hero for general inquiries.
- Contact form.
- Clear next-step expectations.
- Alternate contact context if the visitor is unsure whether to request an audit.
- CTA back to the site audit page.

Contact form fields:

```text
Name
Email
Company
Website URL
Reason for reaching out
Message
```

## Forms And Data Flow

Forms are front-end complete but backend-configurable.

- Concept 2 must use its own `assets/js/site.js`.
- Endpoint configuration must live in Concept 2 JavaScript and default to empty strings.
- If no endpoint is configured and JavaScript is enabled, forms must not make a network request and should use an in-page static-review success state.
- If JavaScript is unavailable and no production endpoint is approved, source form submission must be explicitly unavailable without sending data.
- JavaScript enhancement may activate the form controls, add `novalidate`, validate fields, show loading, show success, show configured-endpoint errors, reset successful forms, and prevent repeated pending submissions.
- Do not include a CMS, CRM integration, analytics stack, payment flow, scheduling integration, or backend submission handler.

## Imagery Plan

Generate realistic, warm, natural-light imagery for Concept 2. Images should feel grounded in local service-business life, community trust, and practical growth work. Avoid readable fake text, fake logos, watermarks, surreal artifacts, over-polished stock styling, and cold corporate scenes.

Required generated assets:

### `hero-local-growth.png`

Prompt:

```text
Warm realistic editorial photograph of a local service-business owner and a digital advisor reviewing a friendly website and local growth plan in a bright small-town office or storefront, community-aware Midwest business feel, navy cream and terracotta color mood, no readable text, no logos, no watermark, no surreal elements.
```

### `local-search-map.png`

Prompt:

```text
Realistic tabletop scene showing a phone with an abstract local map interface, handwritten planning notes with no readable text, service-area pins, and warm small-business materials, practical local search strategy mood, navy cream terracotta accents, no logos, no watermark.
```

### `owner-welcome.png`

Prompt:

```text
Natural-light photograph of a local service-business owner welcoming a customer in a clean approachable storefront or clinic reception area, trustworthy and human, warm Midwest small business atmosphere, no readable signage, no logos, no watermark.
```

### `community-planning.png`

Prompt:

```text
Editorial warm planning session with a small business owner and advisor reviewing local marketing calendar cards, service page sketches, and customer journey notes with no readable text, energetic but practical collaboration, cream navy terracotta mood, no logos, no watermark.
```

### `marketing-rhythm.png`

Prompt:

```text
Realistic desk scene showing a simple local marketing rhythm with laptop, calendar, content cards, email follow-up notes, and a coffee cup, warm practical studio feel, no readable words, no brand logos, no watermark.
```

If image generation fails, create intentional designed image panels and keep each prompt in `concepts/02-local-growth-studio/assets/img/prompts.md`.

## Testing And Verification

Concept 2 must have test coverage comparable to Concept 1.

Required verification:

- Structural tests confirm the Concept 2 directory contains exactly the six required pages and self-contained assets.
- Root hub tests confirm Concept 2 links to the implemented site and Concept 3 remains coming next.
- Content tests confirm the Concept 2 StoryBrand flow, service order, page requirements, and forbidden-copy constraints.
- Style tests confirm design-system tokens, Concept 2 warmth, mobile behavior, reduced motion, focus states, CTA contrast, and no forbidden visual patterns.
- Form tests confirm validation helpers, empty endpoint static mode, disabled no-JS source state, enhancement activation, repeated values, and pending submission guard.
- Asset tests confirm required PNG images, WebP derivatives, and prompt documentation.
- Browser tests run over local HTTP and cover mobile/desktop overflow, navigation, JavaScript-disabled and script-failure behavior, enhanced static-mode form success with no network request, configured endpoint failure, single-flight submissions, lazy image readiness, and screenshots.
- `npm test`, `npm run verify`, and `npm run test:browser -- --reporter=list` must pass before final review.

## Deployment Notes

Concept 2 is production-testable as a static site, not production-connected lead capture. Before public deployment, configure and verify an approved form endpoint or recipient. Do not invent contact details.

Concept 3 remains a roadmap slot until its implementation begins.
