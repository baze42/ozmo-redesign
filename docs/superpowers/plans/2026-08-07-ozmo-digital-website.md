# Ozmo Digital Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-end static StoryBrand website for Ozmo Digital with generated editorial imagery, lead-audit form behavior, responsive visual polish, and verification coverage.

**Architecture:** The first release is a portable static site: `index.html` owns semantic content, `styles.css` owns the visual system and responsive layout, and `script.js` owns progressive behavior for navigation and the audit form. Node's built-in test runner, jsdom, and Playwright provide static, DOM, and browser verification without introducing an app framework.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js test runner, jsdom, Playwright, built-in image generation.

## Global Constraints

- Use the existing logo at `docs/ref/uploads/ozmo-logo-bo.png`.
- The primary lead action is exactly: `Request Your Digital Growth Audit`.
- The site direction is `Guided Growth Studio`.
- Tone must be `editorial premium` with enough `calm expert restraint` to remain trustworthy, direct, and useful.
- Audience is broad small and medium sized businesses, not one vertical industry.
- Color palette: Primary navy `#1F3A5F`, secondary terracotta `#C1622D`, background `#F5EFE6`, ink `#2A2725`.
- Typography: headings use Fraunces 600; body uses Karla 400 and 500.
- Avoid generic agency-template design, stock-photo smiles, fake handshake imagery, dark tech cliches, decorative gradient orbs, bokeh blobs, generic abstract SaaS backgrounds, overly rounded cards, nested-card layouts, and aggressive hype.
- Keep form submission frontend-only for the first version.
- Validate required fields and email format.
- Save generated image assets in the project and document the final prompts in `docs/image-prompts.md`.
- Keep the site portable so it can be opened directly in a browser or served statically.

---

## File Structure

- `package.json`: npm scripts and dev dependencies for tests and browser verification.
- `package-lock.json`: locked dependency graph created by `npm install`.
- `index.html`: complete semantic one-page marketing site and audit form.
- `styles.css`: brand tokens, layout, responsive rules, interaction states, and non-generic editorial visual design.
- `script.js`: smooth anchor handling, audit form validation, service selection handling, and success state.
- `assets/ozmo-logo.png`: copied logo used by the static site.
- `assets/images/hero-growth-audit.png`: generated hero image.
- `assets/images/pain-points-workspace.png`: generated pain-point image.
- `assets/images/connected-systems.png`: generated systems image.
- `assets/images/audit-detail.png`: generated audit CTA/detail image.
- `docs/image-prompts.md`: exact prompts and fallback guidance for image replacement.
- `tests/static-content.test.mjs`: semantic content and StoryBrand structure tests.
- `tests/form-behavior.test.mjs`: jsdom tests for audit form behavior.
- `tests/visual-system.test.mjs`: CSS and visual-system guardrail tests.
- `tests/image-assets.test.mjs`: generated asset and prompt documentation tests.
- `tests/browser.spec.mjs`: Playwright browser checks.
- `playwright.config.mjs`: Playwright config for local file-based browser tests.

## Implementation Tasks

### Task 1: Project Harness And Semantic Site Content

**Files:**
- Create: `package.json`
- Create: `tests/static-content.test.mjs`
- Create: `index.html`
- Create: `assets/ozmo-logo.png`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-08-07-ozmo-digital-website-design.md`, `docs/ref/uploads/ozmo-logo-bo.png`.
- Produces: HTML anchors `#problem`, `#plan`, `#services`, `#audit`; form `#audit-form`; fields `#name`, `#email`, `#business`, `#website`, `#challenge`; service checkboxes with `name="services"`.

- [ ] **Step 1: Create the test harness and failing static content test**

Create `package.json`:

```json
{
  "name": "ozmo-digital-redesign",
  "version": "1.0.0",
  "private": true,
  "description": "Static marketing website for Ozmo Digital.",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "test:node": "node --test",
    "test:browser": "playwright test",
    "verify": "npm test && npm run test:browser"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.0",
    "jsdom": "^26.1.0"
  }
}
```

Create `tests/static-content.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const htmlPath = "index.html";

function readHtml() {
  return readFileSync(htmlPath, "utf8");
}

test("site includes the approved StoryBrand sections and CTAs", () => {
  assert.equal(existsSync(htmlPath), true);
  const html = readHtml();

  for (const id of ["problem", "guide", "plan", "services", "transformation", "audit"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /Request Your Digital Growth Audit/g);
  assert.match(html, /See How We Help/);
  assert.match(html, /Audit[\s\S]*Build[\s\S]*Optimize/);
});

test("audit form captures the required lead qualification fields", () => {
  const html = readHtml();

  for (const id of ["audit-form", "name", "email", "business", "website", "challenge"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /name="services"/);
  assert.match(html, /Website design/);
  assert.match(html, /Digital marketing/);
  assert.match(html, /Automation/);
  assert.match(html, /Ongoing support/);
});

test("brand assets, fonts, and static files are wired for a portable static site", () => {
  const html = readHtml();

  assert.match(html, /assets\/ozmo-logo\.png/);
  assert.match(html, /Fraunces/);
  assert.match(html, /Karla/);
  assert.match(html, /styles\.css/);
  assert.match(html, /script\.js/);
});
```

