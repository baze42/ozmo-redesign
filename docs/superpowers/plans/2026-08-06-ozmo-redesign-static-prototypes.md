# OZMO Redesign Static Prototypes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static prototype gallery with three high-end OZMO Digital multi-page website directions.

**Architecture:** Use dependency-free Node scripts to generate static HTML from shared content data, then verify the generated files with a local script. Shared CSS, JavaScript, logos, and imagery live under `assets/`, while each concept is output as a five-page static site under `concepts/<concept-slug>/`.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node.js standard library, local HTTP server for review.

## Global Constraints

- Use the provided OZMO Digital design system in `docs/ref`.
- Build as static HTML/CSS/JavaScript prototypes.
- Each concept must include `Home`, `Services`, `Contact`, `Blog`, and `Blog detail`.
- Root `index.html` must be a comparison hub linking to all three directions.
- Primary CTA is `Schedule a call`; secondary CTA is `Request a site audit`.
- Services must appear in this order: website design/redesign, website care and maintenance, digital marketing/SEO/content, automation/CRM/email workflows.
- Use polished sample proof content because real testimonials, client names, and results are not available.
- Keep the current "Be Brilliant" hero image in the Steady Expert direction.
- Prefer warm, realistic small-business and professional-service photography.
- Contact forms are static and must not attempt network submission.
- All pages must be responsive and navigable.
- Commit and push the finished implementation to GitHub.

---

## File Structure

- Create `package.json`: script entry points for `build`, `test`, and `serve`.
- Create `src/content.js`: all concept metadata, page copy, service copy, sample proof content, and blog content.
- Create `src/build.js`: static page generator, layout helpers, and page section rendering.
- Create `src/verify.js`: generated-file, link, content, and form-safety verification.
- Create `assets/css/styles.css`: shared design-system tokens and all concept/page styling.
- Create `assets/js/prototype.js`: static contact-form confirmation behavior and mobile navigation behavior.
- Create `assets/img/`: copied OZMO logos and downloaded/current hero image.
- Generate `index.html`: prototype comparison hub.
- Generate `concepts/steady-expert/index.html`, `services.html`, `contact.html`, `blog.html`, `article.html`.
- Generate `concepts/local-growth-studio/index.html`, `services.html`, `contact.html`, `blog.html`, `article.html`.
- Generate `concepts/operations-partner/index.html`, `services.html`, `contact.html`, `blog.html`, `article.html`.

## Task 1: Scaffold Scripts And Assets

**Files:**
- Create: `package.json`
- Create: `src/content.js`
- Create: `src/build.js`
- Create: `src/verify.js`
- Create: `assets/img/`

**Interfaces:**
- Produces: `npm run build`, `npm test`, and `npm run serve`
- Produces: local image assets used by generated HTML as `/assets/img/<filename>`

- [ ] **Step 1: Create project directories**

Run:

```bash
mkdir -p src assets/img assets/css assets/js concepts
```

Expected: directories exist with no command output.

- [ ] **Step 2: Copy OZMO logo assets and download the current hero**

Run:

```bash
cp docs/ref/assets/ozmo-logo-full.png assets/img/ozmo-logo-full.png
cp docs/ref/assets/ozmo-logo-navy.png assets/img/ozmo-logo-navy.png
cp docs/ref/assets/ozmo-logo-white.png assets/img/ozmo-logo-white.png
cp docs/ref/assets/ozmo-mark.png assets/img/ozmo-mark.png
curl -L https://ozmodigital.com/wp-content/uploads/pexels-timothy-paule-ii-614774-2002719-1620x1080.jpg -o assets/img/be-brilliant-hero.jpg
```

Expected: `file assets/img/be-brilliant-hero.jpg` reports a JPEG image.

- [ ] **Step 3: Create package scripts**

Create `package.json`:

```json
{
  "scripts": {
    "build": "node src/build.js",
    "test": "node src/verify.js",
    "serve": "python3 -m http.server 4173"
  },
  "devDependencies": {}
}
```

