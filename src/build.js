const fs = require("fs");
const path = require("path");
const {
  articles,
  concepts,
  pages,
  painPoints,
  planSteps,
  quickWins,
  services
} = require("./content");

const root = path.resolve(__dirname, "..");

function write(filePath, content) {
  const absolute = path.join(root, filePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

function assetPrefix(pagePath) {
  return pagePath.startsWith("concepts/") ? "../../" : "";
}

function pageShell({ title, description, concept, pagePath, body }) {
  const prefix = assetPrefix(pagePath);
  const conceptClass = concept ? `concept-${concept.slug}` : "hub-page";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <title>${title}</title>
  <link rel="stylesheet" href="${prefix}assets/css/styles.css">
  <script defer src="${prefix}assets/js/prototype.js"></script>
</head>
<body class="${conceptClass}">
${body}
</body>
</html>
`;
}

function icon(name) {
  const icons = {
    layout: '<path d="M4 5h16v14H4z"/><path d="M4 10h16"/><path d="M10 10v9"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-5"/>',
    chart: '<path d="M4 19h16"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/>',
    workflow: '<path d="M6 6h5v5H6z"/><path d="M13 13h5v5h-5z"/><path d="M11 8h2a3 3 0 0 1 3 3v2"/><path d="M13 16h-2a3 3 0 0 1-3-3v-2"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
    smile: '<circle cx="12" cy="12" r="8"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M8.5 14c1 1.5 6 1.5 7 0"/>',
    growth: '<path d="M4 17l5-5 3 3 7-8"/><path d="M15 7h4v4"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    check: '<path d="M5 12l4 4L19 6"/>'
  };
  return `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.check}</svg></span>`;
}

function navLinks(activePage) {
  const links = [
    ["index", "Home", "index.html"],
    ["services", "Services", "services.html"],
    ["blog", "Blog", "blog.html"],
    ["contact", "Contact", "contact.html"]
  ];
  return links.map(([key, label, href]) => `<a href="${href}"${activePage === key ? ' aria-current="page"' : ""}>${label}</a>`).join("");
}

function renderHeader(concept, activePage) {
  return `<header class="site-header">
  <div class="container nav">
    <a class="brand-link" href="index.html" aria-label="OZMO Digital ${concept.name} home">
      <img class="logo" src="../../assets/img/ozmo-logo-navy.png" alt="OZMO Digital">
    </a>
    <button class="nav-toggle" type="button" data-nav-toggle aria-label="Open navigation" aria-expanded="false">Menu</button>
    <nav class="nav-links" data-nav-links aria-label="Primary navigation">
      ${navLinks(activePage)}
      <a class="button button-primary nav-cta" href="contact.html">Schedule a call</a>
    </nav>
  </div>
</header>`;
}

function serviceMiniList() {
  return services.map((service) => `<li>${service.title}</li>`).join("");
}

function renderFooter(concept) {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <img class="footer-logo" src="../../assets/img/ozmo-logo-white.png" alt="OZMO Digital">
      <p>${concept.tone}</p>
      <div class="footer-actions">
        <a class="button button-energy" href="contact.html">Schedule a call</a>
        <a class="button button-on-dark" href="contact.html#audit">Request a site audit</a>
      </div>
    </div>
    <div>
      <p class="footer-heading">Services</p>
      <ul class="footer-list">${serviceMiniList()}</ul>
    </div>
    <div>
      <p class="footer-heading">Pages</p>
      <ul class="footer-list">
        <li><a href="index.html">Home</a></li>
        <li><a href="services.html">Services</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="article.html">Blog detail</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="container footer-bottom">
    <span>OZMO Digital prototype direction: ${concept.name}</span>
    <a href="../../index.html">Back to concept gallery</a>
  </div>
</footer>`;
}

function sectionIntro(eyebrow, title, text) {
  return `<div class="section-intro">
    <p class="eyebrow">${eyebrow}</p>
    <h2>${title}</h2>
    <p>${text}</p>
  </div>`;
}

function ctaPair(extraClass = "") {
  return `<div class="cta-row ${extraClass}">
    <a class="button button-energy" href="contact.html">Schedule a call ${icon("arrow")}</a>
    <a class="button button-ghost" href="contact.html#audit">Request a site audit</a>
  </div>`;
}

function renderOutcomes() {
  return `<section class="section outcome-band" aria-label="Key outcomes">
    <div class="container outcome-grid">
      ${quickWins.map((item) => `<article class="outcome">
        ${icon(item.icon)}
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>`).join("")}
    </div>
  </section>`;
}

function renderProblemSection() {
  return `<section class="section problem-section">
    <div class="container">
      ${sectionIntro("The problem", "Are you tired of carrying the digital side of the business?", "Most owners do not need another marketing lecture. They need a clear partner who can take the right work off their plate.")}
      <div class="problem-grid">
        ${painPoints.map((point, index) => `<article class="problem-card">
          <span class="number">${String(index + 1).padStart(2, "0")}</span>
          <p>${point}</p>
        </article>`).join("")}
      </div>
    </div>
  </section>`;
}

function renderServiceCards() {
  return services.map((service) => `<article class="card service-card">
    ${icon(service.icon)}
    <h3>${service.title}</h3>
    <p>${service.summary}</p>
    <a class="text-link" href="services.html">${service.shortTitle} details ${icon("arrow")}</a>
  </article>`).join("");
}

function renderServicesOverview() {
  return `<section class="section services-overview">
    <div class="container">
      ${sectionIntro("What we handle", "The clear path to stress-free marketing and predictable growth.", "OZMO brings the essential digital work into one practical plan, in the order that matters most for small and medium-sized businesses.")}
      <div class="service-grid">${renderServiceCards()}</div>
    </div>
  </section>`;
}

function renderPlan() {
  return `<section class="section plan-section">
    <div class="container">
      ${sectionIntro("Simple plan", "Three steps from digital overwhelm to a managed path forward.", "You do not need to diagnose every issue before we talk. We help identify the right first move.")}
      <div class="plan-grid">
        ${planSteps.map((step, index) => `<article class="plan-step">
          <span class="step-index">${index + 1}</span>
          <h3>${step.title}</h3>
          <p>${step.text}</p>
        </article>`).join("")}
      </div>
    </div>
  </section>`;
}

function renderGuide(concept) {
  return `<section class="section guide-section">
    <div class="container split">
      <div>
        <p class="eyebrow">Your guide</p>
        <h2>${concept.guideTitle}</h2>
        <p class="lead">${concept.guideCopy}</p>
        <p>We do what we do so you can better do what it is that you do: serve customers, lead your team, and grow the business you know best.</p>
        ${ctaPair()}
      </div>
      <figure class="photo-frame">
        <img src="${concept.photo}" alt="${concept.alt}">
        <figcaption>${concept.proof}</figcaption>
      </figure>
    </div>
  </section>`;
}

function renderSuccess(concept) {
  return `<section class="section success-section">
    <div class="container success-panel">
      <div>
        <p class="eyebrow">Success looks like this</p>
        <h2>${concept.successTitle}</h2>
      </div>
      <div class="metric-block">
        <span>${concept.metric}</span>
        <p>${concept.stat}</p>
      </div>
    </div>
  </section>`;
}

function renderBlogTeaser(concept) {
  const article = articles[0];
  return `<section class="section resource-section">
    <div class="container split">
      <div>
        <p class="eyebrow">Owner resources</p>
        <h2>Useful thinking for websites, marketing, and automation.</h2>
        <p>Use the blog direction to see how OZMO can teach clearly without sounding like another agency chasing jargon.</p>
      </div>
      <article class="card featured-card">
        <p class="eyebrow">${article.category}</p>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
        <a class="text-link" href="article.html">Read the article ${icon("arrow")}</a>
      </article>
    </div>
  </section>`;
}

function renderFinalCta(concept) {
  return `<section class="section final-cta">
    <div class="container cta-panel">
      <p class="eyebrow">Let's talk</p>
      <h2>Ready to stop carrying every digital detail yourself?</h2>
      <p>${concept.proof}</p>
      ${ctaPair()}
    </div>
  </section>`;
}

function renderHome(concept) {
  return `${renderHeader(concept, "index")}
<main>
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${concept.label} - ${concept.name}</p>
        <h1>${concept.headline}</h1>
        <p class="lead">${concept.subhead}</p>
        ${ctaPair("hero-actions")}
      </div>
      <figure class="hero-media">
        <img src="${concept.heroImage}" alt="${concept.name === "Steady Expert" ? "Neon sign reading Be Brilliant" : concept.alt}">
        <figcaption>${concept.recommendedFor}</figcaption>
      </figure>
    </div>
  </section>
  ${renderOutcomes()}
  ${renderProblemSection()}
  ${renderServicesOverview()}
  ${renderPlan()}
  ${renderGuide(concept)}
  ${renderSuccess(concept)}
  ${renderBlogTeaser(concept)}
  ${renderFinalCta(concept)}
</main>
${renderFooter(concept)}`;
}

function renderServices(concept) {
  return `${renderHeader(concept, "services")}
<main>
  <section class="page-hero">
    <div class="container split">
      <div>
        <p class="eyebrow">Services</p>
        <h1>Website design, care, marketing, and automation in the right order.</h1>
        <p class="lead">Start with a site that earns trust, then keep it healthy, visible, and connected to the way your business actually operates.</p>
        ${ctaPair()}
      </div>
      <div class="service-order card">
        <p class="eyebrow">Priority order</p>
        <ol>${services.map((service) => `<li>${service.title}</li>`).join("")}</ol>
      </div>
    </div>
  </section>
  <section class="section service-detail-section">
    <div class="container service-detail-list">
      ${services.map((service, index) => `<article class="service-detail">
        <div class="service-detail-index">${String(index + 1).padStart(2, "0")}</div>
        <div>
          ${icon(service.icon)}
          <h2>${service.title}</h2>
          <p class="lead">${service.summary}</p>
          <p>${service.detail}</p>
        </div>
        <div class="card signs-card">
          <p class="eyebrow">Common signs</p>
          <ul>${service.signs.map((sign) => `<li>${sign}</li>`).join("")}</ul>
        </div>
      </article>`).join("")}
    </div>
  </section>
  ${renderPlan()}
  ${renderFinalCta(concept)}
</main>
${renderFooter(concept)}`;
}

function renderContact(concept) {
  return `${renderHeader(concept, "contact")}
<main>
  <section class="page-hero contact-hero">
    <div class="container split">
      <div>
        <p class="eyebrow">Contact</p>
        <h1>Schedule a call or request a site audit.</h1>
        <p class="lead">Tell us what is happening with your website, marketing, or automation. We will help you identify the clearest next step.</p>
      </div>
      <div class="card contact-expectations">
        <p class="eyebrow">What happens next</p>
        <ol>
          <li>We review your goals and current digital presence.</li>
          <li>We look for the highest-leverage first improvement.</li>
          <li>You get a practical recommendation for the next step.</li>
        </ol>
      </div>
    </div>
  </section>
  <section class="section contact-section" id="audit">
    <div class="container contact-grid">
      <form class="contact-form card" data-prototype-form>
        <p class="eyebrow">Start the conversation</p>
        <h2>What should we look at first?</h2>
        <label>Name<input name="name" type="text" autocomplete="name"></label>
        <label>Email<input name="email" type="email" autocomplete="email"></label>
        <label>Company<input name="company" type="text" autocomplete="organization"></label>
        <label>Website URL<input name="website" type="url" placeholder="https://"></label>
        <label>Service interest<select name="service">
          ${services.map((service) => `<option>${service.title}</option>`).join("")}
        </select></label>
        <label>Project notes<textarea name="notes" rows="5" placeholder="Tell us what feels stuck, what you want to improve, or what you want audited."></textarea></label>
        <button class="button button-energy" type="submit">Request a site audit</button>
        <p class="prototype-note">Prototype only: this form previews the audit request flow and does not send data.</p>
        <p class="form-message" data-form-message hidden></p>
      </form>
      <aside class="contact-aside">
        <div class="card">
          <p class="eyebrow">Good fit for</p>
          <ul>
            <li>Established local service businesses.</li>
            <li>Professional practices with dated or confusing websites.</li>
            <li>Owners who need one partner for website, marketing, and digital follow-up.</li>
          </ul>
        </div>
        <div class="audit-note">
          <span>${icon("check")}</span>
          <p>${concept.proof}</p>
        </div>
      </aside>
    </div>
  </section>
</main>
${renderFooter(concept)}`;
}

function renderBlog(concept) {
  const [featured, ...rest] = articles;
  return `${renderHeader(concept, "blog")}
<main>
  <section class="page-hero blog-hero">
    <div class="container">
      <p class="eyebrow">Blog</p>
      <h1>Plain-spoken resources for better websites, marketing, and automation.</h1>
      <p class="lead">A useful resource center for owners who want clearer decisions, not more digital noise.</p>
      <div class="filter-row" aria-label="Static topic filters">
        <span>Website strategy</span><span>Website care</span><span>Marketing and SEO</span><span>Automation</span>
      </div>
    </div>
  </section>
  <section class="section blog-section">
    <div class="container">
      <article class="featured-article">
        <div>
          <p class="eyebrow">Featured article</p>
          <p class="eyebrow">${featured.category}</p>
          <h2>${featured.title}</h2>
          <p>${featured.excerpt}</p>
          <a class="button button-primary" href="article.html">Read featured article</a>
        </div>
        <div class="article-meta">
          <span>${featured.date}</span>
          <span>${featured.readTime}</span>
        </div>
      </article>
      <div class="article-grid">
        ${rest.map((article) => `<article class="card article-card">
          <p class="eyebrow">${article.category}</p>
          <h3>${article.title}</h3>
          <p>${article.excerpt}</p>
          <div class="article-card-footer">
            <span>${article.readTime}</span>
            <a href="article.html">Read ${icon("arrow")}</a>
          </div>
        </article>`).join("")}
      </div>
    </div>
  </section>
  ${renderFinalCta(concept)}
</main>
${renderFooter(concept)}`;
}

function renderArticle(concept) {
  const article = articles[0];
  return `${renderHeader(concept, "article")}
<main>
  <article class="article-page">
    <header class="article-header">
      <div class="container article-header-inner">
        <p class="eyebrow">${article.category}</p>
        <h1>${article.title}</h1>
        <div class="article-meta">
          <span>${article.date}</span>
          <span>${article.readTime}</span>
        </div>
      </div>
    </header>
    <div class="container article-layout">
      <div class="article-body">
        ${article.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        <blockquote>${article.takeaway}</blockquote>
        <p>The right redesign conversation should make your business feel easier to understand, not harder. That is the lens OZMO brings to every website, care plan, marketing effort, and automation workflow.</p>
      </div>
      <aside class="article-sidebar card">
        <p class="eyebrow">Key takeaway</p>
        <p>${article.takeaway}</p>
        <a class="button button-secondary" href="contact.html#audit">Request a site audit</a>
      </aside>
    </div>
  </article>
  <section class="section related-section">
    <div class="container">
      ${sectionIntro("Related reading", "Keep improving the digital side of your business.", "A few more practical topics for owners who want a clearer path.")}
      <div class="article-grid">
        ${articles.slice(1).map((related) => `<article class="card article-card">
          <p class="eyebrow">${related.category}</p>
          <h3>${related.title}</h3>
          <p>${related.excerpt}</p>
          <a href="article.html">Read ${icon("arrow")}</a>
        </article>`).join("")}
      </div>
    </div>
  </section>
  ${renderFinalCta(concept)}
</main>
${renderFooter(concept)}`;
}

function renderHub() {
  const cards = concepts.map((concept) => `<article class="hub-card">
    <p class="eyebrow">${concept.label}</p>
    <h2>${concept.name}</h2>
    <p>${concept.tone}</p>
    <p>${concept.recommendedFor}</p>
    <a class="button button-primary" href="concepts/${concept.slug}/index.html">View ${concept.name}</a>
  </article>`).join("");
  return pageShell({
    title: "OZMO Digital redesign concepts",
    description: "Three static multi-page website directions for the OZMO Digital redesign.",
    pagePath: "index.html",
    body: `<main class="hub">
      <section class="hub-hero">
        <img src="assets/img/ozmo-logo-full.png" alt="OZMO Digital" class="hub-logo">
        <p class="eyebrow">Prototype gallery</p>
        <h1>Three directions for the next OZMO Digital website.</h1>
        <p>Each concept includes Home, Services, Contact, Blog, and Blog detail pages using the OZMO design system and StoryBrand structure.</p>
        <div class="hub-actions">
          <a class="button button-energy" href="concepts/steady-expert/contact.html">Schedule a call</a>
          <a class="button button-ghost" href="concepts/steady-expert/contact.html#audit">Request a site audit</a>
        </div>
      </section>
      <section class="hub-grid">${cards}</section>
      <section class="hub-services">
        <p class="eyebrow">Shared service order</p>
        <ul>${serviceMiniList()}</ul>
      </section>
    </main>`
  });
}

function renderConceptPage(concept, page) {
  const file = page === "index" ? "index.html" : `${page}.html`;
  const pagePath = `concepts/${concept.slug}/${file}`;
  const labels = {
    index: "Home",
    services: "Services",
    contact: "Contact",
    blog: "Blog",
    article: "Blog detail"
  };
  const content = {
    index: renderHome(concept),
    services: renderServices(concept),
    contact: renderContact(concept),
    blog: renderBlog(concept),
    article: renderArticle(concept)
  }[page];
  return pageShell({
    title: `${concept.name} ${labels[page]} | OZMO Digital`,
    description: `${concept.name} ${labels[page]} prototype direction for OZMO Digital.`,
    concept,
    pagePath,
    body: content
  });
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