- [ ] **Step 2: Run the static content test to verify it fails**

Run:

```bash
npm install
npm run test:node -- tests/static-content.test.mjs
```

Expected: `FAIL` because `index.html` and `assets/ozmo-logo.png` do not exist yet.

- [ ] **Step 3: Add semantic HTML and copy the logo**

Create `assets/` and copy the logo:

```bash
mkdir -p assets
cp docs/ref/uploads/ozmo-logo-bo.png assets/ozmo-logo.png
```

Create `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ozmo Digital | Websites, Marketing, And Automation For Growing Businesses</title>
    <meta
      name="description"
      content="Ozmo Digital helps small and medium sized businesses clarify their message, improve their website, capture more leads, and automate follow-up."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Karla:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="site-header" data-header>
      <a class="brand" href="#top" aria-label="Ozmo Digital home">
        <img src="assets/ozmo-logo.png" alt="Ozmo Digital" />
      </a>
      <nav class="site-nav" aria-label="Primary navigation">
        <a href="#problem">Pain Points</a>
        <a href="#plan">Plan</a>
        <a href="#services">Services</a>
        <a href="#audit">Audit</a>
      </nav>
      <a class="button button-small" href="#audit">Request Your Digital Growth Audit</a>
    </header>

    <main id="top">
      <section class="hero section-shell" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="eyebrow">Guided digital growth for busy business owners</p>
          <h1 id="hero-title">Your digital presence should bring clarity, leads, and momentum.</h1>
          <p class="hero-lede">
            Ozmo Digital brings website design, marketing, automation, and lead capture into one calm,
            connected system so you can focus on running the business you built.
          </p>
          <div class="hero-actions">
            <a class="button" href="#audit">Request Your Digital Growth Audit</a>
            <a class="text-link" href="#services">See How We Help</a>
          </div>
        </div>
        <figure class="hero-visual">
          <img src="assets/images/hero-growth-audit.png" alt="Business owner reviewing a refined digital growth plan" />
          <figcaption>Strategy, design, and follow-up working from the same plan.</figcaption>
        </figure>
      </section>

      <section class="problem section-shell" id="problem" aria-labelledby="problem-title">
        <div class="section-kicker">The Problem</div>
        <h2 id="problem-title">Digital work keeps pulling your attention away from the work only you can do.</h2>
        <div class="problem-grid">
          <article>
            <h3>Your website no longer reflects the quality of your business.</h3>
            <p>It may still exist, but it is not earning trust, clarifying the offer, or turning visitors into qualified conversations.</p>
          </article>
          <article>
            <h3>Marketing happens in bursts instead of a reliable rhythm.</h3>
            <p>Good ideas stay scattered across notes, drafts, calendars, and tools while the day-to-day work takes over.</p>
          </article>
          <article>
            <h3>Leads slip through quiet gaps in the follow-up process.</h3>
            <p>Forms, inboxes, calls, and reminders are not connected, so interested people can lose momentum before they ever become customers.</p>
          </article>
        </div>
        <img class="problem-image" src="assets/images/pain-points-workspace.png" alt="Refined workspace showing scattered marketing and follow-up materials" />
      </section>

      <section class="guide section-shell" id="guide" aria-labelledby="guide-title">
        <div>
          <p class="section-kicker">The Guide</p>
          <h2 id="guide-title">Ozmo Digital gives your business a clearer digital path.</h2>
        </div>
        <p>
          You should not have to become a web designer, marketing strategist, copywriter, and automation specialist just to keep your digital presence moving.
          We shape the message, build the experience, connect the systems, and keep improving the parts that turn attention into action.
        </p>
      </section>

      <section class="plan section-shell" id="plan" aria-labelledby="plan-title">
        <p class="section-kicker">A Simple Plan</p>
        <h2 id="plan-title">Start with clarity. Build the right system. Keep improving it.</h2>
        <div class="plan-steps" aria-label="Ozmo Digital three step plan">
          <article>
            <span>01</span>
            <h3>Audit</h3>
            <p>We review your website, message, lead path, marketing rhythm, and follow-up gaps.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Build</h3>
            <p>We create the website, messaging, campaigns, lead capture, and automation your business actually needs.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Optimize</h3>
            <p>We refine what is working so leads are captured, followed up with, and converted more consistently.</p>
          </article>
        </div>
      </section>

      <section class="services section-shell" id="services" aria-labelledby="services-title">
        <div class="services-intro">
          <p class="section-kicker">The System</p>
          <h2 id="services-title">A polished digital presence is only useful when the pieces work together.</h2>
        </div>
        <div class="services-layout">
          <img src="assets/images/connected-systems.png" alt="Connected website, marketing, automation, and analytics planning materials" />
          <div class="service-list">
            <article class="service-card"><h3>Website Design And Redesign</h3><p>Clear messaging, refined design, and conversion paths built around the visitor's next step.</p></article>
            <article class="service-card"><h3>Digital Marketing</h3><p>Campaigns, content direction, and practical rhythm so your business stays visible without constant scramble.</p></article>
            <article class="service-card"><h3>Lead Capture Strategy</h3><p>Forms, offers, and calls to action shaped to turn interest into qualified conversations.</p></article>
            <article class="service-card"><h3>Automation And Follow-Up</h3><p>Connected workflows that help leads receive the right response at the right time.</p></article>
            <article class="service-card"><h3>Ongoing Support</h3><p>A steady partner for updates, improvements, and the digital details that keep momentum from fading.</p></article>
          </div>
        </div>
      </section>

      <section class="transformation section-shell" id="transformation" aria-labelledby="transformation-title">
        <p class="section-kicker">The Transformation</p>
        <h2 id="transformation-title">Move from scattered digital effort to a presence that works quietly in the background.</h2>
        <div class="contrast-grid">
          <article><h3>Before Ozmo</h3><p>Dated site, unclear message, inconsistent marketing, manual follow-up, and too many disconnected tools.</p></article>
          <article><h3>After Ozmo</h3><p>A polished presence, clearer leads, connected systems, and more time to focus on the business itself.</p></article>
        </div>
      </section>

      <section class="audit section-shell" id="audit" aria-labelledby="audit-title">
        <div class="audit-copy">
          <p class="section-kicker">Request Your Digital Growth Audit</p>
          <h2 id="audit-title">Find the clearest next move for your website, marketing, and follow-up.</h2>
          <p>
            Tell us where your digital presence feels stuck. We will look for the gaps, missed opportunities, and practical improvements that can help your business turn attention into momentum.
          </p>
          <img src="assets/images/audit-detail.png" alt="Notebook and digital planning materials for a consultative website audit" />
        </div>
        <form class="audit-form" id="audit-form" novalidate>
          <div class="form-row">
            <label for="name">Name</label>
            <input id="name" name="name" autocomplete="name" required />
            <p class="field-error" data-error-for="name"></p>
          </div>
          <div class="form-row">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" autocomplete="email" required />
            <p class="field-error" data-error-for="email"></p>
          </div>
          <div class="form-row">
            <label for="business">Business name</label>
            <input id="business" name="business" autocomplete="organization" required />
            <p class="field-error" data-error-for="business"></p>
          </div>
          <div class="form-row">
            <label for="website">Website URL</label>
            <input id="website" name="website" type="url" inputmode="url" />
            <p class="field-error" data-error-for="website"></p>
          </div>
          <div class="form-row form-row-full">
            <label for="challenge">Biggest digital challenge</label>
            <textarea id="challenge" name="challenge" rows="5" required></textarea>
            <p class="field-error" data-error-for="challenge"></p>
          </div>
          <fieldset class="service-options">
            <legend>Services of interest</legend>
            <label><input type="checkbox" name="services" value="Website design" /> Website design</label>
            <label><input type="checkbox" name="services" value="Digital marketing" /> Digital marketing</label>
            <label><input type="checkbox" name="services" value="Automation" /> Automation</label>
            <label><input type="checkbox" name="services" value="Ongoing support" /> Ongoing support</label>
          </fieldset>
          <button class="button form-submit" type="submit">Request Your Digital Growth Audit</button>
          <p class="form-status" data-form-status role="status" aria-live="polite"></p>
        </form>
      </section>
    </main>

    <footer class="site-footer">
      <img src="assets/ozmo-logo.png" alt="Ozmo Digital" />
      <p>Websites, marketing, and automation for businesses that are ready for clearer digital momentum.</p>
      <a href="#audit">Request Your Digital Growth Audit</a>
    </footer>

    <script src="script.js"></script>
  </body>
</html>
```

