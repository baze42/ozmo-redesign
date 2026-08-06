const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const conceptSlugs = ["steady-expert", "local-growth-studio", "operations-partner"];
const pageFiles = ["index.html", "services.html", "contact.html", "blog.html", "article.html"];
const conceptPages = conceptSlugs.flatMap((slug) => pageFiles.map((page) => `concepts/${slug}/${page}`));
const generatedFiles = ["index.html", ...conceptPages];

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

const rootRequirements = ["Prototype gallery", "Three directions", "Steady Expert", "Local Growth Studio", "Operations Partner"];

const pageRequirements = {
  "index.html": ["The problem", "What we handle", "Simple plan", "Your guide", "Success looks like this"],
  "services.html": ["Services", "Priority order", "Common signs", "Simple plan"],
  "contact.html": ["Contact", "What happens next", "data-prototype-form", "Project notes", "Prototype only"],
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

function stripFragment(value) {
  return value.split("#")[0];
}

function isExternal(value) {
  return /^(https?:|mailto:|tel:)/.test(value) || value.startsWith("data:");
}

function validateLocalReferences(filePath, html) {
  const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (!ref || ref.startsWith("#") || isExternal(ref)) continue;
    const withoutFragment = stripFragment(ref);
    if (!withoutFragment) continue;
    const resolved = path.normalize(path.join(path.dirname(filePath), withoutFragment));
    assert(fileExists(resolved), `Broken local reference from ${filePath}: ${ref}`);
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
  if (pageName === "contact.html") {
    assert(!/<form[^>]+action=/i.test(html), `${filePath} contact form must not include an action attribute`);
    for (const field of ["name=\"name\"", "name=\"email\"", "name=\"company\"", "name=\"website\"", "name=\"service\"", "name=\"notes\""]) {
      assert(html.includes(field), `${filePath} missing form field ${field}`);
    }
  }
}

function run() {
  assert(fileExists("index.html"), "Missing root comparison hub");
  for (const slug of conceptSlugs) {
    for (const page of pageFiles) {
      assert(fileExists(`concepts/${slug}/${page}`), `Missing ${slug}/${page}`);
    }
  }
  for (const filePath of generatedFiles) {
    const html = read(filePath);
    validateLocalReferences(filePath, html);
    if (filePath === "index.html") {
      for (const snippet of rootRequirements) {
        assert(html.includes(snippet), `Root hub missing requirement: ${snippet}`);
      }
      for (const snippet of requiredGlobalSnippets) {
        assert(html.includes(snippet), `Root hub missing required snippet: ${snippet}`);
      }
      continue;
    }
    validateConceptPage(filePath, html);
  }
  console.log("Prototype verification passed.");
}

run();
