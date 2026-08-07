# Ozmo Digital Website Design Spec

Date: 2026-08-07

## Goal

Build a high-end, modern, stylish, and functional marketing website for Ozmo Digital that acts as a lead-generation tool, sales tool, and design showcase. The site should position Ozmo Digital as the trusted digital growth partner for small to medium sized businesses that want better websites, marketing, automation, and lead capture without having to manage the digital work themselves.

## Brand Context

Ozmo Digital helps small to medium sized businesses with websites, digital marketing, automation, lead capture, and ongoing digital support so owners can focus on running their business. The brand promise is practical and relational: Ozmo Digital does the digital work well so clients can better do the work they are best at.

The site must use the existing logo at `docs/ref/uploads/ozmo-logo-bo.png`.

## Audience

The homepage should speak broadly to small and medium sized businesses that feel overwhelmed by websites, marketing, digital follow-up, and automation. It should not target one vertical industry at launch.

Primary visitor state:
- They know their current digital presence is not working as well as it should.
- They are tired of scattered tools, unclear messaging, inconsistent marketing, and manual follow-up.
- They want a capable partner who can bring strategy, design, marketing, and systems together.
- They value trust, taste, clarity, and practical execution.

## Primary Conversion

The primary lead action is:

**Request Your Digital Growth Audit**

The audit should feel consultative and low-friction, not like a generic sales form. It should be framed as a practical first step that helps the visitor understand what is working, what is missing, and where Ozmo Digital can improve their digital growth system.

## Positioning And Tone

The site direction is **Guided Growth Studio**.

Ozmo Digital should feel like a premium editorial studio crossed with a practical digital growth partner. The tone should be **editorial premium** with enough **calm expert restraint** to remain trustworthy, direct, and useful.

Copy qualities:
- Warm, polished, and confident.
- Clear enough for busy business owners.
- Specific about pain points and outcomes.
- Avoid hype, vague agency language, and aggressive urgency.
- Avoid generic claims such as "we build beautiful websites" unless tied to a business outcome.

## StoryBrand Flow

The homepage should follow this StoryBrand structure:

1. Hero: state the desired outcome and make the audit CTA visible.
2. Problem: name the visitor's frustration with outdated websites, inconsistent marketing, manual follow-up, and unclear messaging.
3. Guide: position Ozmo Digital as the partner that understands the pressure and has a clear path forward.
4. Plan: present a simple three-step path: Audit, Build, Optimize.
5. Services: show the connected system of website design, digital marketing, lead capture, automation, and ongoing support.
6. Transformation: contrast scattered digital work with a polished digital engine that captures and nurtures leads.
7. Lead capture: invite the visitor to request the audit through a polished form.

## Site Structure

Build a focused single-page website with smooth section flow.

Sections:

1. Header
   - Ozmo Digital logo.
   - Concise anchor navigation.
   - Persistent audit CTA.

2. Hero
   - High-end StoryBrand headline.
   - Primary CTA: Request Your Digital Growth Audit.
   - Secondary CTA: See How We Help.
   - Generated editorial hero image.

3. Pain Points
   - Name the problems SMB owners experience when their digital presence is fragmented.
   - Keep the section refined, not alarmist.

4. Guide Positioning
   - Establish empathy and authority.
   - Explain that Ozmo Digital brings website, marketing, lead capture, automation, and ongoing support together.

5. Simple Plan
   - Audit: review the current digital presence and lead journey.
   - Build: create the website, messaging, marketing, and automation system.
   - Optimize: refine performance so leads are captured, followed up with, and converted.

6. Service System
   - Website design and redesign.
   - Digital marketing.
   - Lead capture strategy.
   - Automation and follow-up systems.
   - Ongoing support and optimization.

7. Transformation
   - Present a clear before-and-after contrast.
   - Before Ozmo: scattered tools, unclear message, inconsistent follow-up, dated site.
   - After Ozmo: polished presence, clearer leads, connected systems, more time to focus on the business.

8. Audit CTA Band
   - Reinforce the value of the audit.
   - Keep the CTA prominent without hard-sell language.

9. Audit Form
   - Name.
   - Email.
   - Business name.
   - Website URL.
   - Biggest digital challenge.
   - Services of interest.
   - Clear validation, success, and error states.

10. Footer
   - Logo.
   - Short positioning line.
   - Contact or audit CTA.

## Visual Direction

The site must avoid generic agency-template design and overdone visual patterns. It should feel custom, high-end, and attentive to detail.

Use:
- Generous whitespace.
- Strong editorial typography.
- Refined section spacing.
- Asymmetric image placement where useful.
- Subtle interface details that suggest digital systems, lead flow, automation, and marketing performance.
- Restrained cards only where they help organize repeated content.
- Polished hover, focus, and active states.

