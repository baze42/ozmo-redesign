import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";

const images = [
  "assets/images/hero-growth-audit.png",
  "assets/images/pain-points-workspace.png",
  "assets/images/connected-systems.png",
  "assets/images/audit-detail.png"
];

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