- [ ] **Step 4: Create a failing verifier skeleton**

Create `src/verify.js`:

```js
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const conceptSlugs = ["steady-expert", "local-growth-studio", "operations-partner"];
const pageFiles = ["index.html", "services.html", "contact.html", "blog.html", "article.html"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function fileExists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function run() {
  assert(fileExists("index.html"), "Missing root comparison hub");
  for (const slug of conceptSlugs) {
    for (const page of pageFiles) {
      assert(fileExists(`concepts/${slug}/${page}`), `Missing ${slug}/${page}`);
    }
  }
  console.log("Prototype verification passed.");
}

run();
```

- [ ] **Step 5: Run verifier and confirm it fails before implementation**

Run:

```bash
npm test
```

Expected: failure with `Missing root comparison hub`.

## Task 2: Define Content And HTML Generator

**Files:**
- Modify: `src/content.js`
- Modify: `src/build.js`
- Generate: `index.html`
- Generate: `concepts/**/<page>.html`

**Interfaces:**
- Produces: `module.exports = { concepts, services, articles, pages }`
- Produces: `build.js` function `renderSite(): void`
- Consumes: image assets from `assets/img/`

- [ ] **Step 1: Create content data**

Create `src/content.js` with:

```js
const services = [
  {
    title: "Website design and redesign",
    icon: "layout-template",
    summary: "A clear, fast, conversion-minded website built around the way your customers actually decide.",
    detail: "We shape the message, structure the pages, and design the experience so your site earns trust before a prospect ever calls."
  },
  {
    title: "Website care and maintenance",
    icon: "shield-check",
    summary: "Updates, backups, security checks, and steady improvements handled before they become distractions.",
    detail: "Your website should not become another system you have to babysit. OZMO keeps it healthy, current, and easy to trust."
  },
  {
    title: "Digital marketing, SEO, and content",
    icon: "line-chart",
    summary: "Practical campaigns and content that help the right customers find you and understand why you are the right fit.",
    detail: "We focus on the channels and messages that matter for your business instead of chasing every trend."
  },
  {
    title: "Automation, CRM, and email workflows",
    icon: "workflow",
    summary: "Simple automations that move leads, follow-ups, and customer communication forward in the background.",
    detail: "We connect the pieces so fewer opportunities fall through the cracks and fewer tasks live in your head."
  }
];

const articles = [
  {
    title: "Five signs your website is costing you good leads",
    category: "Website strategy",
    date: "August 6, 2026",
    readTime: "6 min read",
    excerpt: "A practical owner-focused checklist for spotting trust, clarity, and conversion gaps before they become expensive.",
    body: [
      "A website does not need to be flashy to work, but it does need to answer the questions your customers are already asking.",
      "If people cannot quickly understand what you do, who you help, and what to do next, the site is quietly adding friction to every referral and search visit.",
      "The strongest small-business websites usually do three things well: they create trust, make the offer plain, and make the next step easy."
    ]
  },
  {
    title: "What a healthy website care plan should include",
    category: "Website care",
    date: "July 22, 2026",
    readTime: "5 min read",
    excerpt: "Backups, updates, security, performance, and small improvements should work together as one steady rhythm.",
    body: [
      "Care work is easiest to ignore when everything looks fine from the outside.",
      "The point of a maintenance plan is to prevent small technical issues from becoming customer-facing problems.",
      "A good plan gives you fewer surprises and a clear partner when something needs attention."
    ]
  },
  {
    title: "Where automation helps without making your business feel cold",
    category: "Automation",
    date: "July 9, 2026",
    readTime: "7 min read",
    excerpt: "The best automations protect follow-up, reduce repetition, and still leave room for real human service.",
    body: [
      "Automation should support hospitality, not replace it.",
      "For many local businesses, the best first automations are simple: inquiry routing, appointment reminders, review requests, and lead follow-up.",
      "The goal is not to make the business feel bigger than it is. The goal is to make the owner and team less dependent on memory."
    ]
  }
];

const concepts = [
  {
    slug: "steady-expert",
    name: "Steady Expert",
    tone: "High-trust, editorial, calm, and polished.",
    heroImage: "../../assets/img/be-brilliant-hero.jpg",
    photo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    headline: "Stop juggling your digital marketing. Start growing with confidence.",
    subhead: "OZMO Digital handles the website, marketing, and automation details so you can invest your time in customers and the business you are building.",
    proof: "Sample proof: owners get a clearer website, a steadier marketing rhythm, and fewer digital tasks competing for attention."
  },
  {
    slug: "local-growth-studio",
    name: "Local Growth Studio",
    tone: "Warm, practical, local, and energetic.",
    heroImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
    headline: "Websites and marketing that help local businesses keep moving.",
    subhead: "We build, care for, and improve the digital side of your business so the right customers can find you, trust you, and take the next step.",
    proof: "Sample proof: clearer service pages, better lead paths, and a plan your team can understand."
  },
  {
    slug: "operations-partner",
    name: "Operations Partner",
    tone: "Structured, systems-oriented, plain-spoken, and capable.",
    heroImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
    photo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
    headline: "Let OZMO run the digital systems behind your growth.",
    subhead: "From your website to follow-up workflows, we connect the moving pieces so your digital presence supports the business instead of distracting from it.",
    proof: "Sample proof: fewer missed follow-ups, cleaner systems, and a calmer path from inquiry to customer."
  }
];

const pages = ["index", "services", "contact", "blog", "article"];

module.exports = { concepts, services, articles, pages };
```

