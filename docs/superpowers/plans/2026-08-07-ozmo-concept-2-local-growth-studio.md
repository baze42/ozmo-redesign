# OZMO Concept 2 Local Growth Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete production-testable Concept 2 static site for OZMO Digital under `concepts/02-local-growth-studio/`, while keeping Concept 1 intact and updating the root comparison hub.

**Architecture:** Implement Concept 2 as a self-contained static site with duplicated local assets, HTML, CSS, JavaScript, generated images, and verification coverage. Reuse the proven Concept 1 architecture only as a pattern; do not reference Concept 1 assets at runtime. Tests and `scripts/verify-site.mjs` should support both implemented concepts without weakening Concept 1 coverage.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JavaScript, Node.js `node:test`, `@playwright/test`, local image generation and WebP derivative generation.

## Global Constraints

- Use the OZMO design system in `docs/ref` as the source of truth.
- Approved Concept 2 spec: `docs/superpowers/specs/2026-08-07-ozmo-concept-2-local-growth-studio-design.md`.
- Primary lead action: `Request a site audit`.
- Primary positioning for Concept 2: local website and marketing studio for businesses that need clearer visibility, stronger trust, and a steadier lead path.
- Tone: warm, practical, local, energetic, and relationship-driven.
- Build Concept 2 at `concepts/02-local-growth-studio/`.
- Required Concept 2 pages: `index.html`, `services.html`, `site-audit.html`, `about.html`, `insights.html`, `contact.html`.
- Root `index.html` remains a private comparison hub, not the final marketing homepage.
- Concept 2 must be self-contained and must not rely on Concept 1 CSS, JavaScript, image files, or generated assets.
- Copy logo assets from `docs/ref/assets` into `concepts/02-local-growth-studio/assets/logos/`.
- Use navy `#1F3A5F` as the trust anchor.
- Use terracotta `#C1622D` more visibly than Concept 1 through section accents, badges, small dividers, and warm CTA treatments.
- Use cream `#F5EFE6` and paper `#FBF8F2` as the main page and raised surfaces.
- Use spark orange `#F05000` only for one high-emphasis lead action or tiny energy detail per view.
- Use Fraunces for major headlines and large owner-outcome numbers.
- Use Karla for body, navigation, UI, forms, and labels.
- Use IBM Plex Mono only for small metadata, location-like labels, audit labels, and system details.
- Use gentle motion only: rise-in, underline wipe, soft button lift, and subtle spark pulse.
- Use Lucide-style line icons where icons clarify services, outcomes, or local growth stages.
- Do not implement a CMS, CRM integration, analytics stack, payment flow, scheduling integration, or backend submission handler.
- Do not invent fake testimonials, fake clients, fake awards, fake verified results, contact recipients, or backend endpoints.
- Do not use lorem ipsum.
- If JavaScript is unavailable and no production endpoint is approved, source form submission must be explicitly unavailable without sending data.
- If no endpoint is configured and JavaScript is enabled, forms must not make a network request and should use an in-page static-review success state.
- Required generated image targets: `hero-local-growth.png`, `local-search-map.png`, `owner-welcome.png`, `community-planning.png`, `marketing-rhythm.png`.
- Each generated PNG must have a smaller WebP delivery derivative.
- Motion must respect `prefers-reduced-motion`.
- All public pages must avoid fake testimonials, fake client names, unverifiable claims, lorem ipsum, and unfinished notes.

---

## File Structure

Create or modify these files:

