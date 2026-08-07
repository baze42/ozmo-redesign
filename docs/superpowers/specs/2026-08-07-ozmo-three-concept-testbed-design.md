# OZMO Three-Concept Production Testbed Design

Date: 2026-08-07

## Goal

Build a production-testable set of three complete OZMO Digital website concepts, each in its own self-contained directory. The first implementation will complete Concept 1, Digital Operations Partner. Concepts 2 and 3 will follow later using the same site structure so all three can be deployed, tested in production, compared, and narrowed to a winner.

The site must work as a marketing tool, sales tool, and design showcase for OZMO Digital. It should use StoryBrand-style structure and copy: the visitor is the hero, OZMO is the guide, the plan is clear, the stakes are practical, and the call to action is repeated without becoming pushy.

## Approved Strategy

- Primary lead action: Request a site audit.
- Primary audience: established local service businesses, including contractors, clinics, consultants, professional services, and home-service businesses that need senior-level digital help without hiring a marketing department.
- Primary positioning for Concept 1: ongoing digital operations partner, with website design as the front door.
- Proof strategy: use honest trust signals instead of invented case studies. Show process clarity, audit examples, service standards, system fluency, practical guidance, and proof-ready layout slots that are filled with current standards until approved testimonials or results exist.
- First-version lead capture: polished front-end forms with validation, loading, success, and error states. Submission endpoint must be configurable and must not be hard-coded to a CRM or email provider.

## Repository Architecture

Use a three-concept structure:

```text
index.html
concepts/
  01-digital-operations-partner/
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

The root `index.html` is a private comparison hub. It links to Concept 1 immediately and reserves clearly labeled slots for Concepts 2 and 3. It is not the final marketing homepage.

Each concept must be self-contained. Do not rely on shared CSS, JavaScript, or image files between concepts, except for source material copied from `docs/ref`. This intentional duplication makes each concept easy to deploy and test independently.

## Design System Requirements

Use the OZMO design system in `docs/ref` as the source of truth.

- Copy logo assets from `docs/ref/assets` into each implemented concept directory.
- Use navy `#1F3A5F` as the trust anchor.
- Use terracotta `#C1622D` as the warm relationship accent.
- Use cream `#F5EFE6` and paper `#FBF8F2` as the primary page and raised surfaces.
- Use spark orange `#F05000` sparingly for the highest-emphasis CTA only.
- Use Fraunces for major headlines and large numbers.
- Use Karla for body, navigation, UI, forms, and labels.
- Use IBM Plex Mono only for small metadata, audit labels, or system-like details.
- Use gentle motion only: rise-in, underline wipe, soft button lift, and subtle spark pulse.
- Avoid fake glass effects, decorative blobs, heavy gradients, harsh shadows, stocky dark overlays, and one-note color palettes.
- Use Lucide-style line icons where icons clarify actions or service categories.

## Concept 1: Digital Operations Partner

Concept 1 is premium, systems-minded, calm, and practical. It should make OZMO feel like the team that can own the digital layer of a small or midsized business: website, care, marketing, content, CRM, email, follow-up, and automation working from one plan.

### Core StoryBrand Flow

The customer problem:

- Website updates, marketing tasks, follow-up, and tools are pulling attention away from the business.
- The owner is unsure what is working, what needs fixing, and what should happen next.
- Missed leads, stale pages, slow follow-up, unclear messaging, and scattered systems create friction.

OZMO as guide:

- OZMO understands the pressure on business owners.
- OZMO brings a calm, practical, detail-oriented operating rhythm.
- OZMO uses design, strategy, maintenance, marketing, and automation together instead of treating them as disconnected tasks.

The plan:

1. Request a site audit.
2. Review a clear digital operations plan.
3. Let OZMO build, improve, and manage the system.

Success:

- The business owner gets more focus.
- Customers get a clearer path to trust and action.
- The digital presence becomes measurable, maintainable, and easier to improve.

Failure avoided:

- Wasted time, scattered tools, unclear marketing, stale websites, slow follow-up, missed leads, and uncertain next steps.

## Concept 1 Pages

### Home

The home page is the primary StoryBrand sales page.

Required sections:

- Header with logo, navigation, and primary CTA `Request a site audit`.
- Hero with pain-led headline, outcome-focused supporting copy, primary audit CTA, secondary contact CTA, and generated hero imagery.
- Quick outcomes: save time, capture better leads, grow with confidence.
- Problem section showing the operational drag of disconnected digital work.
- Guide section positioning OZMO as calm, capable, and practical.
- Services overview in this order:
  1. Website design and redesign.
  2. Website care and maintenance.
  3. Digital marketing, SEO, and content.
  4. Automation, CRM, and email workflows.
