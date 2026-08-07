# OZMO Concept 3 Website Care + Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete production-testable Concept 3 static site for OZMO Digital under `concepts/03-website-care-redesign/`, while keeping Concepts 1 and 2 intact and updating the root comparison hub.

**Architecture:** Implement Concept 3 as a self-contained static site with duplicated local assets, HTML, CSS, JavaScript, generated images, and verification coverage. Reuse the proven Concept 1 and Concept 2 architecture only as a pattern; do not reference either concept's runtime assets. Tests and `scripts/verify-site.mjs` should support all three implemented concepts without weakening existing Concept 1 or Concept 2 coverage.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JavaScript, Node.js `node:test`, `@playwright/test`, built-in image generation, local PNG/WebP normalization.

## Global Constraints

- Use the OZMO design system in `docs/ref` as the source of truth.
- Approved Concept 3 spec: `docs/superpowers/specs/2026-08-07-ozmo-concept-3-website-care-redesign-design.md`.
- Primary lead action: `Request a site audit`.
- Primary positioning for Concept 3: website redesign and care specialist for businesses that know the website is the weak link.
- Tone: focused, clear, practical, conversion-minded, and easy to understand quickly.
- Build Concept 3 at `concepts/03-website-care-redesign/`.
- Required Concept 3 pages: `index.html`, `services.html`, `site-audit.html`, `about.html`, `insights.html`, `contact.html`.
- Root `index.html` remains a private comparison hub, not the final marketing homepage.
- Concept 3 must be self-contained and must not rely on Concept 1 or Concept 2 CSS, JavaScript, image files, or generated assets.
- Copy logo assets from `docs/ref/assets` into `concepts/03-website-care-redesign/assets/logos/`.
- Use navy `#1F3A5F` as the trust anchor.
- Use terracotta `#C1622D` as the primary warm action and repair/accent color.
- Use cream `#F5EFE6` and paper `#FBF8F2` as the main page and raised surfaces.
- Use spark orange `#F05000` only for one high-emphasis audit CTA or tiny readiness indicator per view.
- Use Fraunces for major headlines, page titles, and important owner-outcome statements.
- Use Karla for body, navigation, UI, forms, and labels.
- Use IBM Plex Mono only for audit labels, care-plan metadata, small readiness markers, and system details.
- Use gentle motion only: rise-in, underline wipe, soft button lift, and subtle spark pulse.
- Use Lucide-style line icons where icons clarify redesign, care, conversion, maintenance, or follow-up categories.
- Do not implement a CMS, CRM integration, analytics stack, payment flow, scheduling integration, or backend submission handler.
- Do not invent fake testimonials, fake clients, fake awards, fake scores, fake results, contact recipients, or backend endpoints.
- Do not use lorem ipsum.
- If JavaScript is unavailable and no production endpoint is approved, source form submission must be explicitly unavailable without sending data.
- If no endpoint is configured and JavaScript is enabled, forms must not make a network request and should use an in-page static-review success state.
- Required generated image targets: `hero-website-redesign.png`, `redesign-review.png`, `care-checklist.png`, `conversion-path.png`, `launch-workshop.png`.
- Each generated PNG must have a smaller WebP delivery derivative.
- Motion must respect `prefers-reduced-motion`.
- All public pages must avoid fake testimonials, fake client names, unverifiable claims, lorem ipsum, and unfinished notes.

---

## File Structure

Create or modify these files:

- Modify: `index.html` - root comparison hub links Concept 3.
- Modify: `scripts/verify-site.mjs` - verifies all three implemented concept directories.
- Modify: `tests/static-contract.test.mjs` - adds Concept 3 structural and root-hub contracts.
- Modify: `tests/content-contract.test.mjs` - adds Concept 3 StoryBrand, page, service-order, and forbidden-copy contracts.
- Modify: `tests/style-contract.test.mjs` - adds Concept 3 design-system, icon, contrast, focus, and anchor contracts.
- Modify: `tests/form-contract.test.cjs` - adds Concept 3 form helper and source-state contracts.
- Modify: `tests/asset-contract.test.mjs` - adds Concept 3 image and prompt contracts.
- Modify: `tests/browser.spec.mjs` - extends browser checks and screenshots to Concept 3.
- Create: `concepts/03-website-care-redesign/index.html`.
- Create: `concepts/03-website-care-redesign/services.html`.
- Create: `concepts/03-website-care-redesign/site-audit.html`.
- Create: `concepts/03-website-care-redesign/about.html`.
- Create: `concepts/03-website-care-redesign/insights.html`.
- Create: `concepts/03-website-care-redesign/contact.html`.
- Create: `concepts/03-website-care-redesign/assets/css/styles.css`.
- Create: `concepts/03-website-care-redesign/assets/js/site.js`.
- Create: `concepts/03-website-care-redesign/assets/img/prompts.md`.
- Create: `concepts/03-website-care-redesign/assets/img/hero-website-redesign.png`.
- Create: `concepts/03-website-care-redesign/assets/img/hero-website-redesign.webp`.
- Create: `concepts/03-website-care-redesign/assets/img/redesign-review.png`.
- Create: `concepts/03-website-care-redesign/assets/img/redesign-review.webp`.
- Create: `concepts/03-website-care-redesign/assets/img/care-checklist.png`.
- Create: `concepts/03-website-care-redesign/assets/img/care-checklist.webp`.
- Create: `concepts/03-website-care-redesign/assets/img/conversion-path.png`.
- Create: `concepts/03-website-care-redesign/assets/img/conversion-path.webp`.
- Create: `concepts/03-website-care-redesign/assets/img/launch-workshop.png`.
- Create: `concepts/03-website-care-redesign/assets/img/launch-workshop.webp`.
- Create: copied logo assets under `concepts/03-website-care-redesign/assets/logos/`.

---

### Task 1: Concept 3 Scaffold And Static Contracts

**Files:**
- Modify: `index.html`
- Modify: `tests/static-contract.test.mjs`
- Create: `concepts/03-website-care-redesign/index.html`
- Create: `concepts/03-website-care-redesign/services.html`
- Create: `concepts/03-website-care-redesign/site-audit.html`
- Create: `concepts/03-website-care-redesign/about.html`
- Create: `concepts/03-website-care-redesign/insights.html`
- Create: `concepts/03-website-care-redesign/contact.html`
- Create: `concepts/03-website-care-redesign/assets/css/styles.css`
- Create: `concepts/03-website-care-redesign/assets/js/site.js`
- Create: `concepts/03-website-care-redesign/assets/img/prompts.md`
- Create: `concepts/03-website-care-redesign/assets/logos/*`

**Interfaces:**
- Consumes: Concept 3 spec and the existing Concept 1/2 file layout.
- Produces: required Concept 3 directory tree, copied logo assets, root-hub link, and structural tests that later tasks fill with content and styling.

- [ ] **Step 1: Write the failing static contract**

Update `tests/static-contract.test.mjs` so the `concepts` array includes Concept 3:

```js
const concepts = [
  { slug: '01-digital-operations-partner', label: 'Digital Operations Partner' },
  { slug: '02-local-growth-studio', label: 'Local Growth Studio' },
  { slug: '03-website-care-redesign', label: 'Website Care + Redesign Specialist' },
];
```

Add a test named `concept 3 is linked from the comparison hub`:

```js
test('concept 3 is linked from the comparison hub', () => {
  const html = read('index.html');
  assert.match(html, /concepts\/03-website-care-redesign\/index\.html/);
  assert.match(html, /Website Care \+ Redesign Specialist/i);
  assert.match(html, /Concept 03/i);
  assert.doesNotMatch(html, /Coming next/i);
});
```