Avoid:
- Generic agency hero layouts.
- Stock-photo smiles.
- Fake handshake imagery.
- Dark tech cliches.
- Decorative gradient orbs, bokeh blobs, and generic abstract SaaS backgrounds.
- Overly rounded cards or nested-card layouts.
- Copy-heavy feature explanations that tell visitors how to use the site.

## Brand System

Color palette:
- Primary navy: `#1F3A5F`
- Secondary terracotta: `#C1622D`
- Background: `#F5EFE6`
- Ink: `#2A2725`

The implementation may generate tints and shades from this palette as needed, while keeping the site balanced and avoiding a one-note navy or terracotta theme.

Typography:
- Headings: Fraunces 600.
- Body: Karla 400 and 500.

Fraunces should provide editorial warmth and personality. Karla should keep navigation, forms, buttons, and body text grounded and legible.

## Generated Images

Create four generated image assets for the site. They must be saved into the project and used by the implementation. If image generation fails, keep the exact prompts in the project documentation so any temporary visual slots can be replaced later.

Image 1: Hero Image
- Use case: photorealistic-natural.
- Purpose: first impression and brand trust.
- Direction: an editorial scene of a composed small-business owner or founder in a refined workspace, with subtle signs of digital planning, lead flow, and brand strategy.
- Mood: warm natural light, premium but human, trustworthy, not staged.
- Palette cues: navy and terracotta accents should appear naturally through objects, clothing, or workspace details.

Image 2: Pain Point Image
- Use case: photorealistic-natural.
- Purpose: communicate overwhelm with taste and restraint.
- Direction: scattered notes, open laptop, calendar reminders, marketing drafts, website mockups, and lead follow-up tasks.
- Mood: elegant but slightly tense; organized enough to look designed, not messy or chaotic.

Image 3: Systems Image
- Use case: productivity-visual.
- Purpose: show that Ozmo Digital connects the pieces.
- Direction: abstract editorial workspace with website layout sketches, lead notifications, email sequence cards, automation map, and analytics snapshots.
- Mood: tangible, strategic, and clear; not futuristic or sci-fi.

Image 4: Audit CTA Detail
- Use case: photorealistic-natural.
- Purpose: add depth around the audit form without distracting from conversion.
- Direction: quiet close-up detail of a notebook, screen edge, refined desk surface, and brand planning materials.
- Mood: calm, precise, consultative.

General image constraints:
- No visible fake brand names.
- No distorted UI text as a focal point.
- No watermarks.
- No overused corporate stock-photo compositions.
- No exaggerated smiles, handshakes, or call-center imagery.
- Images should work responsively with safe cropping on mobile and desktop.

## Technical Architecture

Build a lightweight static site unless implementation context introduces a stronger reason for a framework.

Default files:
- `index.html`: semantic single-page structure and copy.
- `styles.css`: responsive layout, brand system, typography, and interaction styling.
- `script.js`: anchor behavior, form validation, success state, and small interaction helpers.
- `assets/`: generated image assets and any copied logo asset needed by the site.
- `docs/image-prompts.md`: final image prompts and fallback guidance.

Implementation requirements:
- Use semantic HTML sections with accessible labels.
- Load Fraunces 600 and Karla 400/500 from Google Fonts.
- Preserve the logo from `docs/ref/uploads/ozmo-logo-bo.png`.
- Keep form submission frontend-only for the first version.
- Validate required fields and email format.
- Provide clear success and error states.
- Make the layout responsive for desktop, tablet, and mobile.
- Keep the site portable so it can be opened directly in a browser or served statically.

## Testing And Verification

Behavior checks:
- Audit form requires name, email, business name, and biggest digital challenge.
- Email field rejects invalid email formats.
- Service interest controls can be selected without layout shift.
- Successful submission shows a polished success state and does not navigate away.
- Anchor navigation moves to the correct sections.

Visual checks:
- Desktop, tablet, and mobile layouts do not overlap or clip text.
- Buttons and form controls remain readable at narrow widths.
- Images crop intentionally and do not obscure important content.
- Header, hero, service system, transformation, and audit form feel cohesive.
- The site does not look like a generic agency template.

Technical checks:
- Browser console has no runtime errors.
- Static assets resolve from project paths.
- HTML and CSS pass reasonable static validation.
- Git worktree remains clean except for intentional changes.

## Out Of Scope For First Build

- Backend form submission.
- CRM integration.
- Email automation integration.
- Blog or multi-page content system.
- Real case studies or testimonials.
- Analytics installation.

These can be added later once the first high-end lead-generation site is launched.
