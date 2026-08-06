# Steady Expert Production Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the Steady Expert direction to a polished production-ready root OZMO Digital static site.

**Architecture:** Keep the existing dependency-free static generator, but add a production root render path alongside the archived concept render path. Use shared content data for services/articles and production-specific content/images for the root pages.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js standard library, built-in image generation for project-owned bitmap assets.

## Global Constraints

- Production root pages are `index.html`, `services.html`, `contact.html`, `blog.html`, and `article.html`.
- Keep archived concept work under `concepts/`.
- Root pages must not include prototype/gallery/comparison language.
- Primary CTA is `Schedule a call`; secondary CTA is `Request a site audit`.
- Services must appear in this order: website design/redesign, website care and maintenance, digital marketing/SEO/content, automation/CRM/email workflows.
- Keep the current "Be Brilliant" hero image on the home page.
- Generate and use project-owned realistic production imagery for interior sections.
- Contact forms remain static and must not attempt network submission.
- Run static verification and browser screenshots before committing.

---

## Tasks

### Task 1: Verification Contract

**Files:**
- Modify: `src/verify.js`

**Interfaces:**
- Produces production checks for root pages and archived concept checks for `concepts/`.

- [ ] Add expected root pages: `index.html`, `services.html`, `contact.html`, `blog.html`, `article.html`.
- [ ] Add forbidden root snippets: `Prototype gallery`, `Direction 01`, `Direction 02`, `Direction 03`, `Sample proof`, `prototype direction`, `Back to concept gallery`.
- [ ] Add root page requirements for CTAs, services, static form safety, blog content, and local images.
- [ ] Run `npm test` and confirm it fails before implementation because the current root is still the gallery.

### Task 2: Production Content And Generator

**Files:**
- Modify: `src/content.js`
- Modify: `src/build.js`

**Interfaces:**
- Produces production root pages using relative assets from `assets/`.
- Keeps archived concept pages generated under `concepts/`.

- [ ] Add a production Steady Expert content object with production copy, image paths, and alt text.
- [ ] Add root-aware URL helpers so root pages use `assets/...` and archived concept pages use `../../assets/...`.
- [ ] Render production root pages for Home, Services, Contact, Blog, and Article.
- [ ] Remove production-facing prototype wording from root pages.
- [ ] Keep archived concept pages available under `concepts/`.

### Task 3: Production Imagery

**Files:**
- Create: `assets/img/steady-guide-session.png`
- Create: `assets/img/steady-site-audit.png`
- Create: `assets/img/steady-owner-workflow.png`
- Modify: `src/content.js`

**Interfaces:**
- Production pages consume local image paths only.

- [ ] Generate a realistic advisory working session image.
- [ ] Generate a realistic website audit desk image.
- [ ] Generate a realistic owner workflow image.
- [ ] Move generated assets into `assets/img/`.
- [ ] Reference the images from production root pages.

### Task 4: Production Styling Polish

**Files:**
- Modify: `assets/css/styles.css`

**Interfaces:**
- Styles `.production-site` root pages and preserves archived concept pages.

- [ ] Add root production layout styles for hero, service detail, contact form, blog, and footer.
- [ ] Remove visual prototype cues from root pages.
- [ ] Ensure mobile navigation, form controls, and CTAs fit at 390px width.
- [ ] Keep Steady Expert calm/editorial, not overly card-heavy.

### Task 5: Verification, Review, Commit, Push

**Files:**
- Review all changed files.

**Interfaces:**
- Produces a pushed GitHub commit with the production-ready Steady Expert site.

- [ ] Run `npm run build`.
- [ ] Run `npm test`.
- [ ] Serve locally and capture desktop/mobile screenshots for root pages.
- [ ] Fix any visual or verification issues.
- [ ] Commit and push to `origin/main`.

## Self-Review

- Spec coverage: every production page, image requirement, root replacement, archived concepts, and verification requirement is represented.
- Placeholder scan: this plan uses concrete file paths and does not defer decisions.
- Type consistency: production content is consumed by the existing generator and verified by `src/verify.js`.