- [ ] **Step 4: Run the static content test to verify it passes**

Run:

```bash
npm run test:node -- tests/static-content.test.mjs
```

Expected: `PASS`.

- [ ] **Step 5: Commit Task 1**

```bash
git add package.json package-lock.json index.html assets/ozmo-logo.png tests/static-content.test.mjs
git commit -m "feat: add Ozmo Digital static content shell"
```

### Task 2: Audit Form Behavior

**Files:**
- Create: `tests/form-behavior.test.mjs`
- Create: `script.js`

**Interfaces:**
- Consumes: `index.html` form IDs from Task 1.
- Produces: `window.OzmoAudit.validateForm(form)`, `window.OzmoAudit.getSelectedServices(form)`, submit handling for `#audit-form`, and status text in `[data-form-status]`.

- [ ] **Step 1: Write the failing jsdom behavior tests**

Create `tests/form-behavior.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";

function loadDom() {
  const dom = new JSDOM(readFileSync("index.html", "utf8"), {
    runScripts: "outside-only",
    url: "https://ozmodigital.test/"
  });
  const script = readFileSync("script.js", "utf8");
  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded", { bubbles: true }));
  return dom;
}

test("validateForm returns field-level messages for missing required fields and invalid email", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");
  form.querySelector("#email").value = "not-an-email";

  const result = window.OzmoAudit.validateForm(form);

  assert.equal(result.valid, false);
  assert.equal(result.errors.name, "Please enter your name.");
  assert.equal(result.errors.email, "Please enter a valid email address.");
  assert.equal(result.errors.business, "Please enter your business name.");
  assert.equal(result.errors.challenge, "Please share the biggest digital challenge.");
});

test("getSelectedServices returns checked service values in document order", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");
  form.querySelector('input[value="Website design"]').checked = true;
  form.querySelector('input[value="Automation"]').checked = true;

  assert.deepEqual(window.OzmoAudit.getSelectedServices(form), ["Website design", "Automation"]);
});

test("valid submit shows a consultative success state without navigation", () => {
  const { window } = loadDom();
  const form = window.document.querySelector("#audit-form");
  form.querySelector("#name").value = "Alex Rivera";
  form.querySelector("#email").value = "alex@example.com";
  form.querySelector("#business").value = "Rivera Studio";
  form.querySelector("#challenge").value = "Leads arrive from several places and follow-up is inconsistent.";

  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

  assert.match(window.document.querySelector("[data-form-status]").textContent, /Thanks, Alex/);
  assert.equal(form.dataset.submitted, "true");
});
```