- [ ] **Step 2: Create generator helpers**

Create `src/build.js` with helper function signatures:

```js
const fs = require("fs");
const path = require("path");
const { concepts, services, articles, pages } = require("./content");

const root = path.resolve(__dirname, "..");

function write(filePath, content) {
  const absolute = path.join(root, filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

function assetPrefix(pagePath) {
  return pagePath.startsWith("concepts/") ? "../../" : "";
}

function pageShell({ title, concept, pagePath, body }) {
  const prefix = assetPrefix(pagePath);
  const conceptClass = concept ? ` concept-${concept.slug}` : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="stylesheet" href="${prefix}assets/css/styles.css">
  <script defer src="${prefix}assets/js/prototype.js"></script>
</head>
<body class="${conceptClass.trim()}">
${body}
</body>
</html>`;
}

function renderSite() {
  write("index.html", renderHub());
  for (const concept of concepts) {
    for (const page of pages) {
      const file = page === "index" ? "index.html" : `${page}.html`;
      write(`concepts/${concept.slug}/${file}`, renderConceptPage(concept, page));
    }
  }
}

renderSite();
```

- [ ] **Step 3: Implement complete page rendering**

Add these render functions to `src/build.js`:

```js
function renderHub() {
  const cards = concepts.map((concept) => `
    <article class="hub-card">
      <p class="eyebrow">${concept.name}</p>
      <h2>${concept.tone}</h2>
      <p>${concept.proof}</p>
      <a class="button button-primary" href="concepts/${concept.slug}/index.html">View ${concept.name}</a>
    </article>`).join("");
  return pageShell({
    title: "OZMO Digital redesign concepts",
    pagePath: "index.html",
    body: `<main class="hub">
      <section class="hub-hero">
        <img src="assets/img/ozmo-logo-full.png" alt="OZMO Digital" class="hub-logo">
        <p class="eyebrow">Prototype gallery</p>
        <h1>Three directions for the next OZMO Digital website.</h1>
        <p>Each concept includes Home, Services, Contact, Blog, and Blog detail pages using the OZMO design system and StoryBrand structure.</p>
      </section>
      <section class="hub-grid">${cards}</section>
    </main>`
  });
}