Keep the existing deployable pages/assets loop. It should automatically require Concept 3 pages, skip links, local CSS, local JS, footers, and copied logos after the array is updated.

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/static-contract.test.mjs
```

Expected: FAIL because `concepts/03-website-care-redesign/` and the root hub link do not exist yet.

- [ ] **Step 3: Implement the minimal scaffold**

Create the directory tree:

```bash
mkdir -p concepts/03-website-care-redesign/assets/{css,js,img,logos}
cp docs/ref/assets/*.png concepts/03-website-care-redesign/assets/logos/
```

Create six minimal HTML shells. Each shell must include:

```html
<body data-page="home">
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header"></header>
  <main id="main-content"></main>
  <footer class="site-footer"><a href="index.html"><img src="assets/logos/ozmo-logo-cream.png" width="160" height="49" alt="OZMO Digital"></a></footer>
  <script src="assets/js/site.js"></script>
</body>
```

Create `assets/css/styles.css` with a comment and `assets/js/site.js` with a no-op CommonJS-safe module:

```js
(function (root) {
  const FORM_ENDPOINTS = { audit: '', contact: '' };
  const OZMOForms = {};
  if (typeof module !== 'undefined' && module.exports) module.exports = { FORM_ENDPOINTS, OZMOForms };
  root.FORM_ENDPOINTS = FORM_ENDPOINTS;
  root.OZMOForms = OZMOForms;
}(typeof window !== 'undefined' ? window : globalThis));
```

Update the root Concept 3 card to:

```html
<a class="concept-card is-live" href="concepts/03-website-care-redesign/index.html">
  <span class="eyebrow">Concept 03</span>
  <h2>Website Care + Redesign Specialist</h2>
  <p>Focused, clear, conversion-minded, and built around redesigning and caring for the website behind a stronger lead path.</p>
  <span class="text-link">Review concept</span>
</a>
```

- [ ] **Step 4: Run the static contract**

Run:

```bash
node --test tests/static-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html tests/static-contract.test.mjs concepts/03-website-care-redesign
git commit -m "Add Concept 3 static scaffold"
```

---

### Task 2: Concept 3 StoryBrand Content

**Files:**
- Modify: `concepts/03-website-care-redesign/index.html`
- Modify: `concepts/03-website-care-redesign/services.html`
- Modify: `concepts/03-website-care-redesign/site-audit.html`
- Modify: `concepts/03-website-care-redesign/about.html`
- Modify: `concepts/03-website-care-redesign/insights.html`
- Modify: `concepts/03-website-care-redesign/contact.html`
- Modify: `tests/content-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1 page shells.
- Produces: complete public copy, nav/footer, semantic page sections, form field markup with disabled source submit controls, and content contracts for Concept 3.

- [ ] **Step 1: Write the failing content contracts**

Add Concept 3 helpers to `tests/content-contract.test.mjs`:

```js
const concept3Root = path.join(repoRoot, 'concepts', '03-website-care-redesign');
function html3(page) {
  return fs.readFileSync(path.join(concept3Root, page), 'utf8');
}
```

Add `concept 3 home follows the website care and redesign StoryBrand flow` requiring:

```js
[
  'Turn an outdated website into a clearer path to better leads',
  'Look current',
  'Make action easier',
  'Stay cared for',
  'Your website should not make people hesitate',
  'A practical specialist for redesign, care, and clearer lead paths',
  'Website redesign and message clarity',
  'Conversion paths and service-page structure',
  'Website care and maintenance',
  'Supporting marketing and follow-up',
  'Request a site audit',
  'See what needs redesign, repair, or care first',
  'Launch a clearer website and keep it working'
]
```

Add `concept 3 pages include required website care and redesign content` requiring:

```js
[
  'First impression and message clarity',
  'Mobile usability and speed cues',
  'Service-page structure',
  'Call-to-action and inquiry path',
  'Trust signals and proof readiness',
  'Care, security, and maintainability',
  'Content freshness and update rhythm',
  'What is not working on your website right now?',
  'Five signs your website is costing you good leads',
  'What to fix before you start a redesign',
  'What a healthy website care plan should include',
  'Why conversion paths matter more than visual polish alone',
  'How follow-up keeps good website inquiries from going quiet'
]
```

Add service-order assertions for:

```js
[
  'Website redesign and message clarity',
  'Conversion paths and service-page structure',
  'Website care and maintenance',
  'Supporting marketing and follow-up'
]
```

Add forbidden-copy checks using the same patterns as the other concepts.

- [ ] **Step 2: Run the content contracts to verify failure**

Run:

```bash
node --test tests/content-contract.test.mjs
```

Expected: FAIL because the shells do not contain Concept 3 copy.

- [ ] **Step 3: Write the six Concept 3 pages**

Use the same nav labels across all pages:

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
Home: Turn an outdated website into a clearer path to better leads.
Services: Website redesign and care that keep the next step clear.
Site audit: See what your website needs before you redesign, repair, or promote it.
About: The team that redesigns and cares for the website behind your business.
Insights: Practical notes for better websites and steadier care.
Contact: Talk through the website problem in front of you.
```

Use disabled source submit buttons in forms:

```html
<button class="button button-primary" data-enhanced-submit disabled type="button">Request a site audit</button>
<button class="button button-primary" data-enhanced-submit disabled type="button">Send message</button>
```

Use generated image references as `<picture>` wrappers, even before real images exist:

```html
<picture>
  <source srcset="assets/img/hero-website-redesign.webp" type="image/webp">
  <img src="assets/img/hero-website-redesign.png" width="1536" height="1024" alt="A business owner and advisor reviewing a refreshed website layout">
</picture>
```

Use topic links on Insights, not inert buttons:

```html
<nav class="topic-filters" aria-label="Insight topics"><a href="#website-redesign">Website redesign</a><a href="#website-care">Website care</a><a href="#service-pages">Service pages</a><a href="#conversion-paths">Conversion paths</a><a href="#follow-up">Follow-up</a></nav>
```

- [ ] **Step 4: Run content contracts**

Run:

```bash
node --test tests/content-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add concepts/03-website-care-redesign/*.html tests/content-contract.test.mjs
git commit -m "Add Concept 3 website care content"
```

---

### Task 3: Concept 3 Visual System And Form Behavior

**Files:**
- Modify: `concepts/03-website-care-redesign/assets/css/styles.css`
- Modify: `concepts/03-website-care-redesign/assets/js/site.js`
- Modify: `tests/style-contract.test.mjs`
- Modify: `tests/form-contract.test.cjs`

**Interfaces:**
- Consumes: Task 2 HTML with nav, forms, sections, image references, and data attributes.
- Produces: Concept 3 focused redesign/care visual treatment and hardened form/navigation JavaScript compatible with browser tests.

- [ ] **Step 1: Write failing style and form contracts**

In `tests/style-contract.test.mjs`, add Concept 3 CSS loading:

```js
const concept3Css = fs.readFileSync(path.join(repoRoot, 'concepts/03-website-care-redesign/assets/css/styles.css'), 'utf8');
```

Add `concept 3 CSS implements the website care redesign design contract` asserting:

```js
for (const token of ['#1F3A5F', '#C1622D', '#F5EFE6', '#FBF8F2', '#F05000', 'Fraunces', 'Karla', 'IBM Plex Mono']) {
  assert.match(concept3Css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Concept 3 CSS should include ${token}`);
}
assert.match(concept3Css, /redesign-path|care-standard|launch-readiness|conversion-path|maintenance-rhythm/i);
assert.match(concept3Css, /html\.js\s+\.nav-menu\s*\{[^}]*display:\s*none\s*;/);
assert.match(concept3Css, /\.line-icon svg\s*\{[^}]*stroke-width:\s*2/is);
assert.doesNotMatch(concept3Css, /blur\(|glassmorphism|orb|bokeh/i);
```

Add `concept 3 anchored insight cards clear the sticky header`:

```js
assert.match(concept3Css, /\.article-grid article\[id\]\s*\{[^}]*scroll-margin-top:\s*(?:9|10|11|12)rem\s*;/is);
```

In `tests/form-contract.test.cjs`, require Concept 3 JS:

```js
const concept3Module = require(path.resolve(__dirname, '../concepts/03-website-care-redesign/assets/js/site.js'));
const concept3Root = path.resolve(__dirname, '../concepts/03-website-care-redesign');
```

Extend `formConcepts`:

```js
{ label: 'Concept 3', module: concept3Module, root: concept3Root },
```

Add a Concept 3 source form test for `site-audit.html` and `contact.html` using the same disabled source-state assertions as Concept 2.

- [ ] **Step 2: Run targeted tests to verify failure**

Run:

```bash
node --test tests/style-contract.test.mjs tests/form-contract.test.cjs
```

Expected: FAIL because Concept 3 CSS and JS are empty or incomplete.

- [ ] **Step 3: Implement Concept 3 CSS**

Use Concept 2 CSS as a proven starting pattern, but make these Concept 3 differences explicit:

```css
.redesign-path { display: grid; gap: 1rem; }
.care-standard { border-top: 3px solid var(--terracotta); }
.launch-readiness { background: var(--paper); }
.conversion-path { color: var(--navy); }
.maintenance-rhythm { border-color: var(--terracotta-100); }
.article-grid article[id] { scroll-margin-top: 10rem; }
```

Keep:

```css
.skip-link { position: fixed; transform: translateY(-200%); }
.skip-link:focus { transform: translateY(0); }
html.js .nav-menu { display: none; }
html.js .nav-menu.is-open { display: flex; }
.form-status:empty, .error-message:empty { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
```

Use inline line SVG icons with `fill="none"`, `stroke="currentColor"`, `stroke-width: 2`, rounded caps and joins. Keep icon frames stable with fixed width and height.

- [ ] **Step 4: Implement Concept 3 JS**

Use the final Concept 2 `assets/js/site.js` behavior as the interface. Export:

```js
return {
  FORM_ENDPOINTS,
  OZMOForms: { validateFields, formDataToObject, submitForm, enhanceForms, enhanceNavigation },
};
```

Ensure `FORM_ENDPOINTS` defaults to:

```js
const FORM_ENDPOINTS = {
  audit: '',
  contact: '',
};
```

Ensure invalid enhanced submissions write combined errors into `[data-form-error]`, clear stale status text, do not send network requests in static mode, and guard repeated pending submissions.

- [ ] **Step 5: Run targeted tests**

Run:

```bash
node --test tests/style-contract.test.mjs tests/form-contract.test.cjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add concepts/03-website-care-redesign/assets/css/styles.css concepts/03-website-care-redesign/assets/js/site.js tests/style-contract.test.mjs tests/form-contract.test.cjs
git commit -m "Add Concept 3 visual system and forms"
```

---

### Task 4: Concept 3 Generated Imagery And Asset Contracts

**Files:**
- Create: `concepts/03-website-care-redesign/assets/img/hero-website-redesign.png`
- Create: `concepts/03-website-care-redesign/assets/img/hero-website-redesign.webp`
- Create: `concepts/03-website-care-redesign/assets/img/redesign-review.png`
- Create: `concepts/03-website-care-redesign/assets/img/redesign-review.webp`
- Create: `concepts/03-website-care-redesign/assets/img/care-checklist.png`
- Create: `concepts/03-website-care-redesign/assets/img/care-checklist.webp`
- Create: `concepts/03-website-care-redesign/assets/img/conversion-path.png`
- Create: `concepts/03-website-care-redesign/assets/img/conversion-path.webp`
- Create: `concepts/03-website-care-redesign/assets/img/launch-workshop.png`
- Create: `concepts/03-website-care-redesign/assets/img/launch-workshop.webp`
- Modify: `concepts/03-website-care-redesign/assets/img/prompts.md`
- Modify: `tests/asset-contract.test.mjs`

**Interfaces:**
- Consumes: Concept 3 HTML image references from Task 2.
- Produces: generated PNGs, smaller WebP derivatives, and prompt documentation.

- [ ] **Step 1: Write failing asset contracts**

Add Concept 3 to `tests/asset-contract.test.mjs`:

```js
{
  label: 'Concept 3',
  imageRoot: path.join(repoRoot, 'concepts/03-website-care-redesign/assets/img'),
  images: [
    'hero-website-redesign.png',
    'redesign-review.png',
    'care-checklist.png',
    'conversion-path.png',
    'launch-workshop.png',
  ],
},
```

The existing tests should then require non-empty PNGs, smaller WebP derivatives, prompt documentation, and prompt avoidance language.

- [ ] **Step 2: Run asset test to verify failure**

Run:

```bash
node --test tests/asset-contract.test.mjs
```

Expected: FAIL because Concept 3 images do not exist yet.

- [ ] **Step 3: Generate the five PNG images**

Use the image prompts from the Concept 3 spec exactly:

```text
hero-website-redesign.png
Warm realistic editorial photograph of a small business owner and website advisor reviewing a refreshed website layout on a laptop in a bright practical office, clear redesign and care planning mood, navy cream and terracotta color accents, no readable text, no logos, no watermark, no surreal elements.
```

```text
redesign-review.png
Realistic natural-light desk scene with laptop, blank wireframe sketches, website page cards, and a simple redesign review checklist with no readable text, practical website improvement mood, navy cream terracotta accents, no logos, no watermark.
```

```text
care-checklist.png
Warm editorial tabletop scene showing a website care checklist represented by blank cards, laptop, calendar blocks without numbers, update notes with no readable text, and a coffee cup, dependable maintenance mood, no logos, no watermark.
```

```text
conversion-path.png
Polished realistic planning scene showing a simple customer path from service page to inquiry to follow-up using blank cards and connector lines, practical conversion path strategy, warm cream navy terracotta palette, no readable words, no brand logos, no watermark.
```

```text
launch-workshop.png
Natural-light editorial workshop scene with a small business owner and advisor reviewing a launch-ready website plan, blank page layouts and maintenance cards visible, focused collaborative mood, premium but practical, no readable text, no logos, no watermark.
```

Save the PNG files to `concepts/03-website-care-redesign/assets/img/`.

- [ ] **Step 4: Create WebP derivatives**

Use local tooling such as `cwebp`, `magick`, `ffmpeg`, `sharp`, or the existing Playwright canvas approach to produce smaller WebP files. Normalize images to `1536x1024` if needed so existing page dimensions and screenshot layout are stable.

Confirm:

```bash
ls -lh concepts/03-website-care-redesign/assets/img/*.{png,webp}
```

- [ ] **Step 5: Write prompt documentation**

Write `concepts/03-website-care-redesign/assets/img/prompts.md` with one section per image and the exact prompt text from the spec.

- [ ] **Step 6: Run asset test**

Run:

```bash
node --test tests/asset-contract.test.mjs
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add concepts/03-website-care-redesign/assets/img tests/asset-contract.test.mjs
git commit -m "Add Concept 3 website care imagery"
```

---

### Task 5: Three-Concept Static And Browser Verification

**Files:**
- Modify: `scripts/verify-site.mjs`
- Modify: `tests/browser.spec.mjs`
- Modify: `tests/static-contract.test.mjs`
- Modify: `tests/content-contract.test.mjs`
- Modify: `tests/style-contract.test.mjs`
- Modify: `tests/form-contract.test.cjs`
- Modify: `tests/asset-contract.test.mjs`

**Interfaces:**
- Consumes: complete Concept 3 pages, CSS, JS, and images.
- Produces: deterministic verification for all three implemented concepts.

- [ ] **Step 1: Write failing verification updates**

Update `scripts/verify-site.mjs` so its `concepts` list includes:

```js
{
  label: 'Concept 3',
  root: path.join(repoRoot, 'concepts', '03-website-care-redesign'),
  assets: ['assets/img/hero-website-redesign.png', 'assets/img/redesign-review.png', 'assets/img/care-checklist.png', 'assets/img/conversion-path.png', 'assets/img/launch-workshop.png'],
},
```

Update `tests/browser.spec.mjs` so its `concepts` list includes:

```js
{ name: 'Concept 3', path: '/concepts/03-website-care-redesign', auditButton: /request a site audit/i, screenshotPrefix: 'concept-3-website-care' }
```

Update browser helpers so Concept 3 labels are handled:

```js
const auditGoalLabels = {
  'Concept 1': 'What feels hardest right now?',
  'Concept 2': 'What local growth goal matters most right now?',
  'Concept 3': 'What is not working on your website right now?',
};
const timelineLabels = {
  'Concept 1': 'In the next 30 days',
  'Concept 2': 'Ready to start soon',
  'Concept 3': 'Ready to start soon',
};
const contactReasonLabels = {
  'Concept 1': 'General question',
  'Concept 2': 'Not sure yet',
  'Concept 3': 'Not sure yet',
};
const probeImages = {
  'Concept 1': 'assets/img/hero-digital-operations.png',
  'Concept 2': 'assets/img/hero-local-growth.png',
  'Concept 3': 'assets/img/hero-website-redesign.png',
};
```

- [ ] **Step 2: Run verification to verify failure**

Run:

```bash
npm run verify
npm run test:browser -- --reporter=list
```

Expected: FAIL until Concept 3 paths and browser helpers are fully wired.

- [ ] **Step 3: Implement verification helpers**

Make all browser helper functions use the maps from Step 1 instead of conditionals that know only Concept 1 and Concept 2:

```js
await page.getByLabel(auditGoalLabels[concept.name]).fill('The site feels dated and the next step is unclear.');
await page.getByLabel('Timeline').selectOption({ label: timelineLabels[concept.name] });
await page.getByLabel('Reason for reaching out').selectOption({ label: contactReasonLabels[concept.name] });
```

Keep screenshot paths distinct:

```js
artifacts/screenshots/${concept.screenshotPrefix}-home-desktop.png
artifacts/screenshots/${concept.screenshotPrefix}-home-mobile.png
```

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
git commit -m "Verify Concept 3 across static and browser checks"
```

---

### Task 6: Final Review, Ledger, And Push

**Files:**
- Modify: `.superpowers/sdd/progress.md` if present and ignored.
- No production files should change unless review finds a Critical or Important issue.

**Interfaces:**
- Consumes: all Concept 3 commits and verification output.
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

Expected: tests pass and tracked status is clean.

- [ ] **Step 2: Run final whole-branch review**

Generate a review package:

```bash
/root/.codex/skills/subagent-driven-development/scripts/review-package 0fa33de76d67306c90ae69eb9c0c83905210b64f HEAD
```

Dispatch a read-only reviewer with:

```text
Spec: docs/superpowers/specs/2026-08-07-ozmo-concept-3-website-care-redesign-design.md
Plan: docs/superpowers/plans/2026-08-07-ozmo-concept-3-website-care-redesign.md
Range: 0fa33de..HEAD
Verification: npm test, npm run verify, npm run test:browser -- --reporter=list, git diff --check
```

- [ ] **Step 3: Fix any Critical or Important review findings**

Use TDD for each finding. Re-run targeted tests, full verification, and re-review until no Critical or Important issues remain.

- [ ] **Step 4: Record completion**

Append to `.superpowers/sdd/progress.md`:

```text
Concept 3: complete (review approved, pushed to main)
```

- [ ] **Step 5: Push**

Run:

```bash
git status --short
git push origin main
```

Expected: `main -> main` push succeeds.
