# OZMO Digital Static Prototype Redesign Design

Date: 2026-08-06

## Goal

Create three high-end static website directions for OZMO Digital to review and choose between. Each direction must show a navigable multi-page site, use the supplied OZMO design system, preserve the current StoryBrand copy structure, and demonstrate the level of polish, care, and attention to detail OZMO offers clients.

The prototypes are decision artifacts, not the final production website. They should be complete enough to evaluate brand feel, page flow, conversion strategy, imagery, and component style across a small site.

## Audience

The site speaks to established local service businesses and professional practices, including contractors, clinics, consultants, home services, legal and financial practices, and local retailers. Copy should address owners and operators who need websites, marketing, and automation handled reliably so they can stay focused on serving customers and running their business.

## Brand And Design System

Use the provided OZMO Digital design system in `docs/ref`.

- Colors: navy `#1F3A5F` as the trust anchor, terracotta `#C1622D` as the warm relationship accent, cream `#F5EFE6` as the main page background, paper `#FBF8F2` for raised surfaces, ink `#2A2725` for body text, and spark orange `#F05000` only for the highest-emphasis CTA.
- Typography: Fraunces for headlines and major numbers; Karla for body, navigation, UI, forms, and cards; IBM Plex Mono only for small metadata or data-like labels.
- Logo assets: use the lockups and mark from `docs/ref/assets`.
- Motion: gentle rise, underline wipe, and soft button lift effects only. Avoid flashy motion.
- Iconography: use Lucide-style line icons loaded from a CDN or inline SVG only where appropriate.
- Imagery: prefer warm, realistic small-business and professional-service photography. Keep the current "Be Brilliant" hero image in at least one direction. Avoid the current overly AI-generated illustration-style images. Icons and simple UI diagrams are acceptable where photography is not the right content.

## Shared StoryBrand Structure

Each direction should preserve the StoryBrand flow already present on the current site:

1. The customer has a problem: marketing, website upkeep, and digital tools are taking attention away from the business.
2. OZMO is the guide: practical, calm, capable, and relationship-driven.
3. A clear plan: schedule a call, get a site audit, receive a focused plan, then let OZMO build and maintain the system.
4. Success: save time, delight customers, grow with confidence, and run a digital presence that works in the background.
5. Failure avoided: wasted time, confusing tools, stale websites, missed leads, and marketing that cannot be measured.
6. Calls to action: primary `Schedule a call`; secondary `Request a site audit`.

## Service Priority

Services must be presented in this order:

1. Website design and redesign.
2. Website care and maintenance.
3. Digital marketing, SEO, and content.
4. Automation, CRM, and email workflows.

## Prototype Architecture

Build a static prototype gallery in the repository.

- Root `index.html`: comparison hub linking to all three directions and summarizing their intent.
- `concepts/steady-expert/`: five-page site direction.
- `concepts/local-growth-studio/`: five-page site direction.
- `concepts/operations-partner/`: five-page site direction.
- Shared assets/styles/scripts should live under a common static folder.

Each concept must include:

- `index.html`: Home.
- `services.html`: Services.
- `contact.html`: Contact.
- `blog.html`: Blog archive.
- `article.html`: Blog detail.

All pages must be linked through header and footer navigation so each concept feels like a small site, not an isolated screen.

## Direction 1: Steady Expert

Positioning: high-trust, editorial, calm, and polished.

Use the current "Be Brilliant" hero image as a brand memory cue, framed with mature typography and restrained layout. This direction should feel like OZMO is the steady expert who removes digital stress from the owner.

Design traits:

- Cream and paper surfaces with navy headlines and a strong navy footer.
- Editorial spacing, large Fraunces headlines, restrained cards, and careful pull quotes.
- Hero composition that pairs the pain statement with the "Be Brilliant" image and a clear CTA pair.
- Proof placeholders that feel advisory and credible, not exaggerated.
- Best use case: communicating quality, care, strategy, and trust.

## Direction 2: Local Growth Studio

Positioning: practical, warm, local, and energetic.

Use realistic small-business photography and a more visible services grid. This direction should feel approachable without becoming casual, and should make the owner feel that OZMO understands local businesses.

Design traits:

- Warm photography-forward sections.
- Terracotta accents used more prominently than in Steady Expert.
- Clear service cards, small-business outcome stats, and approachable process blocks.
- Blog archive that looks like a useful resource center for owners.
- Best use case: showing partnership, practical execution, and local-market empathy.

