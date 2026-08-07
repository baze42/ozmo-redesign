import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(repoRoot, 'concepts/01-digital-operations-partner/assets/css/styles.css'), 'utf8');
const concept2Css = fs.readFileSync(path.join(repoRoot, 'concepts/02-local-growth-studio/assets/css/styles.css'), 'utf8');
const concept3Css = fs.readFileSync(path.join(repoRoot, 'concepts/03-website-care-redesign/assets/css/styles.css'), 'utf8');

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

test('mobile navigation only collapses after JavaScript enhancement', () => {
  const mobileStyles = css.match(/@media\s*\(max-width:\s*760px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(mobileStyles, /html\.js\s+\.nav-menu\s*\{[^}]*display:\s*none\s*;/);
  assert.match(mobileStyles, /html\.js\s+\.nav-menu\.is-open\s*\{[^}]*display:\s*flex\s*;/);
  assert.doesNotMatch(mobileStyles, /(?<!\.js\s)\.nav-menu\s*\{[^}]*display:\s*none\s*;/);
});

test('CTA color pairings meet the normal-text WCAG AA contrast threshold', () => {
  const colors = Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, value]) => [name, value]));
  const rule = (selector) => css.match(new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  const colorFor = (declaration) => {
    const token = declaration.match(/var\(--([\w-]+)\)/)?.[1];
    return token ? colors[token] : declaration.match(/#[0-9a-f]{6}/i)?.[0];
  };
  const contrast = (foreground, background) => {
    const luminance = (hex) => {
      const channels = hex.slice(1).match(/.{2}/g).map((part) => Number.parseInt(part, 16) / 255);
      const [red, green, blue] = channels.map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    };
    const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
  };

  for (const selector of ['button-secondary', 'button-energy']) {
    const declarations = rule(selector);
    const foreground = colorFor(declarations.match(/color:\s*([^;]+);/)?.[1] ?? '');
    const background = colorFor(declarations.match(/background:\s*([^;]+);/)?.[1] ?? '');
    assert.ok(foreground && background, `${selector} should declare foreground and background colors`);
    assert.ok(contrast(foreground, background) >= 4.5, `${selector} should meet 4.5:1 contrast`);
  }
});

test('empty form live regions remain in the accessibility tree', () => {
  assert.doesNotMatch(css, /\.(?:error-message|form-status):empty\s*\{[^}]*display:\s*none\s*;/);
  assert.match(css, /\.(?:error-message|form-status):empty\s*\{[^}]*(?:clip-path|clip|height:\s*1px)/);
});

test('CSS avoids forbidden visual patterns', () => {
  assert.doesNotMatch(css, /blur\(/i);
  assert.doesNotMatch(css, /glassmorphism/i);
  assert.doesNotMatch(css, /orb/i);
  assert.doesNotMatch(css, /bokeh/i);
  assert.doesNotMatch(css, /linear-gradient\([^)]*purple/i);
});

test('concept 2 CSS implements the local growth design contract', () => {
  for (const token of ['#1F3A5F', '#C1622D', '#F5EFE6', '#FBF8F2', '#F05000', 'Fraunces', 'Karla', 'IBM Plex Mono']) {
    assert.match(concept2Css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Concept 2 CSS should include ${token}`);
  }
  assert.match(concept2Css, /local-proof|growth-path|neighborhood|community|warm-accent/i);
  assert.match(concept2Css, /html\.js\s+\.nav-menu\s*\{[^}]*display:\s*none\s*;/);
  assert.doesNotMatch(concept2Css, /blur\(|glassmorphism|orb|bokeh/i);
});

test('concept 2 navigation toggle has desktop-hidden and mobile control styling', () => {
  const defaultToggle = concept2Css.match(/\.nav-toggle\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(defaultToggle, /display:\s*none\s*;/, 'the JavaScript-inserted toggle should be hidden by default');

  const mobileStyles = concept2Css.match(/@media\s*\(max-width:\s*760px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  const mobileToggle = mobileStyles.match(/\.nav-toggle\s*\{([^}]*)\}/)?.[1] ?? '';
  assert.match(mobileToggle, /display:\s*(?:inline-flex|flex)\s*;/, 'the toggle should be visible on mobile');
  assert.match(mobileToggle, /(?:background|border|color):\s*[^;]+;/, 'the mobile toggle should have a visible control treatment');
});

test('concept 2 styles skip links and local-growth line icons', () => {
  assert.match(concept2Css, /\.skip-link\s*\{[^}]*position:\s*fixed/is, 'Concept 2 should visually hide skip links until focus');
  assert.match(concept2Css, /\.skip-link:focus[^{}]*\{[^}]*transform:\s*translateY\(0\)/is, 'Concept 2 skip links should become visible on focus');
  assert.match(concept2Css, /\.line-icon\s*\{[^}]*display:\s*inline-flex/is, 'Concept 2 line icons should have a stable inline-flex frame');
  assert.match(concept2Css, /\.line-icon svg\s*\{[^}]*stroke-width:\s*2/is, 'Concept 2 icons should use Lucide-style stroke weight');
  assert.match(concept2Css, /\.stage-icon\s*\{[^}]*display:\s*inline-flex/is, 'Concept 2 growth-path icons should have a stable inline-flex frame');
});

test('concept 2 anchored insight cards clear the sticky header', () => {
  assert.match(concept2Css, /\.article-grid article\[id\]\s*\{[^}]*scroll-margin-top:\s*(?:9|10|11|12)rem\s*;/is);
});

test('concept 3 CSS implements the website care redesign design contract', () => {
  for (const token of ['#1F3A5F', '#C1622D', '#F5EFE6', '#FBF8F2', '#F05000', 'Fraunces', 'Karla', 'IBM Plex Mono']) {
    assert.match(concept3Css, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Concept 3 CSS should include ${token}`);
  }
  assert.match(concept3Css, /redesign-path|care-standard|launch-readiness|conversion-path|maintenance-rhythm/i);
  assert.match(concept3Css, /html\.js\s+\.nav-menu\s*\{[^}]*display:\s*none\s*;/);
  assert.match(concept3Css, /\.line-icon svg\s*\{[^}]*stroke-width:\s*2/is);
  assert.doesNotMatch(concept3Css, /blur\(|glassmorphism|orb|bokeh/i);
});

test('concept 3 anchored insight cards clear the sticky header', () => {
  assert.match(concept3Css, /\.article-grid article\[id\]\s*\{[^}]*scroll-margin-top:\s*(?:9|10|11|12)rem\s*;/is);
});
