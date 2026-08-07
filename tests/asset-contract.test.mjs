import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageRoot = path.join(repoRoot, 'concepts/01-digital-operations-partner/assets/img');
const prompts = fs.readFileSync(path.join(imageRoot, 'prompts.md'), 'utf8');
const images = [
  'hero-digital-operations.png',
  'audit-desk.png',
  'systems-map.png',
  'owner-focus.png',
  'insights-workshop.png',
];

test('all required image targets exist and are non-empty PNG files', () => {
  for (const image of images) {
    const file = path.join(imageRoot, image);
    assert.ok(fs.existsSync(file), `${image} should exist`);
    const buffer = fs.readFileSync(file);
    assert.ok(buffer.length > 10_000, `${image} should be a real image asset, not an empty file`);
    assert.equal(buffer.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${image} should be a PNG`);
  }
});

test('every generated PNG has a smaller WebP delivery derivative', () => {
  for (const image of images) {
    const png = path.join(imageRoot, image);
    const webp = path.join(imageRoot, image.replace(/\.png$/, '.webp'));
    assert.ok(fs.existsSync(webp), `${image} should have a WebP derivative`);
    assert.ok(fs.statSync(webp).size < fs.statSync(png).size, `${path.basename(webp)} should be smaller than its PNG original`);
    assert.equal(fs.readFileSync(webp).subarray(0, 4).toString('ascii'), 'RIFF', `${path.basename(webp)} should be a WebP file`);
  }
});

test('prompt documentation names every image target and avoids fake-logo/text artifacts', () => {
  for (const image of images) {
    assert.match(prompts, new RegExp(image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(prompts, /no readable text/i);
  assert.match(prompts, /no logos/i);
  assert.match(prompts, /no watermark/i);
});