- [ ] **Step 2: Run the form behavior tests to verify they fail**

Run:

```bash
npm run test:node -- tests/form-behavior.test.mjs
```

Expected: `FAIL` because `script.js` does not exist or `window.OzmoAudit` is not defined.

- [ ] **Step 3: Implement minimal form behavior and smooth anchor handling**

Create `script.js`:

```js
(function () {
  const messages = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    business: "Please enter your business name.",
    challenge: "Please share the biggest digital challenge."
  };

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validateForm(form) {
    const errors = {};
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const business = form.elements.business.value.trim();
    const challenge = form.elements.challenge.value.trim();

    if (!name) errors.name = messages.name;
    if (!email || !isValidEmail(email)) errors.email = messages.email;
    if (!business) errors.business = messages.business;
    if (!challenge) errors.challenge = messages.challenge;

    return { valid: Object.keys(errors).length === 0, errors };
  }

  function getSelectedServices(form) {
    return Array.from(form.querySelectorAll('input[name="services"]:checked')).map((input) => input.value);
  }

  function renderErrors(form, errors) {
    form.querySelectorAll("[data-error-for]").forEach((node) => {
      const field = node.getAttribute("data-error-for");
      node.textContent = errors[field] || "";
    });
  }

  function handleAuditSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const status = form.querySelector("[data-form-status]");
    const result = validateForm(form);

    renderErrors(form, result.errors);

    if (!result.valid) {
      form.dataset.submitted = "false";
      status.textContent = "Please review the highlighted fields so we can understand your business clearly.";
      return;
    }

    const firstName = form.elements.name.value.trim().split(/\s+/)[0];
    const selectedServices = getSelectedServices(form);
    const serviceText = selectedServices.length
      ? ` We noted your interest in ${selectedServices.join(", ")}.`
      : "";

    form.dataset.submitted = "true";
    status.textContent = `Thanks, ${firstName}. Your audit request is ready for review.${serviceText}`;
    form.querySelector(".form-submit").textContent = "Audit Request Prepared";
  }

  function bindSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function init() {
    const form = document.querySelector("#audit-form");
    if (form) form.addEventListener("submit", handleAuditSubmit);
    bindSmoothAnchors();
  }

  window.OzmoAudit = { validateForm, getSelectedServices };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
```

- [ ] **Step 4: Run the form behavior tests to verify they pass**

Run:

```bash
npm run test:node -- tests/form-behavior.test.mjs
```

Expected: `PASS`.

- [ ] **Step 5: Run the full Node test suite**

Run:

```bash
npm test
```

Expected: all Node tests pass with no warnings.

- [ ] **Step 6: Commit Task 2**

```bash
git add script.js tests/form-behavior.test.mjs
git commit -m "feat: add audit form behavior"
```

### Task 3: Editorial Visual System And Responsive CSS

**Files:**
- Create: `tests/visual-system.test.mjs`
- Create: `styles.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: semantic class names and section IDs from Task 1.
- Produces: CSS custom properties for the approved brand palette, responsive layout rules, accessible focus states, stable image dimensions, and refined card styling.

- [ ] **Step 1: Write the failing visual-system tests**

Create `tests/visual-system.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function css() {
  return readFileSync("styles.css", "utf8");
}

