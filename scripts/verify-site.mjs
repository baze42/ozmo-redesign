import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'services.html', 'site-audit.html', 'about.html', 'insights.html', 'contact.html'];
const sharedAssets = [
  'assets/css/styles.css',
  'assets/js/site.js',
  'assets/logos/ozmo-logo-cream.png',
  'assets/logos/ozmo-logo-full.png',
  'assets/logos/ozmo-logo-ink.png',
  'assets/logos/ozmo-logo-navy.png',
  'assets/logos/ozmo-logo-white.png',
  'assets/logos/ozmo-mark.png',
];
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
  {
    label: 'Concept 3',
    root: path.join(repoRoot, 'concepts', '03-website-care-redesign'),
    assets: ['assets/img/hero-website-redesign.png', 'assets/img/redesign-review.png', 'assets/img/care-checklist.png', 'assets/img/conversion-path.png', 'assets/img/launch-workshop.png'],
  },
];
const forbidden = [/lorem ipsum/i, /fake testimonial/i, /fake client/i, /prototype only/i, /\bTODO\b/i, /\bTBD\b/i, /verified result/i];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function hrefs(html) {
  return Array.from(html.matchAll(/\bhref="([^"]+)"/g)).map((match) => match[1]);
}

for (const concept of concepts) {
  for (const page of pages) {
    const file = path.join(concept.root, page);
    assert.ok(fs.existsSync(file), `${concept.label} ${page} exists`);
    const html = read(file);
    for (const pattern of forbidden) {
      assert.doesNotMatch(html, pattern, `${concept.label} ${page} avoids ${pattern}`);
    }
    for (const href of hrefs(html)) {
      if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      const target = href.split('#')[0];
      if (!target) continue;
      assert.ok(fs.existsSync(path.join(path.dirname(file), target)), `${concept.label} ${page} link resolves: ${href}`);
    }
  }

  for (const asset of [...sharedAssets, ...concept.assets]) {
    assert.ok(fs.existsSync(path.join(concept.root, asset)), `${concept.label} asset exists: ${asset}`);
  }

  const siteJs = read(path.join(concept.root, 'assets/js/site.js'));
  assert.match(siteJs, /FORM_ENDPOINTS\s*=\s*{\s*audit:\s*''\s*,\s*contact:\s*''/s, `${concept.label} forms default to empty static endpoints`);
  assert.match(siteJs, /fetch\(/, `${concept.label} configured endpoint path is ready for future integration`);
  assert.match(siteJs, /staticMode/, `${concept.label} static no-network mode is implemented`);
}

console.log('OZMO multi-concept static verification passed.');
