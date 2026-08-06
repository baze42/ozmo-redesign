# Steady Expert Production Site Design

Date: 2026-08-06

## Goal

Turn the approved Steady Expert direction into the production-ready OZMO Digital static site at the repository root. The root site should no longer feel like a prototype or comparison artifact. It should be a polished, high-trust, editorial marketing site that demonstrates OZMO's care, clarity, and attention to detail.

## Scope

Create the production site at:

- `index.html`
- `services.html`
- `contact.html`
- `blog.html`
- `article.html`

Keep the previous concept work under `concepts/` as archived review material. The root no longer acts as a concept gallery.

## Positioning

Steady Expert is the final direction: high-trust, editorial, calm, warm, and polished. OZMO should feel like the steady guide for owners who want websites, digital marketing, care, and automation handled well without needing to manage the details themselves.

## Brand Rules

- Use the OZMO design system from `docs/ref`.
- Keep navy as the trust anchor and cream/paper as the primary surfaces.
- Use terracotta for warmth and relationships.
- Use spark orange only for high-emphasis CTAs.
- Use Fraunces for major headings and Karla for body/UI text.
- Avoid prototype labels such as "Direction 01", "prototype", "sample proof", "concept", or "comparison".
- Avoid unverified claims, fake client names, and fake case-study results.

## Imagery

Use project-owned assets for production-facing pages.

- Keep the current "Be Brilliant" hero image as the home hero because it is an approved brand memory cue.
- Generate realistic, warm, natural-light business photography for interior production sections.
- Required generated production assets:
  - `assets/img/steady-guide-session.png`: a realistic advisory working session for the guide/authority section.
  - `assets/img/steady-site-audit.png`: a realistic website audit and planning desk scene for services/contact.
  - `assets/img/steady-owner-workflow.png`: a realistic owner/operator workflow scene for automation or blog sections.
- The generated images must not include readable text, fake logos, watermarks, surreal artifacts, or obvious AI styling.
- Alt text must describe the scene plainly.

## Root Page Requirements

### Home

Home must include:

- Header with logo, nav, and primary CTA.
- Hero with the "Be Brilliant" image, primary CTA `Schedule a call`, and secondary CTA `Request a site audit`.
- Quick outcomes: save time, delight customers, grow with confidence.
- Problem section.
- Services overview in approved order.
- Three-step plan.
- Guide/authority section using generated imagery.
- Success outcome band.
- Blog/resource teaser.
- Final CTA.
- Footer without prototype language.

### Services

Services must include:

- Service hero with production copy.
- Four service sections in this order:
  1. Website design and redesign.
  2. Website care and maintenance.
  3. Digital marketing, SEO, and content.
  4. Automation, CRM, and email workflows.
- Signs you need each service.
- Engagement plan.
- CTA to schedule a call and request a site audit.

### Contact

Contact must include:

- Conversion-focused headline.
- Static form with name, email, company, website URL, service interest, and project notes.
- Clear expectation-setting copy.
- Static no-network form behavior.
- No production-facing "prototype only" language.

### Blog Archive

Blog archive must include:

- Resource-center headline.
- Featured article.
- Article grid.
- Static topic filters.
- Site audit CTA.

### Blog Detail

Blog detail must include:

- Article title, category, date, reading time.
- Realistic placeholder article content that reads like publishable educational content.
- Pull quote/key takeaway.
- Related articles.
- Final CTA.

## Build And Verification

- Keep the static generator approach.
- Update `src/verify.js` so it verifies the production root pages and archived concepts.
- Verify all root links resolve.
- Verify root pages contain no prototype/gallery language.
- Verify production pages reference only project-local production images for production imagery.
- Run browser screenshots at desktop and mobile widths.
- Commit and push the completed production-ready site.