test("CSS defines the approved palette and typography as reusable tokens", () => {
  const source = css();

  for (const token of ["#1F3A5F", "#C1622D", "#F5EFE6", "#2A2725", "Fraunces", "Karla"]) {
    assert.match(source, new RegExp(token.replace("#", "\\#")));
  }
});

test("responsive layout uses stable dimensions and mobile breakpoints", () => {
  const source = css();

  assert.match(source, /@media\s*\(max-width:\s*900px\)/);
  assert.match(source, /@media\s*\(max-width:\s*640px\)/);
  assert.match(source, /aspect-ratio/);
  assert.match(source, /scroll-margin-top/);
});

test("visual system avoids overdone generic decoration and keeps cards restrained", () => {
  const source = css().toLowerCase();

  for (const forbidden of ["radial-gradient", "gradient-orb", "bokeh", "blob"]) {
    assert.equal(source.includes(forbidden), false);
  }

  assert.match(source, /--radius-card:\s*8px/);
  assert.match(source, /\.service-card[\s\S]*border-radius:\s*var\(--radius-card\)/);
});
```

- [ ] **Step 2: Run the visual-system tests to verify they fail**

Run:

```bash
npm run test:node -- tests/visual-system.test.mjs
```

Expected: `FAIL` because `styles.css` does not exist or lacks the required visual system.

- [ ] **Step 3: Implement the CSS visual system**

Create `styles.css` with the approved brand tokens and these required sections:

```css
:root {
  --navy: #1F3A5F;
  --navy-900: #142741;
  --navy-100: #d9e2ef;
  --terracotta: #C1622D;
  --terracotta-700: #9d4d22;
  --terracotta-100: #f2d9c8;
  --background: #F5EFE6;
  --paper: #fffaf2;
  --ink: #2A2725;
  --muted: #6f6761;
  --line: rgba(31, 58, 95, 0.18);
  --shadow: 0 24px 70px rgba(31, 58, 95, 0.14);
  --radius-card: 8px;
  --radius-panel: 18px;
  --font-heading: "Fraunces", Georgia, serif;
  --font-body: "Karla", Arial, sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.65;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
}

button,
input,
textarea {
  font: inherit;
}

:focus-visible {
  outline: 3px solid var(--terracotta);
  outline-offset: 4px;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 28px;
  padding: 18px clamp(20px, 4vw, 56px);
  background: rgba(245, 239, 230, 0.92);
  border-bottom: 1px solid var(--line);
  backdrop-filter: blur(18px);
}

.brand img {
  width: 142px;
  height: auto;
}

.site-nav {
  display: flex;
  justify-content: center;
  gap: clamp(18px, 3vw, 34px);
  color: var(--navy);
  font-size: 0.94rem;
  font-weight: 500;
}

.site-nav a,
.text-link,
.site-footer a {
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 22px;
  border: 1px solid var(--terracotta);
  border-radius: 999px;
  background: var(--terracotta);
  color: white;
  font-weight: 500;
  text-decoration: none;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}

.button:hover {
  transform: translateY(-2px);
  background: var(--terracotta-700);
  border-color: var(--terracotta-700);
}

.button-small {
  min-height: 40px;
  padding-inline: 18px;
  font-size: 0.9rem;
}

.section-shell {
  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
  padding: clamp(72px, 9vw, 128px) 0;
  scroll-margin-top: 96px;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(320px, 0.78fr);
  align-items: end;
  gap: clamp(40px, 7vw, 92px);
  min-height: calc(100vh - 86px);
  padding-top: clamp(56px, 8vw, 96px);
}

.eyebrow,
.section-kicker {
  margin: 0 0 16px;
  color: var(--terracotta);
  font-size: 0.79rem;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: uppercase;
}

h1,
h2,
h3 {
  margin: 0;
  color: var(--navy-900);
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: 0;
}

h1 {
  max-width: 820px;
  font-size: clamp(3rem, 8vw, 6.8rem);
}

h2 {
  max-width: 850px;
  font-size: clamp(2.15rem, 5vw, 4.4rem);
}

h3 {
  font-size: clamp(1.28rem, 2vw, 1.75rem);
}

.hero-lede,
.guide p,
.audit-copy p {
  max-width: 690px;
  color: var(--muted);
  font-size: clamp(1.08rem, 2vw, 1.28rem);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 22px;
  margin-top: 34px;
}

.hero-visual,
.problem-image,
.services-layout img,
.audit-copy img {
  overflow: hidden;
  border: 1px solid rgba(31, 58, 95, 0.16);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow);
}

.hero-visual {
  margin: 0;
  transform: translateY(28px);
}

.hero-visual img,
.problem-image,
.services-layout img,
.audit-copy img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.hero-visual figcaption {
  padding: 16px 18px;
  background: var(--paper);
  color: var(--muted);
  font-size: 0.92rem;
}

.problem-grid,
.plan-steps,
.contrast-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 36px;
}

.problem-grid article,
.plan-steps article,
.contrast-grid article,
.service-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-card);
  background: rgba(255, 250, 242, 0.72);
  padding: clamp(22px, 3vw, 32px);
}

