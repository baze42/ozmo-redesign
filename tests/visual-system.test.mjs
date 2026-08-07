import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function css() {
  return readFileSync("styles.css", "utf8");
}

test("CSS defines the approved palette and typography as reusable tokens", () => {
  const source = css();

  for (const token of ["#1F3A5F", "#C1622D", "#F5EFE6", "#2A2725", "Fraunces", "Karla"]) {
    assert.match(source, new RegExp(token.replace("#", "\\#")));
  }
});

test("responsive layout uses stable dimensions and mobile breakpoints", () => {
  const source = css();

  assert.match(source, /@media\s*\(max-width:\s*900px\)/);
  assert.match(source, /@media\s*\(max-width:\s*640px\)/);
  assert.match(source, /aspect-ratio/);
  assert.match(source, /scroll-margin-top/);
});

test("visual system avoids overdone generic decoration and keeps cards restrained", () => {
  const source = css().toLowerCase();

  for (const forbidden of ["radial-gradient", "gradient-orb", "bokeh", "blob"]) {
    assert.equal(source.includes(forbidden), false);
  }

  assert.match(source, /--radius-card:\s*8px/);
  assert.match(source, /\.service-card[\s\S]*border-radius:\s*var\(--radius-card\)/);
});