## Direction 3: Operations Partner

Positioning: managed digital operations for owners who want the whole web, marketing, and automation layer handled.

This direction should feel more systems-oriented while remaining plain-spoken. It must emphasize that OZMO can build, care for, market, and automate the digital side of the business as one connected service.

Design traits:

- More structured layouts, dashboards, timelines, and system-flow visuals.
- Navy bands and paper panels with measured use of terracotta and spark.
- Automation and maintenance presented as calm operational leverage, not technical complexity.
- Contact page framed around a site audit and operational-fit conversation.
- Best use case: emphasizing ongoing support, automation, and measurable digital operations.

## Page Requirements

### Home

Each home page must include:

- Header with logo, navigation, and primary CTA.
- StoryBrand hero with pain-led headline, supporting copy, and CTA pair.
- Three quick outcomes: save time, delight customers, grow with confidence.
- Problem section showing why owners feel stuck.
- Services overview in the approved order.
- Simple plan with 3 steps.
- Empathy/authority guide section.
- Success outcome section.
- Blog/resource teaser.
- Final CTA.
- Footer.

### Services

Each services page must include:

- Service hero.
- Four service sections in priority order.
- "Who this is for" or "common signs you need this" content.
- Simple plan or engagement model.
- CTA to schedule a call and request a site audit.

### Contact

Each contact page must include:

- Clear conversion-focused headline.
- Contact form fields for name, email, company, website URL, service interest, and project notes.
- Secondary audit CTA language.
- Expectation-setting content: what happens after the request.
- Non-functional static form behavior with clear prototype-safe handling.

### Blog Archive

Each blog archive must include:

- Blog/resource center hero.
- Featured article.
- Article grid with realistic placeholder posts for business owners.
- Category or topic filters as static UI.
- CTA band for a site audit.

### Blog Detail

Each article page must include:

- Article header with category, title, date, and reading time.
- Realistic placeholder article content related to website redesign, marketing, maintenance, or automation.
- Pull quote or key takeaway.
- Related articles.
- CTA at the end.

## Content Rules

- Use polished placeholder proof content because real testimonials, client names, and results are not available yet.
- Avoid fake claims that sound like verified case studies.
- Prefer language such as "Example result", "Typical owner concern", and "Proof placeholder" when needed.
- Keep copy warm, direct, and practical.
- Avoid jargon, hype, and fear-selling.
- Use "OZMO Digital" in formal locations and "OZMO" in conversational copy.

## Visual Asset Rules

- Copy logo assets from `docs/ref/assets` into the prototype asset folder.
- Use the current hero image from the live site in Steady Expert.
- Replace existing AI-looking interior images with realistic photography or icon-led sections.
- Remote photography is acceptable for prototypes if the URLs are stable enough for review.
- Add alt text for every meaningful image.
- If a photo fails, the layout must still look intentional with color and text.

## Static Interaction Rules

- Navigation links must work.
- Contact forms are static and must not attempt network submission.
- Form submit buttons may show a small in-page "prototype only" confirmation.
- Blog filters can be static visual controls and do not need filtering behavior.
- Hover and focus states must be visible and aligned with the design system.

## Accessibility And Responsiveness

- All pages must be responsive across desktop and mobile.
- Text must not overlap or overflow on common mobile widths.
- Use semantic landmarks where practical: header, main, section, article, footer.
- Buttons and links must have accessible labels.
- Form controls must have labels.
- Color contrast must follow the approved color pairings in the design system.

## Implementation Constraints

- Build as static HTML/CSS/JavaScript prototypes.
- Avoid unnecessary build tooling unless verification requires it.
- Keep shared styling centralized and concept variations isolated.
- Avoid overusing cards, nested cards, decorative blobs, generic gradients, or stock-looking dark overlays.
- The first screen should be the actual site experience, not a marketing landing page for the prototype.

## Verification

Before committing the implementation:

- Open the prototype locally through a static server.
- Verify all root and concept navigation links resolve.
- Verify all five pages exist for each of the three concepts.
- Check desktop and mobile layouts with screenshots or browser automation.
- Confirm forms do not submit to a network endpoint.
- Confirm no obvious placeholder artifacts such as filler Latin text, unfinished notes, or current-site footer leftovers remain.
- Confirm the finished implementation is committed and pushed to GitHub.