.problem-grid p,
.plan-steps p,
.service-card p,
.contrast-grid p {
  color: var(--muted);
}

.problem-image {
  margin-top: 34px;
  aspect-ratio: 16 / 7;
}

.guide {
  display: grid;
  grid-template-columns: 0.9fr 1fr;
  gap: clamp(32px, 7vw, 90px);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.plan-steps span {
  display: block;
  margin-bottom: 54px;
  color: var(--terracotta);
  font-weight: 500;
}

.services-layout {
  display: grid;
  grid-template-columns: 0.82fr 1fr;
  gap: 30px;
  margin-top: 36px;
}

.service-list {
  display: grid;
  gap: 14px;
}

.contrast-grid {
  grid-template-columns: repeat(2, 1fr);
}

.contrast-grid article:last-child {
  background: var(--navy);
  color: white;
}

.contrast-grid article:last-child h3,
.contrast-grid article:last-child p {
  color: white;
}

.audit {
  display: grid;
  grid-template-columns: 0.82fr 1fr;
  gap: clamp(34px, 6vw, 76px);
  align-items: start;
}

.audit-copy img {
  margin-top: 28px;
  aspect-ratio: 16 / 10;
}

.audit-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid var(--line);
  border-radius: var(--radius-panel);
  background: var(--paper);
  box-shadow: var(--shadow);
}

.form-row,
.service-options,
.form-status,
.form-submit {
  grid-column: span 2;
}

.form-row {
  display: grid;
  gap: 7px;
}

.audit-form label,
.service-options legend {
  color: var(--navy);
  font-weight: 500;
}

.audit-form input,
.audit-form textarea {
  width: 100%;
  border: 1px solid rgba(31, 58, 95, 0.24);
  border-radius: var(--radius-card);
  background: white;
  color: var(--ink);
  padding: 13px 14px;
}

.field-error,
.form-status {
  min-height: 1.4em;
  margin: 0;
  color: var(--terracotta-700);
  font-size: 0.92rem;
}

.service-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  border: 0;
  padding: 0;
}

.service-options legend {
  grid-column: 1 / -1;
}

.service-options label {
  display: flex;
  gap: 10px;
  align-items: center;
  min-height: 44px;
  border: 1px solid rgba(31, 58, 95, 0.18);
  border-radius: var(--radius-card);
  padding: 10px 12px;
  background: rgba(245, 239, 230, 0.54);
}

.site-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 22px;
  padding: 34px clamp(20px, 4vw, 56px);
  border-top: 1px solid var(--line);
}

.site-footer img {
  width: 126px;
}

.site-footer p {
  max-width: 560px;
  color: var(--muted);
}