- Modify: `index.html` - root comparison hub links Concept 2 and keeps Concept 3 marked coming next.
- Modify: `scripts/verify-site.mjs` - verifies all implemented concept directories.
- Modify: `tests/static-contract.test.mjs` - adds Concept 2 structural and root-hub contracts.
- Modify: `tests/content-contract.test.mjs` - adds Concept 2 StoryBrand, page, service-order, and forbidden-copy contracts.
- Modify: `tests/style-contract.test.mjs` - adds Concept 2 design-system and contrast contracts.
- Modify: `tests/form-contract.test.cjs` - adds Concept 2 form helper and source-state contracts.
- Modify: `tests/asset-contract.test.mjs` - adds Concept 2 image and prompt contracts.
- Modify: `tests/browser.spec.mjs` - extends browser checks to both concepts and adds Concept 2 screenshots.
- Create: `concepts/02-local-growth-studio/index.html`.
- Create: `concepts/02-local-growth-studio/services.html`.
- Create: `concepts/02-local-growth-studio/site-audit.html`.
- Create: `concepts/02-local-growth-studio/about.html`.
- Create: `concepts/02-local-growth-studio/insights.html`.
- Create: `concepts/02-local-growth-studio/contact.html`.
- Create: `concepts/02-local-growth-studio/assets/css/styles.css`.
- Create: `concepts/02-local-growth-studio/assets/js/site.js`.
- Create: `concepts/02-local-growth-studio/assets/img/prompts.md`.
- Create: `concepts/02-local-growth-studio/assets/img/hero-local-growth.png`.
- Create: `concepts/02-local-growth-studio/assets/img/hero-local-growth.webp`.
- Create: `concepts/02-local-growth-studio/assets/img/local-search-map.png`.
- Create: `concepts/02-local-growth-studio/assets/img/local-search-map.webp`.
- Create: `concepts/02-local-growth-studio/assets/img/owner-welcome.png`.
- Create: `concepts/02-local-growth-studio/assets/img/owner-welcome.webp`.
- Create: `concepts/02-local-growth-studio/assets/img/community-planning.png`.
- Create: `concepts/02-local-growth-studio/assets/img/community-planning.webp`.
- Create: `concepts/02-local-growth-studio/assets/img/marketing-rhythm.png`.
- Create: `concepts/02-local-growth-studio/assets/img/marketing-rhythm.webp`.
- Create: copied logo assets under `concepts/02-local-growth-studio/assets/logos/`.

---

### Task 1: Concept 2 Scaffold And Multi-Concept Static Contracts

**Files:**
- Modify: `index.html`
- Modify: `tests/static-contract.test.mjs`
- Create: `concepts/02-local-growth-studio/index.html`
- Create: `concepts/02-local-growth-studio/services.html`
- Create: `concepts/02-local-growth-studio/site-audit.html`
- Create: `concepts/02-local-growth-studio/about.html`
- Create: `concepts/02-local-growth-studio/insights.html`
- Create: `concepts/02-local-growth-studio/contact.html`
- Create: `concepts/02-local-growth-studio/assets/css/styles.css`
- Create: `concepts/02-local-growth-studio/assets/js/site.js`
- Create: `concepts/02-local-growth-studio/assets/img/prompts.md`
- Create: `concepts/02-local-growth-studio/assets/logos/*`

**Interfaces:**
- Consumes: Concept 2 spec and the existing Concept 1 file layout.
- Produces: required Concept 2 directory tree, copied logo assets, root-hub link, and structural tests that later tasks fill with content and styling.

- [ ] **Step 1: Write the failing static contract**

Update `tests/static-contract.test.mjs` so it defines reusable concept metadata:

```js
const concepts = [
  { slug: '01-digital-operations-partner', label: 'Digital Operations Partner' },
  { slug: '02-local-growth-studio', label: 'Local Growth Studio' },
];
const requiredPages = ['index.html', 'services.html', 'site-audit.html', 'about.html', 'insights.html', 'contact.html'];
const requiredLogos = ['ozmo-logo-cream.png', 'ozmo-logo-full.png', 'ozmo-logo-ink.png', 'ozmo-logo-navy.png', 'ozmo-logo-white.png', 'ozmo-mark.png'];
```

Add a test named `concept 2 is linked from the comparison hub and concept 3 remains queued`:

```js
test('concept 2 is linked from the comparison hub and concept 3 remains queued', () => {
  const html = read('index.html');
  assert.match(html, /concepts\/02-local-growth-studio\/index\.html/);
  assert.match(html, /Local Growth Studio/i);
  assert.match(html, /Website Care \+ Redesign Specialist/i);
  assert.match(html, /Concept 03/i);
  assert.match(html, /Coming next/i);
});
```

Add a test named `implemented concepts contain the required deployable pages and self-contained assets`:

```js
test('implemented concepts contain the required deployable pages and self-contained assets', () => {
  for (const concept of concepts) {
    const root = path.join(repoRoot, 'concepts', concept.slug);
    for (const page of requiredPages) {
      const file = path.join(root, page);
      assert.ok(fs.existsSync(file), `${concept.slug}/${page} should exist`);
      const html = fs.readFileSync(file, 'utf8');
      assert.match(html, /<header\b/i, `${concept.slug}/${page} should include a header landmark`);
      assert.match(html, /<main\b/i, `${concept.slug}/${page} should include a main landmark`);
      assert.match(html, /<footer\b/i, `${concept.slug}/${page} should include a footer landmark`);
      assert.match(html, /assets\/css\/styles\.css/i, `${concept.slug}/${page} should reference local CSS`);
      assert.match(html, /assets\/js\/site\.js/i, `${concept.slug}/${page} should reference local JS`);
      assert.doesNotMatch(html, /\.\.\/01-digital-operations-partner|01-digital-operations-partner\/assets/i, `${concept.slug}/${page} should not use Concept 1 assets`);
    }
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/static-contract.test.mjs
```

Expected: FAIL because `concepts/02-local-growth-studio/` and the root hub link do not exist yet.

- [ ] **Step 3: Implement the minimal scaffold**

Create the directory tree, copy logo files from `docs/ref/assets`, and create six minimal HTML shells. Each shell must include:

```html
<link rel="stylesheet" href="assets/css/styles.css">
<header class="site-header"></header>
<main id="main-content"></main>
<footer class="site-footer"></footer>
<script src="assets/js/site.js"></script>
```

Update the Concept 2 card in root `index.html` to link to:

```html
href="concepts/02-local-growth-studio/index.html"
```

Keep the Concept 3 card non-linked and visibly marked `Coming next`.

- [ ] **Step 4: Run the static contract**

Run:

```bash
node --test tests/static-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/static-contract.test.mjs concepts/02-local-growth-studio
git commit -m "Add Concept 2 static scaffold"
```

---

### Task 2: Concept 2 StoryBrand Content

**Files:**
- Modify: `concepts/02-local-growth-studio/index.html`
- Modify: `concepts/02-local-growth-studio/services.html`
- Modify: `concepts/02-local-growth-studio/site-audit.html`
- Modify: `concepts/02-local-growth-studio/about.html`
- Modify: `concepts/02-local-growth-studio/insights.html`
- Modify: `concepts/02-local-growth-studio/contact.html`
- Modify: `tests/content-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1 page shells.
- Produces: complete public copy, nav/footer, semantic page sections, form field markup with disabled source submit controls, and content contracts for Concept 2.

- [ ] **Step 1: Write the failing content contracts**

Add Concept 2 helpers to `tests/content-contract.test.mjs`:

```js
const concept2Root = path.join(repoRoot, 'concepts', '02-local-growth-studio');
function html2(page) {
  return fs.readFileSync(path.join(concept2Root, page), 'utf8');
}
```

Add `concept 2 home follows the local growth StoryBrand flow` requiring:

```js
[
  'Help more local customers find, trust, and choose you',
  'Be easier to find',
  'Be easier to trust',
  'Be easier to choose',
  'Local growth gets harder when the path is unclear',
  'A practical studio for the website, content, and follow-up behind local growth',
  'Website design for local trust',
  'Local SEO and service-page clarity',
  'Content and campaign support',
  'Lead follow-up and simple automation',
  'Request a site audit',
  'See the clearest local growth opportunities',
  'Build the website, content, and follow-up rhythm'
]
```

Add `concept 2 pages include required local growth content` requiring the audit checklist items, about phrase `we do what we do so you can better do what you do`, insights topics, and contact form labels from the spec.

Add `concept 2 public copy avoids forbidden proof and draft language` using the same forbidden patterns as Concept 1.

- [ ] **Step 2: Run the content contracts to verify failure**

Run:

```bash
node --test tests/content-contract.test.mjs
```

Expected: FAIL because the shells do not contain Concept 2 copy.

- [ ] **Step 3: Write the six Concept 2 pages**

Use the same semantic structure as Concept 1 and the same nav labels:

```text
Home
Services
Site audit
About
Insights
Contact
```

Use these required hero headlines:

```text
Home: Help more local customers find, trust, and choose you.
Services: Practical website and marketing support for local growth.
Site audit: Find the clearest opportunities to earn more local trust.
About: The studio behind clearer local growth.
Insights: Practical growth notes for local business owners.
Contact: Start with the local growth question in front of you.
```

Use disabled source submit buttons in forms:

```html
<button class="button button-primary" data-enhanced-submit disabled type="button">Request a site audit</button>
<button class="button button-primary" data-enhanced-submit disabled type="button">Send message</button>
```

Use generated image references as `<picture>` wrappers, even before real images exist:

```html
<picture>
  <source srcset="assets/img/hero-local-growth.webp" type="image/webp">
  <img src="assets/img/hero-local-growth.png" width="1536" height="1024" alt="A local business owner and digital advisor reviewing a website and growth plan">
