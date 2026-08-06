const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const conceptSlugs = ["steady-expert", "local-growth-studio", "operations-partner"];
const pageFiles = ["index.html", "services.html", "contact.html", "blog.html", "article.html"];
const rootPages = pageFiles;
const conceptPages = conceptSlugs.flatMap((slug) => pageFiles.map((page) => `concepts/${slug}/${page}`));
const generatedFiles = [...rootPages, ...conceptPages];

const requiredGlobalSnippets = [
  "Schedule a call",
  "Request a site audit",
  "Website design and redesign",
  "Website care and maintenance",
  "Digital marketing, SEO, and content",
  "Automation, CRM, and email workflows"
];

const forbiddenSnippets = [
  "Lorem" + " ipsum",
  "TO" + "DO",
  "TB" + "D",
  "Brixies"
];

const forbiddenProductionSnippets = [
  "Prototype gallery",
  "Direction 01",
  "Direction 02",
  "Direction 03",
  "Sample proof",
  "prototype direction",
  "Back to concept gallery",
  "Prototype only"
];

const productionImages = [
  "assets/img/be-brilliant-hero.jpg",
  "assets/img/steady-guide-session.png",
  "assets/img/steady-site-audit.png",
  "assets/img/steady-owner-workflow.png"
];

const productionPageImages = {
  "index.html": productionImages,
  "services.html": ["assets/img/steady-site-audit.png"],
  "contact.html": ["assets/img/steady-site-audit.png"]
};

const pageRequirements = {
  "index.html": ["The problem", "What we handle", "Simple plan", "Your guide", "Success looks like this"],
  "services.html": ["Services", "Priority order", "Common signs", "Simple plan"],
  "contact.html": ["Contact", "What happens next", "data-static-form", "Project notes"],
  "blog.html": ["Blog", "Featured article", "Website strategy", "Automation"],
  "article.html": ["Blog detail", "Key takeaway", "Related reading", "Request a site audit"]
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function fileExists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function splitReference(value) {
  const index = value.indexOf("#");
  if (index === -1) return { target: value, fragment: "" };
  return {
    target: value.slice(0, index),
    fragment: value.slice(index + 1)
  };
}

function isExternal(value) {
  return /^(https?:|mailto:|tel:)/.test(value) || value.startsWith("data:");
}

function validateLocalReferences(filePath, html) {
  const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (!ref || ref === "#" || isExternal(ref)) continue;
    const { target, fragment } = splitReference(ref);
    const resolved = target ? path.normalize(path.join(path.dirname(filePath), target)) : filePath;
    assert(fileExists(resolved), `Broken local reference from ${filePath}: ${ref}`);
    if (fragment) {
      const targetHtml = read(resolved);
      const decoded = decodeURIComponent(fragment);
      const escaped = decoded.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      assert(new RegExp(`\\b(?:id|name)="${escaped}"`).test(targetHtml), `Broken fragment reference from ${filePath}: ${ref}`);
    }
  }
}

function validateConceptPage(filePath, html) {
  for (const snippet of requiredGlobalSnippets) {
    assert(html.includes(snippet), `${filePath} missing required snippet: ${snippet}`);
  }
  for (const forbidden of forbiddenSnippets) {
    assert(!html.includes(forbidden), `${filePath} contains forbidden artifact: ${forbidden}`);
  }
  for (const href of ["index.html", "services.html", "contact.html", "blog.html", "article.html"]) {
    assert(html.includes(`href="${href}`), `${filePath} missing navigation/footer link to ${href}`);
  }
  const pageName = path.basename(filePath);
  for (const snippet of pageRequirements[pageName]) {
    assert(html.includes(snippet), `${filePath} missing page requirement: ${snippet}`);
  }
  if (pageName === "article.html") {
    assert(html.includes('<a href="blog.html" aria-current="page">Blog</a>'), `${filePath} article page must mark Blog as the current navigation section`);
  }
  if (pageName === "contact.html") {
    assert(!/<form[^>]+action=/i.test(html), `${filePath} contact form must not include an action attribute`);
    validateFormFields(filePath, html);
  }
}

function validateFormFields(filePath, html) {
  for (const field of ["name=\"name\"", "name=\"email\"", "name=\"company\"", "name=\"website\"", "name=\"service\"", "name=\"notes\""]) {
    assert(html.includes(field), `${filePath} missing form field ${field}`);
  }
}

function validateProductionPage(filePath, html) {
  for (const snippet of requiredGlobalSnippets) {
    assert(html.includes(snippet), `${filePath} missing required snippet: ${snippet}`);
  }
  for (const forbidden of [...forbiddenSnippets, ...forbiddenProductionSnippets]) {
    assert(!html.includes(forbidden), `${filePath} contains forbidden production artifact: ${forbidden}`);
  }
  for (const href of ["index.html", "services.html", "contact.html", "blog.html", "article.html"]) {
    assert(html.includes(`href="${href}`), `${filePath} missing root navigation/footer link to ${href}`);
  }
  const pageName = path.basename(filePath);
  for (const snippet of pageRequirements[pageName]) {
    assert(html.includes(snippet), `${filePath} missing production page requirement: ${snippet}`);
  }
  if (pageName === "article.html") {
    assert(html.includes('<a href="blog.html" aria-current="page">Blog</a>'), `${filePath} article page must mark Blog as the current navigation section`);
  }
  assert(!html.includes("images.unsplash.com"), `${filePath} must not reference remote Unsplash production imagery`);
  if (productionPageImages[pageName]) {
    for (const image of productionPageImages[pageName]) {
      assert(html.includes(image), `${filePath} missing production image ${image}`);
    }
  }
  if (pageName === "contact.html") {
    assert(!/<form[^>]+action=/i.test(html), `${filePath} contact form must not include an action attribute`);
    validateFormFields(filePath, html);
  }
}

function run() {
  for (const page of rootPages) {
    assert(fileExists(page), `Missing production root page ${page}`);
  }
  for (const slug of conceptSlugs) {
    for (const page of pageFiles) {
      assert(fileExists(`concepts/${slug}/${page}`), `Missing ${slug}/${page}`);
    }
  }
  for (const filePath of generatedFiles) {
    const html = read(filePath);
    validateLocalReferences(filePath, html);
    if (!filePath.startsWith("concepts/")) {
      validateProductionPage(filePath, html);
      continue;
    }
    validateConceptPage(filePath, html);
  }
  console.log("Production site verification passed.");
}

run();
