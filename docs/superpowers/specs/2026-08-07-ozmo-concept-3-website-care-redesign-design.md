# OZMO Concept 3 Website Care + Redesign Specialist Design

Date: 2026-08-07

## Goal

Build the third production-testable OZMO Digital website concept in its own self-contained directory: `concepts/03-website-care-redesign/`.

Concept 3 keeps the approved six-page structure and StoryBrand-style strategy, but narrows the message around a problem many visitors already feel: their website is outdated, hard to manage, unclear, or not turning enough visitors into good inquiries. The concept should make OZMO feel like the clear specialist who can redesign the site, sharpen the message, improve the lead path, and keep the website cared for after launch.

## Approved Direction

- Primary lead action: `Request a site audit`.
- Primary audience: established local service businesses, including contractors, clinics, consultants, professional services, and home-service businesses.
- Primary positioning for Concept 3: website redesign and care specialist for businesses that know the website is the weak link.
- Tone: focused, clear, practical, conversion-minded, and easy to understand quickly.
- Proof strategy: use honest trust signals, audit previews, care standards, launch readiness checks, conversion-path standards, and proof-ready layout slots. Do not invent fake testimonials, fake clients, fake awards, fake scores, or fake results.
- The site should be more direct than Concepts 1 and 2. Marketing and automation remain supporting services, not the first thing a visitor has to understand.

## Repository Architecture

Create Concept 3 at:

```text
concepts/
  03-website-care-redesign/
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

The root `index.html` remains a private comparison hub. Update it so Concept 3 links to the implemented site, while Concepts 1 and 2 continue linking to their implemented directories.

Each concept must be deployable by itself. Do not rely on Concept 1 or Concept 2 CSS, JavaScript, image files, or generated assets. Copy approved OZMO logo assets from `docs/ref/assets` into Concept 3.

## Design System Requirements

Use the OZMO design system in `docs/ref` as the source of truth.

- Use navy `#1F3A5F` as the trust anchor.
- Use terracotta `#C1622D` as the primary warm action and repair/accent color.
- Use cream `#F5EFE6` and paper `#FBF8F2` as the main page and raised surfaces.
- Use spark orange `#F05000` only for one high-emphasis audit CTA or tiny readiness indicator per view.
- Use Fraunces for major headlines, page titles, and important owner-outcome statements.
- Use Karla for body, navigation, UI, forms, and labels.
- Use IBM Plex Mono only for audit labels, care-plan metadata, small readiness markers, and system details.
- Use gentle motion only: rise-in, underline wipe, soft button lift, and subtle spark pulse.
- Use Lucide-style line icons where icons clarify redesign, care, conversion, maintenance, or follow-up categories.
- Avoid heavy gradients, decorative blobs, harsh shadows, stocky dark overlays, fake glass effects, fake dashboards, and one-note color palettes.

## Concept 3 StoryBrand Flow

The customer problem:

- Your website no longer reflects the quality of the business.
- People may land on the site and still hesitate because the message is dated, the service path is unclear, the mobile experience is weak, or the next step is hard to find.
- Even a redesigned site can drift out of shape without care, content updates, security attention, and practical follow-up.

OZMO as guide:

- We understand that small business owners need a website that is clear, current, dependable, and easy to keep improving.
- We help redesign the message, structure, pages, and inquiry path before layering on marketing or automation.
- We keep the site cared for after launch so the work does not become stale again.

The plan:

1. Request a site audit.
2. See what needs redesign, repair, or care first.
3. Launch a clearer website and keep it working.

Success:

- Your website feels current and trustworthy.
- Visitors understand what you do and how to start.
- Inquiry paths are easier to follow on mobile and desktop.
- The site stays cared for instead of becoming another neglected project.

Failure avoided:

- A stale website, confusing service pages, missed inquiries, broken forms, slow pages, outdated content, and a redesign that looks good for a month but is not maintained.

## Pages

### Home

The home page is the primary StoryBrand sales page for website redesign and care.

Required sections:

- Header with logo, navigation, and primary CTA `Request a site audit`.
- Hero with a stale-site/redesign headline, owner-focused supporting copy, audit CTA, secondary contact CTA, and generated hero imagery.
- Quick outcomes: look current, make action easier, stay cared for.
- Problem section about stale websites, unclear messages, weak mobile experiences, and hard-to-manage pages.
- Guide section positioning OZMO as the practical specialist for redesign, care, and lead paths.
- Services overview in this order:
  1. Website redesign and message clarity.
  2. Conversion paths and service-page structure.
  3. Website care and maintenance.
  4. Supporting marketing and follow-up.
- Website improvement path showcase connecting audit, clarify, redesign, launch, and care.
- Three-step plan.
- Credibility section using honest trust signals: audit depth, care standards, launch readiness, proof-ready structure.
- Insights teaser.
- Final CTA band.
- Footer.

### Services

The services page should make the website work feel concrete and manageable.

Required sections:

- Services hero.
- Website redesign and care overview.
- Four detailed service sections in the approved order:
  1. Website redesign and message clarity.
  2. Conversion paths and service-page structure.
  3. Website care and maintenance.
  4. Supporting marketing and follow-up.
- For each service: owner problem, what we handle, signs you need this, and owner outcome.
- Engagement model showing how audit, redesign, launch, care, and selective growth support can connect.
- CTA to request a site audit.

### Site Audit

The site audit page remains the primary lead-capture page.

Required sections:

- Audit hero focused on "see what your website needs before you redesign, repair, or promote it."
- Audit checklist preview showing what OZMO reviews:
  - first impression and message clarity
  - mobile usability and speed cues
  - service-page structure
  - call-to-action and inquiry path
  - trust signals and proof readiness
  - care, security, and maintainability
  - content freshness and update rhythm
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
What is not working on your website right now?
Services you are interested in
Timeline
Notes
```

### About / Approach

The about page should build trust around care, detail, and maintainable design without over-centering OZMO.

Required sections:

- Positioning hero: the team that redesigns and cares for the website behind your business.
- Plain-spoken explanation of why OZMO exists: `we do what we do so you can better do what you do`.
- Approach pillars:
  - clarify before redesigning
  - design the next step
  - build for care and maintainability
  - keep the website current
  - improve only what helps the customer path
- Design-system and standards showcase with a clean, conversion-minded treatment.
- Working rhythm: audit, clarify, redesign, launch, care, improve.
- Trust signals and proof-ready layout slots filled with standards or audit examples.
- CTA to request a site audit.

### Insights

The insights page is a practical website-care and redesign resource archive.

Required sections:

- Insights hero for business owners with outdated or hard-to-manage websites.
- Featured article.
- Article grid with realistic owner-facing summaries.
- Static topic links for:
  - website redesign
  - website care
  - service pages
  - conversion paths
  - follow-up
- CTA to request a site audit.

Article topics:

- Five signs your website is costing you good leads.
- What to fix before you start a redesign.
- What a healthy website care plan should include.
- How service pages help the right customers take the next step.
- Why conversion paths matter more than visual polish alone.
- How follow-up keeps good website inquiries from going quiet.

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

- Concept 3 must use its own `assets/js/site.js`.
- Endpoint configuration must live in Concept 3 JavaScript and default to empty strings.
- If no endpoint is configured and JavaScript is enabled, forms must not make a network request and should use an in-page static-review success state.
- If JavaScript is unavailable and no production endpoint is approved, source form submission must be explicitly unavailable without sending data.
- JavaScript enhancement may activate the form controls, add `novalidate`, validate fields, show loading, show success, show configured-endpoint errors, reset successful forms, and prevent repeated pending submissions.
- Do not include a CMS, CRM integration, analytics stack, payment flow, scheduling integration, or backend submission handler.

## Imagery Plan

Generate realistic, warm, natural-light imagery for Concept 3. Images should feel grounded in practical website redesign, care, review, and launch-readiness work for local service businesses. Avoid readable fake text, fake logos, watermarks, surreal artifacts, over-polished stock styling, fake dashboards, and cold corporate scenes.

Required generated assets:

### `hero-website-redesign.png`

Prompt:

```text
Warm realistic editorial photograph of a small business owner and website advisor reviewing a refreshed website layout on a laptop in a bright practical office, clear redesign and care planning mood, navy cream and terracotta color accents, no readable text, no logos, no watermark, no surreal elements.
```

### `redesign-review.png`

Prompt:

```text
Realistic natural-light desk scene with laptop, blank wireframe sketches, website page cards, and a simple redesign review checklist with no readable text, practical website improvement mood, navy cream terracotta accents, no logos, no watermark.
```

### `care-checklist.png`

Prompt:

```text
Warm editorial tabletop scene showing a website care checklist represented by blank cards, laptop, calendar blocks without numbers, update notes with no readable text, and a coffee cup, dependable maintenance mood, no logos, no watermark.
```

### `conversion-path.png`

Prompt:

```text
Polished realistic planning scene showing a simple customer path from service page to inquiry to follow-up using blank cards and connector lines, practical conversion path strategy, warm cream navy terracotta palette, no readable words, no brand logos, no watermark.
```

### `launch-workshop.png`

Prompt:

```text
Natural-light editorial workshop scene with a small business owner and advisor reviewing a launch-ready website plan, blank page layouts and maintenance cards visible, focused collaborative mood, premium but practical, no readable text, no logos, no watermark.
```

If image generation fails, create intentional designed image panels and keep each prompt in `concepts/03-website-care-redesign/assets/img/prompts.md`.

## Testing And Verification

Concept 3 must have test coverage comparable to Concepts 1 and 2.

Required verification:

- Structural tests confirm the Concept 3 directory contains exactly the six required pages and self-contained assets.
- Root hub tests confirm Concept 3 links to the implemented site.
- Content tests confirm the Concept 3 StoryBrand flow, service order, page requirements, and forbidden-copy constraints.
- Style tests confirm design-system tokens, Concept 3 focused redesign/care treatment, mobile behavior, reduced motion, focus states, CTA contrast, live-region visibility, line icons, and no forbidden visual patterns.
- Form tests confirm validation helpers, empty endpoint static mode, disabled no-JS source state, enhancement activation, repeated values, and pending submission guard for all three concepts.
- Asset tests confirm required PNG images, WebP derivatives, and prompt documentation.
- Browser tests run over local HTTP and cover mobile/desktop overflow, navigation, JavaScript-disabled and script-failure behavior, enhanced static-mode form success with no network request, configured endpoint failure, single-flight submissions, lazy image readiness, and screenshots for all three concepts.
- `npm test`, `npm run verify`, and `npm run test:browser -- --reporter=list` must pass before final review.

## Deployment Notes

Concept 3 is production-testable as a static site, not production-connected lead capture. Before public deployment, configure and verify an approved form endpoint or recipient. Do not invent contact details.

After Concept 3 is complete, all three concepts are available for production testing and winner selection.