function renderConceptPage(concept, page) {
  const title = `${concept.name} | OZMO Digital`;
  const content = {
    index: renderHome(concept),
    services: renderServices(concept),
    contact: renderContact(concept),
    blog: renderBlog(concept),
    article: renderArticle(concept)
  }[page];
  return pageShell({ title, concept, pagePath: `concepts/${concept.slug}/${page}.html`, body: content });
}
```

Then implement `renderHeader`, `renderFooter`, `renderHome`, `renderServices`, `renderContact`, `renderBlog`, and `renderArticle` so each page includes the required sections from the design spec.

- [ ] **Step 4: Build generated files**

Run:

```bash
npm run build
```

Expected: root `index.html` and 15 concept page files exist.

## Task 3: Implement Shared Styling And Static Interactions

**Files:**
- Create: `assets/css/styles.css`
- Create: `assets/js/prototype.js`

**Interfaces:**
- Consumes: generated markup class names from `src/build.js`
- Produces: responsive layouts, concept variants, hover/focus states, and static form confirmation behavior

- [ ] **Step 1: Create shared CSS tokens and base styles**

Create `assets/css/styles.css` beginning with:

```css
@import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Karla:wght@300..700&family=IBM+Plex+Mono:wght@400;500&display=swap");

:root {
  --navy-900: #132741;
  --navy: #1F3A5F;
  --navy-100: #d7dfea;
  --terracotta: #C1622D;
  --terracotta-700: #8f4519;
  --terracotta-100: #f4dcc9;
  --spark: #F05000;
  --cream: #F5EFE6;
  --cream-200: #efe7da;
  --cream-300: #e6dccb;
  --paper: #FBF8F2;
  --ink: #2A2725;
  --ink-600: #57524d;
  --ink-400: #847d75;
  --white: #ffffff;
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Karla", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --shadow-md: 0 8px 20px rgba(31, 58, 95, 0.10);
  --shadow-lg: 0 18px 42px rgba(31, 58, 95, 0.14);
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.55;
}
img { max-width: 100%; display: block; }
a { color: inherit; }
```

- [ ] **Step 2: Add layout, component, and concept styles**

Extend `assets/css/styles.css` with classes used by generated markup:

```css
.site-header, .site-footer, .section, .hero, .hub { width: 100%; }
.container { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
.site-header { position: sticky; top: 0; z-index: 20; background: rgba(245, 239, 230, 0.96); border-bottom: 1px solid var(--cream-300); }
.nav { min-height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.logo { width: 160px; height: auto; }
.nav-links { display: flex; align-items: center; gap: 22px; font-weight: 700; }
.button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 12px 18px; border-radius: var(--radius-md); border: 2px solid transparent; font-weight: 700; text-decoration: none; transition: transform 180ms ease, box-shadow 180ms ease; }
.button:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.button-primary { background: var(--navy); color: var(--cream); }
.button-secondary { background: var(--terracotta); color: var(--white); }
.button-energy { background: var(--spark); color: var(--white); }
.button-ghost { border-color: var(--navy); color: var(--navy); }
.eyebrow { color: var(--terracotta-700); font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
.hero h1, h1, h2, h3 { color: var(--navy); font-family: var(--font-display); line-height: 1.08; letter-spacing: 0; }
.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
.card { background: var(--paper); border: 1px solid var(--cream-300); border-radius: var(--radius-lg); box-shadow: var(--shadow-md); padding: 28px; }
.nav-toggle { display: none; }
@media (max-width: 760px) {
  .nav { min-height: 72px; }
  .nav-toggle { display: inline-flex; }
  .nav-links { display: none; position: absolute; left: 16px; right: 16px; top: 76px; flex-direction: column; align-items: stretch; background: var(--paper); border: 1px solid var(--cream-300); border-radius: var(--radius-lg); padding: 18px; box-shadow: var(--shadow-lg); }
  .nav-links.is-open { display: flex; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
}
```

Add concept variant blocks for `.concept-steady-expert`, `.concept-local-growth-studio`, and `.concept-operations-partner`.

- [ ] **Step 3: Create static interaction script**

Create `assets/js/prototype.js`:

```js
document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-nav-toggle]");
  if (toggle) {
    const nav = document.querySelector("[data-nav-links]");
    if (nav) nav.classList.toggle("is-open");
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-prototype-form]");
  if (!form) return;
  event.preventDefault();
  const message = form.querySelector("[data-form-message]");
  if (message) {
    message.textContent = "Prototype only: this form shows the intended audit request flow without sending data.";
    message.hidden = false;
  }
});
```

- [ ] **Step 4: Rebuild and inspect generated markup**

Run:

```bash
npm run build
```

Expected: generated pages reference `assets/css/styles.css` and `assets/js/prototype.js` with correct relative paths.

## Task 4: Expand Verification Coverage

**Files:**
- Modify: `src/verify.js`

**Interfaces:**
- Consumes: generated static files
- Produces: `npm test` pass/fail verification for page count, navigation, copy, forms, and forbidden artifacts

- [ ] **Step 1: Extend verifier with required checks**

Replace `src/verify.js` with logic that checks:

```js
const requiredSnippets = [
  "Schedule a call",
  "Request a site audit",
  "Website design and redesign",
  "Website care and maintenance",
  "Digital marketing, SEO, and content",
  "Automation, CRM, and email workflows"
];

