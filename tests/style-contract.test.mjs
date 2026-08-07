import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(repoRoot, 'concepts/01-digital-operations-partner/assets/css/styles.css'), 'utf8');

test('CSS includes approved OZMO design-system tokens', () => {
  for (const token of ['#1F3A5F', '#C1622D', '#F5EFE6', '#FBF8F2', '#F05000', 'Fraunces', 'Karla', 'IBM Plex Mono']) {
    assert.match(css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `CSS should include ${token}`);
  }
});

test('CSS implements responsive layout and reduced motion support', () => {
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-wrap:\s*break-word/);
});

test('CSS gives final CTA primary buttons inverse contrast and gentle rise-in motion', () => {
  const inverseCta = css.match(/\.final-cta \.button-primary\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.notEqual(inverseCta, '', 'final CTA primary buttons should have a scoped inverse treatment');
  assert.match(inverseCta, /background:\s*(?!var\(--navy\))[^;]+;/);
  assert.match(inverseCta, /border(?:-color)?:\s*[^;]+;/);
  assert.match(css, /@keyframes\s+rise-in\b/);
  assert.match(css, /animation\s*:[^;]*\brise-in\b/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*animation\s*:\s*none/);
});

test('CSS hides empty form live regions', () => {
  assert.match(css, /\.error-message:empty\s*\{[^}]*display:\s*none\s*;/);
  assert.match(css, /\.form-status:empty\s*\{[^}]*display:\s*none\s*;/);
});

test('CSS avoids forbidden visual patterns', () => {
  assert.doesNotMatch(css, /blur\(/i);
  assert.doesNotMatch(css, /glassmorphism/i);
  assert.doesNotMatch(css, /orb/i);
  assert.doesNotMatch(css, /bokeh/i);
  assert.doesNotMatch(css, /linear-gradient\([^)]*purple/i);
});
