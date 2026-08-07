import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import test from "node:test";

const htmlPath = "index.html";

function readHtml() {
  return readFileSync(htmlPath, "utf8");
}

test("site includes the approved StoryBrand sections and CTAs", () => {
  assert.equal(existsSync(htmlPath), true);
  const html = readHtml();

  for (const id of ["problem", "guide", "plan", "services", "transformation", "audit"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /Request Your Digital Growth Audit/g);
  assert.match(html, /See How We Help/);
  assert.match(html, /Audit[\s\S]*Build[\s\S]*Optimize/);
});

test("audit form captures the required lead qualification fields", () => {
  const html = readHtml();

  for (const id of ["audit-form", "name", "email", "business", "website", "challenge"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /name="services"/);
  assert.match(html, /Website design/);
  assert.match(html, /Digital marketing/);
  assert.match(html, /Automation/);
  assert.match(html, /Ongoing support/);
});

test("brand assets, fonts, and static files are wired for a portable static site", () => {
  const html = readHtml();

  assert.match(html, /assets\/ozmo-logo\.png/);
  assert.match(html, /Fraunces/);
  assert.match(html, /Karla/);
  assert.match(html, /styles\.css/);
  assert.match(html, /script\.js/);
});