@media (max-width: 900px) {
  .site-header,
  .hero,
  .guide,
  .services-layout,
  .audit {
    grid-template-columns: 1fr;
  }

  .site-nav {
    order: 3;
    grid-column: 1 / -1;
    justify-content: flex-start;
    overflow-x: auto;
  }

  .hero {
    min-height: auto;
  }

  .hero-visual {
    transform: none;
  }

  .problem-grid,
  .plan-steps {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  body {
    font-size: 16px;
  }

  .site-header {
    padding-inline: 16px;
  }

  .section-shell {
    width: min(100% - 28px, 1180px);
    padding: 64px 0;
  }

  h1 {
    font-size: 3rem;
  }

  .contrast-grid,
  .audit-form,
  .service-options {
    grid-template-columns: 1fr;
  }

  .form-row,
  .service-options,
  .form-status,
  .form-submit {
    grid-column: span 1;
  }
}
```

Modify `index.html` only if required to support the CSS classes or accessibility polish discovered while implementing this task.

- [ ] **Step 4: Run visual-system tests to verify they pass**

Run:

```bash
npm run test:node -- tests/visual-system.test.mjs
```

Expected: `PASS`.

- [ ] **Step 5: Run the full Node test suite**

Run:

```bash
npm test
```

Expected: all Node tests pass with no warnings.

- [ ] **Step 6: Commit Task 3**

```bash
git add styles.css index.html tests/visual-system.test.mjs
git commit -m "feat: add Ozmo Digital editorial visual system"
```

### Task 4: Generated Image Assets And Prompt Documentation

**Files:**
- Create: `tests/image-assets.test.mjs`
- Create: `assets/images/hero-growth-audit.png`
- Create: `assets/images/pain-points-workspace.png`
- Create: `assets/images/connected-systems.png`
- Create: `assets/images/audit-detail.png`
- Create: `docs/image-prompts.md`

**Interfaces:**
- Consumes: image requirements from the design spec and image references already present in `index.html`.
- Produces: project-local generated image files and exact prompt documentation for all four assets.

- [ ] **Step 1: Write the failing asset and prompt tests**

Create `tests/image-assets.test.mjs`:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

const images = [
  "assets/images/hero-growth-audit.png",
  "assets/images/pain-points-workspace.png",
  "assets/images/connected-systems.png",
  "assets/images/audit-detail.png"
];

test("generated image assets exist in the project and are non-trivial files", () => {
  for (const image of images) {
    assert.equal(existsSync(image), true, `${image} should exist`);
    assert.ok(statSync(image).size > 50_000, `${image} should be a real generated image`);
  }
});

test("image prompt documentation records every asset and production prompt", () => {
  const docs = readFileSync("docs/image-prompts.md", "utf8");

  for (const image of images) {
    assert.match(docs, new RegExp(image));
  }

  for (const phrase of [
    "photorealistic-natural",
    "productivity-visual",
    "No watermarks",
    "No stock-photo handshake imagery"
  ]) {
    assert.match(docs, new RegExp(phrase));
  }
});
```

- [ ] **Step 2: Run the asset tests to verify they fail**

Run:

```bash
npm run test:node -- tests/image-assets.test.mjs
```

Expected: `FAIL` because the generated images and prompt documentation do not exist yet.

- [ ] **Step 3: Generate the four project images**

Use the built-in image generation path. Save the final selected outputs into `assets/images/` with the exact filenames from this task. Use these prompts:

Hero image prompt:

```text
Use case: photorealistic-natural
Asset type: Ozmo Digital homepage hero image
Primary request: Create an editorial photograph of a composed small-business founder reviewing a clear digital growth plan in a refined workspace.
Scene/backdrop: Warm, modern office with natural light, a laptop, tasteful planning notes, and subtle website strategy materials.
Subject: One business owner or founder, calm and focused, presented as capable rather than posed.
Style/medium: Premium editorial photography, realistic texture, natural lens depth.
Composition/framing: Vertical 4:5 composition with generous clean space, safe cropping for responsive website use.
Lighting/mood: Warm natural light, sophisticated, human, trustworthy, calm.
Color palette: Navy and terracotta accents appear naturally in notebooks, screen details, or workspace objects; warm neutral background.
Constraints: no visible brand names, no readable UI text as a focal point, no exaggerated smile, no handshake, no watermark.
Avoid: stock-photo corporate styling, dark tech cliches, fake agency-office staging.
```

Pain-point image prompt:

```text
Use case: photorealistic-natural
Asset type: Ozmo Digital pain-point section image
Primary request: Create an elegant but slightly tense editorial workspace scene showing scattered marketing notes, an open laptop, calendar reminders, website mockup papers, and lead follow-up tasks.
Scene/backdrop: Refined small-business desk with warm neutral materials and restrained navy and terracotta details.
Subject: No people required; the business owner's digital overwhelm is shown through the objects.
Style/medium: Premium editorial photography, realistic surfaces, calm composition.
Composition/framing: Wide 16:7-friendly scene that can crop safely on desktop and mobile.
Lighting/mood: Natural light, composed, thoughtful, not chaotic.
Color palette: Warm background with navy and terracotta accents.
Constraints: no visible real brand names, no readable distorted UI text, no watermark.
Avoid: messy chaos, stock-photo desk clutter, fake corporate props, dark tech mood.
```

Connected-systems image prompt:

```text
Use case: productivity-visual
Asset type: Ozmo Digital services systems image
Primary request: Create a tangible editorial workspace visual showing connected digital touchpoints: website layout sketches, lead notifications, email sequence cards, automation map, and analytics snapshots.
Scene/backdrop: Premium planning table with layered paper cards, a laptop edge, and precise system-mapping materials.
Subject: The system should imply website, marketing, lead capture, automation, and optimization working together.
Style/medium: Realistic editorial productivity visual, not a futuristic interface.
Composition/framing: Vertical 4:5 composition with organized diagonals and safe responsive cropping.
Lighting/mood: Clear, strategic, precise, warm.
Color palette: Navy structure lines, terracotta action accents, warm neutral surface.
Constraints: no real brand names, no readable nonsense UI as the focal point, no sci-fi holograms, no watermark.
Avoid: generic SaaS dashboard collage, neon technology aesthetic, bokeh, decorative gradient orbs.
```

Audit-detail image prompt:

```text
Use case: photorealistic-natural
Asset type: Ozmo Digital audit CTA detail image
Primary request: Create a quiet close-up editorial detail of a notebook, screen edge, refined desk surface, and brand planning materials prepared for a consultative website and marketing audit.
Scene/backdrop: Warm desk surface with subtle navy and terracotta accents.
Subject: Planning materials that suggest clarity, next steps, and careful review.
Style/medium: Premium editorial photography, realistic close-up.
Composition/framing: Horizontal 16:10-friendly close-up with calm negative space.
Lighting/mood: Calm, precise, consultative, trustworthy.
Color palette: Warm background, ink details, navy and terracotta accents.
Constraints: no visible brand names, no readable UI text as a focal point, no watermark.
Avoid: generic stock stationery, exaggerated luxury props, dark tech mood.
```

- [ ] **Step 4: Document the final prompts**

Create `docs/image-prompts.md` with one section per image. Include:
- final image file path
- use case
- full prompt text used
- fallback note that a future replacement should preserve the same composition, palette cues, and avoid list

- [ ] **Step 5: Run the asset tests to verify they pass**

Run:

```bash
npm run test:node -- tests/image-assets.test.mjs
```

Expected: `PASS`.

- [ ] **Step 6: Run the full Node test suite**

Run:

```bash
npm test
```

Expected: all Node tests pass with no warnings.

- [ ] **Step 7: Commit Task 4**

```bash
git add assets/images docs/image-prompts.md tests/image-assets.test.mjs
git commit -m "feat: add Ozmo Digital generated imagery"
```

### Task 5: Browser Verification And Final Polish

**Files:**
- Create: `playwright.config.mjs`
- Create: `tests/browser.spec.mjs`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`

**Interfaces:**
- Consumes: completed static site from Tasks 1-4.
- Produces: browser coverage for console errors, responsive layout, anchor navigation, audit form validation, and successful audit state.

- [ ] **Step 1: Write Playwright browser checks**

Create `playwright.config.mjs`:

```js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: /browser\.spec\.mjs/,
  use: {
    trace: "on-first-retry"
  },
  projects: [
    { name: "Desktop Chrome", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1100 } } },
    { name: "Mobile Safari", use: { ...devices["iPhone 13"] } }
  ]
});
```

Create `tests/browser.spec.mjs`:

```js
import { expect, test } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const siteUrl = pathToFileURL(path.resolve("index.html")).toString();

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(siteUrl);
  expect(errors).toEqual([]);
});