- System-flow showcase that visually connects website, care, marketing, and automation.
- Three-step plan.
- Credibility section using honest trust signals: audit criteria, working standards, response expectations, and real-proof-ready layout slots filled with standards or audit examples until approved testimonials/results exist.
- Insights teaser.
- Final CTA band.
- Footer.

### Services

The services page explains the connected operating layer, not isolated offerings.

Required sections:

- Services hero.
- Connected services overview.
- Four detailed service sections in the approved order:
  1. Website design and redesign.
  2. Website care and maintenance.
  3. Digital marketing, SEO, and content.
  4. Automation, CRM, and email workflows.
- For each service: owner problem, what OZMO handles, signs the service is needed, and expected business outcome.
- Engagement model showing how project work can lead into ongoing digital operations.
- CTA to request a site audit.

### Site Audit

The site audit page is the primary lead-capture page.

Required sections:

- Audit hero focused on low-friction clarity: "see what is working, what is costing you leads, and what to fix first."
- Audit checklist preview showing what OZMO reviews:
  - first impression and message clarity
  - speed and mobile usability
  - service-page conversion path
  - lead capture and follow-up
  - local SEO basics
  - care, security, and maintainability
  - automation opportunities
- Site audit form.
- What happens next after submission.
- Expectations: this is a practical review and fit conversation, not a fake instant report.
- Secondary CTA to contact OZMO.

Site audit form fields:

```text
Name
Email
Company
Website URL
What feels hardest right now?
Services you are interested in
Timeline
Notes
```

### About / Approach

The about page should build trust without over-centering OZMO.

Required sections:

- Positioning hero: the digital partner behind the work.
- Plain-spoken explanation of why OZMO exists: "we do what we do so you can better do what you do."
- Approach pillars:
  - clear strategy before design
  - careful execution
  - measurable lead paths
  - ongoing care
  - practical automation
- Design-system and standards showcase that demonstrates attention to detail without becoming a design-system documentation page.
- Working rhythm: audit, plan, build, care, improve.
- Trust signals and real-proof-ready layout slots filled with current standards or audit examples until approved testimonials/results exist.
- CTA to request a site audit.

### Insights

The insights page is a resource-center style archive, not a blog-heavy publication.

Required sections:

- Insights hero for business owners.
- Featured article.
- Article grid with realistic, practical draft article summaries and excerpts that read like owner-facing resources.
- Static topic filters for:
  - website strategy
  - website care
  - local marketing
  - automation
  - lead follow-up
- CTA to request a site audit.

Article topics for the first implementation:

- Five signs your website is costing you good leads.
- What a healthy website care plan should include.
- Where automation helps without making your business feel cold.
- How to make your service pages easier to say yes to.
- What to check before spending more on ads.
- Why slow follow-up costs local businesses more than they think.

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

Implementation requirements:

- Each form has semantic labels and accessible validation messages.
- Required fields validate before submission.
- URL fields validate as URLs when populated.
- Email fields validate as email addresses.
- Submit buttons show a loading state briefly.
- Success state confirms the request and sets clear expectations.
- Error state appears if a configured endpoint fails.
- If no endpoint is configured, forms must not make a network request. They should use an in-page success state suitable for static review.
- Endpoint configuration should live in the concept's JavaScript, clearly named and easy to replace later.
- No CRM, email service, analytics service, or third-party form backend is included in the first Concept 1 implementation.

## Imagery Plan

Generate realistic, warm, natural-light imagery for Concept 1. Images should feel grounded in service-business work and advisory partnership. Avoid readable fake text, fake logos, watermarks, surreal artifacts, over-polished stock styling, and cold corporate scenes.

If image generation fails, create intentional designed image panels and include each prompt in the project next to the generated replacement target.

Required generated assets:

### `hero-digital-operations.png`

Prompt:

```text
Warm realistic editorial photograph of a small business owner and a digital consultant reviewing a calm digital operations dashboard on a laptop in a natural-light office, Midwest service-business feel, trustworthy and practical, navy and warm cream color mood, no readable text, no logos, no watermark, no surreal elements.
```

### `audit-desk.png`

Prompt:

```text
Warm natural-light website audit planning desk scene with laptop, notebook, simple printed checklist with no readable text, coffee, and subtle service-business context, premium but practical, trustworthy small business advisory mood, no logos, no watermark, no legible text.
```

### `systems-map.png`

Prompt:

```text
Polished realistic tabletop planning scene showing website, marketing, CRM, email follow-up, and automation as connected workflow cards and lines, practical operations map rather than sci-fi interface, warm cream and navy mood, no readable words, no brand logos, no watermark.
```

### `owner-focus.png`

Prompt:

```text
Realistic warm photograph of a small service-business owner helping a customer while digital work runs quietly in the background on a laptop or tablet, human and grounded, trust-building, natural light, no fake logos, no readable text, no watermark.
```

### `insights-workshop.png`

Prompt:

```text
Editorial warm workshop scene with a small business owner and advisor reviewing a practical digital marketing plan, notes and laptop visible but no readable text, calm focused collaboration, natural light, premium local business feel, no logos, no watermark.
```

## Concept 2 Roadmap: Local Growth Studio

Concept 2 will use the same six-page structure and self-contained directory after Concept 1 is complete.

Positioning: warm, practical, local, energetic, and relationship-driven.

Primary emphasis:

- OZMO understands local businesses.
- The site and marketing help customers find, trust, and choose the business.
- Services feel approachable and tangible.
- Terracotta can carry more visual energy than in Concept 1, while navy still anchors trust.

The site should be more photography-forward and community-aware than Concept 1, with clearer service cards and more visible owner outcomes. It should avoid becoming casual or generic.

## Concept 3 Roadmap: Website Care + Redesign Specialist

Concept 3 will use the same six-page structure and self-contained directory after Concept 2 is complete.

Positioning: focused, clear, conversion-minded, and easy to understand quickly.

Primary emphasis:

- The visitor likely has an outdated, underperforming, or hard-to-manage website.
- OZMO can redesign the site, clarify the message, improve conversion paths, and keep it cared for.
- Marketing and automation are supporting services, not the first thing the visitor has to understand.

This concept should be narrower and more direct than Concept 1. It should be strongest for visitors already aware their website is the problem, while still leaving a path into ongoing support.

## Root Comparison Hub

The root `index.html` should be practical and private-feeling.

Required content:

- OZMO logo.
- Short explanation that these are production-testable concept directions.
- Concept cards for all three directions.
- Concept 1 card links to the implemented site.
- Concepts 2 and 3 cards are marked as coming next until implemented.
- No public-facing marketing claims that imply the comparison hub is the final OZMO site.

## Accessibility And Responsiveness

Requirements:

- Use semantic landmarks: `header`, `main`, `section`, `article`, `footer`, and labelled forms.
- All links and buttons must be keyboard accessible.
- Focus states must be visible and aligned with the design system.
- Text must not overlap, clip, or overflow on mobile or desktop.
- Layouts must work at common mobile widths and desktop widths.
- Images need meaningful alt text unless decorative.
- Color pairings must respect the design system contrast guidance.
- Motion must respect `prefers-reduced-motion`.

## Implementation Constraints

- Build Concept 1 as a static site.
- Do not introduce a heavy application framework unless implementation planning finds a clear reason.
- Do not implement a CMS, CRM integration, analytics stack, payment flow, scheduling integration, or backend submission handler in Concept 1.
- Do not invent fake testimonials, fake clients, fake awards, or fake verified results.
- Do not use lorem ipsum.
- Do not use image placeholders that look broken or unfinished.
- Do not make a landing page that explains the concept; each concept's first screen must be the actual OZMO website experience.

## Verification Scope

Before Concept 1 is considered complete:

- Confirm root comparison hub exists.
- Confirm all six Concept 1 pages exist.
- Confirm navigation links resolve within Concept 1.
- Confirm root hub links resolve.
- Confirm forms validate required fields.
- Confirm forms show loading and success states.
- Confirm forms do not make network requests when no endpoint is configured.
- Confirm generated images exist, or prompt-backed placeholders exist.
- Confirm copied logo assets exist inside Concept 1.
- Confirm desktop and mobile screenshots are checked.
- Confirm no fake testimonials, fake client names, unverifiable claims, lorem ipsum, or unfinished notes appear in public pages.
- Confirm design-system colors, typography, spacing, focus states, and motion rules are followed.

## Completion Sequence

1. Implement Concept 1: Digital Operations Partner.
2. Verify Concept 1 locally.
3. Review Concept 1 in production or production-like hosting.
4. Implement Concept 2: Local Growth Studio in its own directory.
5. Verify and review Concept 2.
6. Implement Concept 3: Website Care + Redesign Specialist in its own directory.
7. Verify and review Concept 3.
8. Compare production-tested concepts and select the winner to move forward with.
