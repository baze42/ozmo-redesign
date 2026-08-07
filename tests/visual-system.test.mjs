import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function css() {
  return readFileSync("styles.css", "utf8");
}

function token(source, name) {
  return source.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"))?.[1];
}

function luminance(hex) {
  const channels = hex.match(/[0-9a-f]{2}/gi).map((channel) => parseInt(channel, 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
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

test("Guide and Audit body copy styling excludes section kickers", () => {
  const source = css();

  assert.match(
    source,
    /\.guide > p:not\(\.section-kicker\),\s*\.audit-copy > p:not\(\.section-kicker\)\s*\{/,
  );
});

test("CTA and kicker text colors meet WCAG AA contrast", () => {
  const source = css();
  const darkTerracotta = token(source, "terracotta-700");
  const background = token(source, "background");
  const buttonRule = source.match(/\.button\s*\{([^}]*)\}/)?.[1] || "";
  const kickerRule = source.match(/\.eyebrow,\s*\.section-kicker\s*\{([^}]*)\}/)?.[1] || "";

  assert.match(buttonRule, /background:\s*var\(--terracotta-700\)/);
  assert.match(kickerRule, /color:\s*var\(--terracotta-700\)/);
  assert.ok(contrast("#ffffff", darkTerracotta) >= 4.5);
  assert.ok(contrast(darkTerracotta, background) >= 4.5);
});

test("reduced motion disables smooth scrolling and button movement", () => {
  const source = css();

  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*scroll-behavior:\s*auto/);
  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*transition:\s*none/);
});

test("visual system avoids overdone generic decoration and keeps cards restrained", () => {
  const source = css().toLowerCase();

  for (const forbidden of ["radial-gradient", "gradient-orb", "bokeh", "blob"]) {
    assert.equal(source.includes(forbidden), false);
  }

  assert.match(source, /--radius-card:\s*8px/);
  assert.match(source, /\.service-card[\s\S]*border-radius:\s*var\(--radius-card\)/);
});
