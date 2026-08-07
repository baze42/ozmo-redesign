import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const concepts = [
  {
    label: 'Concept 1',
    imageRoot: path.join(repoRoot, 'concepts/01-digital-operations-partner/assets/img'),
    images: [
      'hero-digital-operations.png',
      'audit-desk.png',
      'systems-map.png',
      'owner-focus.png',
      'insights-workshop.png',
    ],
  },
  {
    label: 'Concept 2',
    imageRoot: path.join(repoRoot, 'concepts/02-local-growth-studio/assets/img'),
    images: [
      'hero-local-growth.png',
      'local-search-map.png',
      'owner-welcome.png',
      'community-planning.png',
      'marketing-rhythm.png',
    ],
  },
];

test('all required image targets exist and are non-empty PNG files', () => {
  for (const concept of concepts) {
    for (const image of concept.images) {
      const file = path.join(concept.imageRoot, image);
      assert.ok(fs.existsSync(file), `${concept.label} ${image} should exist`);
      const buffer = fs.readFileSync(file);
      assert.ok(buffer.length > 10_000, `${concept.label} ${image} should be a real image asset, not an empty file`);
      assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${concept.label} ${image} should be a PNG`);
    }
  }
});

test('every generated PNG has a smaller WebP delivery derivative', () => {
  for (const concept of concepts) {
    for (const image of concept.images) {
      const png = path.join(concept.imageRoot, image);
      const webp = path.join(concept.imageRoot, image.replace(/\.png$/, '.webp'));
      assert.ok(fs.existsSync(webp), `${concept.label} ${image} should have a WebP derivative`);
      assert.ok(fs.statSync(webp).size < fs.statSync(png).size, `${concept.label} ${path.basename(webp)} should be smaller than its PNG original`);
      assert.equal(fs.readFileSync(webp).subarray(0, 4).toString('ascii'), 'RIFF', `${concept.label} ${path.basename(webp)} should be a WebP file`);
    }
  }
});

test('prompt documentation names every image target and avoids fake-logo/text artifacts', () => {
  for (const concept of concepts) {
    const prompts = fs.readFileSync(path.join(concept.imageRoot, 'prompts.md'), 'utf8');
    for (const image of concept.images) {
      assert.match(prompts, new RegExp(image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${concept.label} prompts should name ${image}`);
    }
    assert.match(prompts, /no readable text/i, `${concept.label} prompts should forbid readable text`);
    assert.match(prompts, /no logos/i, `${concept.label} prompts should forbid logos`);
    assert.match(prompts, /no watermark/i, `${concept.label} prompts should forbid watermarks`);
  }
});