test("renders the approved hero and audit CTA", async ({ page }) => {
  await expect(page.getByRole("heading", { name: /digital presence should bring clarity/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Request Your Digital Growth Audit" }).first()).toBeVisible();
  await expect(page.getByAltText("Ozmo Digital").first()).toBeVisible();
});

test("anchor navigation reaches the audit form", async ({ page }) => {
  await page.getByRole("link", { name: "Audit" }).first().click();
  await expect(page.locator("#audit-form")).toBeInViewport();
});

test("audit form validates and shows success without navigation", async ({ page }) => {
  await page.locator("#audit-form").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Request Your Digital Growth Audit" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();

  await page.locator("#name").fill("Alex Rivera");
  await page.locator("#email").fill("alex@example.com");
  await page.locator("#business").fill("Rivera Studio");
  await page.locator("#challenge").fill("Our leads arrive from several places and follow-up is inconsistent.");
  await page.getByLabel("Automation").check();
  await page.getByRole("button", { name: "Request Your Digital Growth Audit" }).click();

  await expect(page.locator("[data-form-status]")).toContainText("Thanks, Alex");
  await expect(page.locator("#audit-form")).toHaveAttribute("data-submitted", "true");
});

test("responsive layout does not create horizontal overflow", async ({ page }) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
});
```

- [ ] **Step 2: Run browser tests to reveal remaining browser issues**

Run:

```bash
npm run test:browser
```

Expected: `FAIL` if Playwright browsers are not installed or any layout/behavior issue remains.

- [ ] **Step 3: Install Playwright browsers if needed**

If the previous command reports missing browser binaries, run:

```bash
npx playwright install chromium webkit
```

Then re-run:

```bash
npm run test:browser
```

- [ ] **Step 4: Fix browser or polish issues discovered by the Playwright tests**

Make focused changes only where tests reveal issues. Acceptable fixes include:
- using a more specific selector if duplicate CTA text confuses a test
- tightening mobile header wrapping
- adding `aria-label` text where accessible names are ambiguous
- adjusting CSS where mobile overflow occurs
- improving field error rendering if visible text does not update

- [ ] **Step 5: Run full verification**

Run:

```bash
npm run verify
```

Expected: all Node and Playwright tests pass with no runtime errors.

- [ ] **Step 6: Commit Task 5**

```bash
git add playwright.config.mjs tests/browser.spec.mjs index.html styles.css script.js package.json package-lock.json
git commit -m "test: add browser verification for Ozmo Digital site"
```

## Final Verification Checklist

After all tasks and task reviews are complete:

- [ ] Re-read `docs/superpowers/specs/2026-08-07-ozmo-digital-website-design.md`.
- [ ] Verify each StoryBrand section exists in `index.html`.
- [ ] Verify all four image assets exist under `assets/images/` and are referenced by `index.html`.
- [ ] Verify `docs/image-prompts.md` includes the final prompts.
- [ ] Run `npm run verify`.
- [ ] Run a production static smoke test with `python3 -m http.server 4173` and Playwright or browser inspection if the direct-file tests miss an issue.
- [ ] Run `git status --short`.
- [ ] Request final whole-branch code review.
- [ ] Fix Critical and Important findings, then re-run `npm run verify`.
- [ ] Commit any final fixes on `main`.
- [ ] Push `main` to `origin`.