const forbidden = ["Latin filler text", "unfinished marker", "deferred marker", "old Brixies footer text"];
```

For every generated page, assert required navigation links exist for `index.html`, `services.html`, `contact.html`, `blog.html`, and `article.html`. On contact pages, assert the form includes `data-prototype-form` and does not include an `action="https://` attribute.

- [ ] **Step 2: Run verification**

Run:

```bash
npm test
```

Expected: `Prototype verification passed.`

- [ ] **Step 3: Fix every verifier failure by updating the generator or content**

For missing required copy, update `src/content.js`.

For missing links or structural issues, update `src/build.js`.

For form safety failures, update `renderContact(concept)` in `src/build.js` so the form is:

```html
<form class="contact-form" data-prototype-form>
```

and has no `action` attribute.

## Task 5: Browser Review, Polish, Commit, And Push

**Files:**
- Review: `index.html`
- Review: `concepts/**/<page>.html`
- Review: `assets/css/styles.css`

**Interfaces:**
- Consumes: local static server from `npm run serve`
- Produces: verified browser-rendered prototypes committed and pushed to `origin/main`

- [ ] **Step 1: Start a local static server**

Run:

```bash
npm run serve
```

Expected: server starts at `http://localhost:4173/`.

- [ ] **Step 2: Capture desktop and mobile screenshots**

Use Playwright or a browser automation command to open:

```text
http://localhost:4173/
http://localhost:4173/concepts/steady-expert/index.html
http://localhost:4173/concepts/local-growth-studio/index.html
http://localhost:4173/concepts/operations-partner/index.html
```

Expected: no blank pages, no overlapping text, visible navigation, visible CTAs, and each concept has a distinct visual direction.

- [ ] **Step 3: Run final verification**

Run:

```bash
npm run build
npm test
git status --short
```

Expected: build completes, verification passes, and git shows only intended prototype files plus the plan.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add package.json src assets index.html concepts docs/superpowers/plans/2026-08-06-ozmo-redesign-static-prototypes.md
git commit -m "Build OZMO redesign static prototypes"
```

Expected: commit succeeds.

- [ ] **Step 5: Push to GitHub**

Run:

```bash
git push origin main
```

Expected: push succeeds and `main` is up to date on GitHub.

## Self-Review

- Spec coverage: the plan creates the root hub, all three concept directories, five pages per concept, shared assets/styles/scripts, StoryBrand page sections, static form handling, and verification.
- Placeholder scan: plan text avoids incomplete work markers and defines exact file paths, commands, expected outputs, and interfaces.
- Type consistency: `concepts`, `services`, `articles`, and `pages` are produced by `src/content.js` and consumed by `src/build.js`; `src/verify.js` reads generated files only.
