import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";

const images = [
  "assets/images/hero-growth-audit.png",
  "assets/images/pain-points-workspace.png",
  "assets/images/connected-systems.png",
  "assets/images/audit-detail.png"
];

const optimizedImages = [
  "hero-growth-audit-560w.avif",
  "hero-growth-audit-560w.webp",
  "hero-growth-audit-1122w.avif",
  "hero-growth-audit-1122w.webp",
  "pain-points-workspace-640w.avif",
  "pain-points-workspace-640w.webp",
  "pain-points-workspace-1200w.avif",
  "pain-points-workspace-1200w.webp",
  "connected-systems-500w.avif",
  "connected-systems-500w.webp",
  "connected-systems-1003w.avif",
  "connected-systems-1003w.webp",
  "audit-detail-640w.avif",
  "audit-detail-640w.webp",
  "audit-detail-1200w.avif",
  "audit-detail-1200w.webp"
].map((name) => `assets/images/optimized/${name}`);

test("generated image assets exist in the project and are non-trivial files", () => {
  for (const image of images) {
    assert.equal(existsSync(image), true, `${image} should exist`);
    assert.ok(statSync(image).size > 50_000, `${image} should be a real generated image`);
  }
});

test("image prompt documentation records every asset and production prompt", () => {
  const docs = readFileSync("docs/image-prompts.md", "utf8");

  for (const image of images) {
    assert.match(docs, new RegExp(image));
  }

  for (const phrase of [
    "photorealistic-natural",
    "productivity-visual",
    "No watermarks",
    "No stock-photo handshake imagery"
  ]) {
    assert.match(docs, new RegExp(phrase));
  }
});

test("content images use responsive AVIF and WebP sources with intentional loading priority", () => {
  const dom = new JSDOM(readFileSync("index.html", "utf8"));
  const pictures = Array.from(dom.window.document.querySelectorAll("main picture"));

  assert.equal(pictures.length, 4);
  for (const picture of pictures) {
    assert.match(picture.querySelector('source[type="image/avif"]').getAttribute("srcset"), /\.avif\s+\d+w/);
    assert.match(picture.querySelector('source[type="image/webp"]').getAttribute("srcset"), /\.webp\s+\d+w/);
    assert.ok(picture.querySelector("img").hasAttribute("width"));
    assert.ok(picture.querySelector("img").hasAttribute("height"));
  }

  const hero = pictures[0].querySelector("img");
  assert.equal(hero.getAttribute("fetchpriority"), "high");
  assert.notEqual(hero.getAttribute("loading"), "lazy");

  for (const picture of pictures.slice(1)) {
    assert.equal(picture.querySelector("img").getAttribute("loading"), "lazy");
  }
});

test("optimized image variants exist within the delivery byte budget", () => {
  let totalBytes = 0;

  for (const image of optimizedImages) {
    assert.equal(existsSync(image), true, `${image} should be generated`);
    totalBytes += statSync(image).size;
  }

  assert.ok(totalBytes <= 1_500_000, `optimized variants total ${totalBytes} bytes`);
  assert.equal(existsSync("scripts/optimize-images.mjs"), true);
});