</picture>
```

- [ ] **Step 4: Run content contracts**

Run:

```bash
node --test tests/content-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add concepts/02-local-growth-studio/*.html tests/content-contract.test.mjs
git commit -m "Add Concept 2 local growth content"
```

---

### Task 3: Concept 2 Visual System And Form Behavior

**Files:**
- Modify: `concepts/02-local-growth-studio/assets/css/styles.css`
- Modify: `concepts/02-local-growth-studio/assets/js/site.js`
- Modify: `tests/style-contract.test.mjs`
- Modify: `tests/form-contract.test.cjs`

**Interfaces:**
- Consumes: Task 2 HTML with nav, forms, sections, and data attributes.
- Produces: Concept 2 local visual treatment and hardened form/navigation JavaScript compatible with browser tests.

- [ ] **Step 1: Write failing style and form contracts**

In `tests/style-contract.test.mjs`, add Concept 2 CSS loading:

```js
const concept2Css = fs.readFileSync(path.join(repoRoot, 'concepts/02-local-growth-studio/assets/css/styles.css'), 'utf8');
```

Add `concept 2 CSS implements the local growth design contract` asserting:

```js
for (const token of ['#1F3A5F', '#C1622D', '#F5EFE6', '#FBF8F2', '#F05000', 'Fraunces', 'Karla', 'IBM Plex Mono']) {
  assert.match(concept2Css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}
assert.match(concept2Css, /local-proof|growth-path|neighborhood|community|warm-accent/i);
assert.match(concept2Css, /html\.js\s+\.nav-menu\s*\{[^}]*display:\s*none\s*;/);
assert.doesNotMatch(concept2Css, /blur\(|glassmorphism|orb|bokeh/i);
```

In `tests/form-contract.test.cjs`, require Concept 2 JS:

```js
const concept2Module = require(path.resolve(__dirname, '../concepts/02-local-growth-studio/assets/js/site.js'));
```

Add tests that assert:

```js
assert.deepEqual(concept2Module.FORM_ENDPOINTS, { audit: '', contact: '' });
assert.equal(typeof concept2Module.OZMOForms.validateFields, 'function');
assert.equal(typeof concept2Module.OZMOForms.formDataToObject, 'function');
```

Add Concept 2 source-form assertions matching the final Concept 1 disabled source state.

- [ ] **Step 2: Run targeted tests to verify failure**

Run:

```bash
node --test tests/style-contract.test.mjs tests/form-contract.test.cjs
```

Expected: FAIL because Concept 2 CSS and JS are empty or incomplete.

- [ ] **Step 3: Implement Concept 2 CSS**

Use Concept 1 CSS as a proven starting pattern, but make these Concept 2 differences explicit:

```css
.growth-path { display: grid; gap: 1rem; }
.local-proof { border-top: 3px solid var(--terracotta); }
.neighborhood-band { background: var(--terracotta-100); }
.warm-accent { color: var(--terracotta-700); }
```

Keep:

```css
html.js .nav-menu { display: none; }
html.js .nav-menu.is-open { display: flex; }
.form-status:empty, .error-message:empty { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
```

Ensure `.button-secondary` and `.button-energy` define foreground and background colors with at least 4.5:1 contrast.

- [ ] **Step 4: Implement Concept 2 JS**

Use the final Concept 1 `assets/js/site.js` behavior as the interface:

```js
const FORM_ENDPOINTS = {
  audit: '',
  contact: '',
};
```

Ensure `enhanceForms(documentRef)`:

```js
form.setAttribute('novalidate', '');
for (const button of form.querySelectorAll('[data-enhanced-submit]')) {
  button.type = 'submit';
  button.disabled = false;
}
```

Export:

```js
return {
  FORM_ENDPOINTS,
  OZMOForms: { validateFields, formDataToObject, submitForm, enhanceForms, enhanceNavigation },
};
```

- [ ] **Step 5: Run targeted tests**

Run:

```bash
node --test tests/style-contract.test.mjs tests/form-contract.test.cjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add concepts/02-local-growth-studio/assets/css/styles.css concepts/02-local-growth-studio/assets/js/site.js tests/style-contract.test.mjs tests/form-contract.test.cjs
git commit -m "Add Concept 2 visual system and forms"
```

---

### Task 4: Concept 2 Generated Imagery And Asset Contracts

**Files:**
- Create: `concepts/02-local-growth-studio/assets/img/hero-local-growth.png`
- Create: `concepts/02-local-growth-studio/assets/img/hero-local-growth.webp`
- Create: `concepts/02-local-growth-studio/assets/img/local-search-map.png`
- Create: `concepts/02-local-growth-studio/assets/img/local-search-map.webp`
- Create: `concepts/02-local-growth-studio/assets/img/owner-welcome.png`
- Create: `concepts/02-local-growth-studio/assets/img/owner-welcome.webp`
- Create: `concepts/02-local-growth-studio/assets/img/community-planning.png`
- Create: `concepts/02-local-growth-studio/assets/img/community-planning.webp`
- Create: `concepts/02-local-growth-studio/assets/img/marketing-rhythm.png`
- Create: `concepts/02-local-growth-studio/assets/img/marketing-rhythm.webp`
- Modify: `concepts/02-local-growth-studio/assets/img/prompts.md`
- Modify: `tests/asset-contract.test.mjs`

**Interfaces:**
- Consumes: Concept 2 HTML image references from Task 2.
- Produces: generated PNGs, smaller WebP derivatives, and prompt documentation.

- [ ] **Step 1: Write failing asset contracts**

In `tests/asset-contract.test.mjs`, add Concept 2 required images:

```js
const concept2Root = path.join(repoRoot, 'concepts', '02-local-growth-studio');
const concept2Images = ['hero-local-growth', 'local-search-map', 'owner-welcome', 'community-planning', 'marketing-rhythm'];
```

Add a test named `concept 2 required image targets exist with smaller WebP derivatives`:

```js
for (const image of concept2Images) {
  const png = path.join(concept2Root, 'assets/img', `${image}.png`);
  const webp = path.join(concept2Root, 'assets/img', `${image}.webp`);
  assert.ok(fs.existsSync(png), `${image}.png should exist`);
  assert.ok(fs.existsSync(webp), `${image}.webp should exist`);
  assert.ok(fs.statSync(png).size > 0, `${image}.png should be non-empty`);
  assert.ok(fs.statSync(webp).size > 0, `${image}.webp should be non-empty`);
  assert.ok(fs.statSync(webp).size < fs.statSync(png).size, `${image}.webp should be smaller than PNG`);
}
```

Add prompt assertions for each image name and `no readable text`, `no logos`, and `no watermark`.

- [ ] **Step 2: Run asset test to verify failure**

Run:

```bash
node --test tests/asset-contract.test.mjs
```

Expected: FAIL because Concept 2 images do not exist yet.

- [ ] **Step 3: Generate the five PNG images**

Use the image prompts from the Concept 2 spec exactly, with no readable words, no logos, and no watermark.

Save the PNG files to `concepts/02-local-growth-studio/assets/img/`.

- [ ] **Step 4: Create WebP derivatives**

Use local tooling such as `cwebp`, `magick`, `ffmpeg`, `sharp`, or the existing Playwright canvas approach to produce smaller WebP files. Confirm:

```bash
ls -lh concepts/02-local-growth-studio/assets/img/*.{png,webp}
```

- [ ] **Step 5: Write prompt documentation**

Write `concepts/02-local-growth-studio/assets/img/prompts.md` with one section per image and the exact prompt text from the spec.

- [ ] **Step 6: Run asset test**

Run:

```bash
node --test tests/asset-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add concepts/02-local-growth-studio/assets/img tests/asset-contract.test.mjs
git commit -m "Add Concept 2 local growth imagery"
```

---

### Task 5: Multi-Concept Static And Browser Verification

**Files:**
- Modify: `scripts/verify-site.mjs`
- Modify: `tests/browser.spec.mjs`
- Modify: `tests/static-contract.test.mjs`
- Modify: `tests/content-contract.test.mjs`
- Modify: `tests/style-contract.test.mjs`
- Modify: `tests/form-contract.test.cjs`
- Modify: `tests/asset-contract.test.mjs`

**Interfaces:**
- Consumes: complete Concept 2 pages, CSS, JS, and images.
- Produces: deterministic verification for both implemented concepts.

- [ ] **Step 1: Write failing verification updates**

Update `scripts/verify-site.mjs` to define:

```js
const concepts = [
  {
    label: 'Concept 1',
    root: path.join(repoRoot, 'concepts', '01-digital-operations-partner'),
    assets: ['assets/img/hero-digital-operations.png', 'assets/img/audit-desk.png', 'assets/img/systems-map.png', 'assets/img/owner-focus.png', 'assets/img/insights-workshop.png'],
  },
  {
    label: 'Concept 2',
    root: path.join(repoRoot, 'concepts', '02-local-growth-studio'),
    assets: ['assets/img/hero-local-growth.png', 'assets/img/local-search-map.png', 'assets/img/owner-welcome.png', 'assets/img/community-planning.png', 'assets/img/marketing-rhythm.png'],
  },
];
```

Update `tests/browser.spec.mjs` so its `concepts` list includes:

```js
{ name: 'Concept 2', path: '/concepts/02-local-growth-studio', auditButton: /request a site audit/i, screenshotPrefix: 'concept-2-local-growth' }
```

Add a Concept 2 browser test for:

```text
enhanced static audit submissions show success, reset, and stay offline
valid no-JavaScript contact form cannot submit, navigate, or send data
JavaScript-enabled mobile menu expands and follows its Services link
settled desktop and mobile screenshots can be captured over local HTTP
```

- [ ] **Step 2: Run verification to verify failure**

Run:

```bash
npm run verify
npm run test:browser -- --reporter=list
```

Expected: FAIL until Concept 2 paths and browser helpers are fully wired.

- [ ] **Step 3: Implement verification helpers**

Make browser helpers concept-aware:

```js
async function gotoConceptPage(page, concept, name) {
  await page.goto(`${baseUrl}${concept.path}/${name}`, { waitUntil: 'networkidle' });
}
```

Make screenshot paths distinct:

```js
artifacts/screenshots/${concept.screenshotPrefix}-home-desktop.png
artifacts/screenshots/${concept.screenshotPrefix}-home-mobile.png
```

Keep the existing local HTTP server and `settleForScreenshot()` lazy image decode behavior.

- [ ] **Step 4: Run full verification**

Run:

```bash
npm test
npm run verify
npm run test:browser -- --reporter=list
git diff --check
```

Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-site.mjs tests
git commit -m "Verify Concept 2 across static and browser checks"
```

---

### Task 6: Final Review, Ledger, And Push

**Files:**
- Modify: `.superpowers/sdd/progress.md` if present and ignored.
- No production files should change unless review finds a Critical or Important issue.

**Interfaces:**
- Consumes: all Concept 2 commits and verification output.
- Produces: final code review approval, clean `main`, and pushed GitHub state.

- [ ] **Step 1: Run fresh final verification**

Run:

```bash
npm test
npm run verify
npm run test:browser -- --reporter=list
git diff --check
git status --short
```

Expected: tests pass and status is clean.

- [ ] **Step 2: Run final whole-branch review**

Generate a review package:

```bash
/root/.codex/skills/subagent-driven-development/scripts/review-package b0501fba9cc7f28fe3ee426a52a63b2a06be0be5 HEAD
```

Dispatch a read-only reviewer with:

```text
Spec: docs/superpowers/specs/2026-08-07-ozmo-concept-2-local-growth-studio-design.md
Plan: docs/superpowers/plans/2026-08-07-ozmo-concept-2-local-growth-studio.md
Range: b0501fb..HEAD
Verification: npm test, npm run verify, npm run test:browser -- --reporter=list, git diff --check
```

- [ ] **Step 3: Fix any Critical or Important review findings**

Use TDD for each finding. Re-run targeted tests, full verification, and re-review until no Critical or Important issues remain.

- [ ] **Step 4: Record completion**

Append to `.superpowers/sdd/progress.md`:

```text
Concept 2: complete (review approved, pushed to main)
```

- [ ] **Step 5: Push**

Run:

```bash
git status --short
git push origin main
```

Expected: `main -> main` push succeeds.
