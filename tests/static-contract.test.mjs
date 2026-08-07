import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const concepts = [
  { slug: '01-digital-operations-partner', label: 'Digital Operations Partner' },
  { slug: '02-local-growth-studio', label: 'Local Growth Studio' },
];
const requiredPages = ['index.html', 'services.html', 'site-audit.html', 'about.html', 'insights.html', 'contact.html'];
const requiredLogos = ['ozmo-logo-cream.png', 'ozmo-logo-full.png', 'ozmo-logo-ink.png', 'ozmo-logo-navy.png', 'ozmo-logo-white.png', 'ozmo-mark.png'];
const conceptRoot = path.join(repoRoot, 'concepts', concepts[0].slug);

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('root comparison hub exists and links concept 1 without presenting itself as the final site', () => {
  const html = read('index.html');
  assert.match(html, /OZMO Digital/i);
  assert.match(html, /production-testable concept directions/i);
  assert.match(html, /concepts\/01-digital-operations-partner\/index\.html/);
  assert.match(html, /Local Growth Studio/i);
  assert.match(html, /Website Care \+ Redesign Specialist/i);
  assert.doesNotMatch(html, /final OZMO website/i);
});

test('concept 2 is linked from the comparison hub and concept 3 remains queued', () => {
  const html = read('index.html');
  assert.match(html, /concepts\/02-local-growth-studio\/index\.html/);
  assert.match(html, /Local Growth Studio/i);
  assert.match(html, /Website Care \+ Redesign Specialist/i);
  assert.match(html, /Concept 03/i);
  assert.match(html, /Coming next/i);
});

test('implemented concepts contain the required deployable pages and self-contained assets', () => {
  for (const concept of concepts) {
    const root = path.join(repoRoot, 'concepts', concept.slug);
    const actualPages = fs.readdirSync(root).filter((entry) => entry.endsWith('.html')).sort();
    assert.deepEqual(actualPages, [...requiredPages].sort(), `${concept.slug} should contain exactly the required HTML pages`);
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

test('concept 1 navigation links stay inside the concept directory', () => {
  for (const page of requiredPages) {
    const html = fs.readFileSync(path.join(conceptRoot, page), 'utf8');
    for (const target of requiredPages) {
      assert.match(html, new RegExp(`href="${target}"`), `${page} should link to ${target}`);
    }
    assert.doesNotMatch(html, /href="\.\.\/\.\.\//, `${page} should not depend on parent assets`);
  }
});

test('implemented concepts have copied OZMO logo assets', () => {
  for (const concept of concepts) {
    for (const logo of requiredLogos) {
      const copied = path.join(repoRoot, 'concepts', concept.slug, 'assets', 'logos', logo);
      const source = path.join(repoRoot, 'docs', 'ref', 'assets', logo);
      assert.ok(fs.existsSync(copied), `${concept.slug}/${logo} should be copied into the concept`);
      assert.equal(fs.statSync(copied).size, fs.statSync(source).size, `${concept.slug}/${logo} should match the source asset size`);
    }
  }
});

test('concept 1 typography and page surfaces follow the design contract', () => {
  const css = read('concepts/01-digital-operations-partner/assets/css/styles.css');
  assert.match(css, /@import[^)]*family=Karla:/i);
  assert.match(css, /--font-display\s*:\s*[^;]*Fraunces/i);
  assert.match(css, /h1\s*,\s*h2[^{}]*\{[^}]*font-family:\s*var\(--font-display\)/is);
  assert.match(css, /body\s*\{[^}]*background:\s*(?:var\(--cream\)|#F5EFE6)/is);
});

test('site audit primary lead action stays on the audit page', () => {
  const html = read('concepts/01-digital-operations-partner/site-audit.html');
  const mainContent = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? '';
  const cta = mainContent.match(/<a\b(?=[^>]*class="button button-primary")(?=[^>]*>\s*Request a site audit\s*<\/a>)[^>]*>/i)?.[0] ?? '';
  const href = cta.match(/href="([^"]+)"/i)?.[1];
  assert.ok(href, 'site audit primary CTA should have an href');
  assert.match(mainContent, /id="audit-request"/i, 'site audit should expose a meaningful audit request anchor');
  assert.equal(href, '#audit-request');
});

test('concept 1 color and typography tokens use the core design contract', () => {
  const css = read('concepts/01-digital-operations-partner/assets/css/styles.css');
  for (const [token, value] of [['navy', '#1F3A5F'], ['terracotta', '#C1622D'], ['spark', '#F05000'], ['ink', '#2A2725']]) {
    assert.match(css, new RegExp(`--${token}\\s*:\\s*${value}`, 'i'), `CSS should define --${token}`);
  }
  assert.match(css, /--font-body\s*:\s*[^;]+/i);
  assert.match(css, /body\s*\{[^}]*color:\s*var\(--ink\)/is);
});

test('concept 1 interactive controls have visible focus states', () => {
  const css = read('concepts/01-digital-operations-partner/assets/css/styles.css');
  assert.match(css, /a:focus-visible[^{}]*\{/i);
  assert.match(css, /button:focus-visible[^{}]*\{/i);
  assert.match(css, /\.nav-toggle:focus-visible[^{}]*\{/i);
});

test('non-home concept pages have page-specific descriptions', () => {
  for (const page of requiredPages.filter((entry) => entry !== 'index.html')) {
    const html = fs.readFileSync(path.join(conceptRoot, page), 'utf8');
    assert.match(html, /<meta\s+name="description"\s+content="[^"]+"\s*\/?\s*>/i, `${page} should have a description meta tag`);
  }
});
