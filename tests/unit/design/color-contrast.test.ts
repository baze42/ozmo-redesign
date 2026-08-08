import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const tokenFile = resolve(process.cwd(), 'src/styles/tokens.css');

const expectedTokens = {
  '--color-clean-surface': '#FAFAF7',
  '--color-white': '#FFFFFF',
  '--color-deep-ink': '#171923',
  '--color-muted-ink': '#4B5563',
  '--color-ozmo-blue': '#2B3F8F',
  '--color-after-blue-soft': '#EEF2FF',
  '--color-ozmo-orange': '#F45B00',
  '--color-action-orange-dark': '#B23A00',
  '--color-orange-soft': '#FFF1E8',
  '--color-signal-teal': '#00A6A6',
  '--color-signal-teal-dark': '#006B6B',
  '--color-teal-soft': '#E6F7F7',
  '--color-before-gray': '#D8DDE7',
  '--color-line-gray': '#B7C0D0',
} as const;

const approvedBodyTextPairs = [
  ['Deep Ink on Clean Surface', '#171923', '#FAFAF7', 16.74],
  ['Muted Ink on Clean Surface', '#4B5563', '#FAFAF7', 7.23],
  ['OZMO Blue on Clean Surface', '#2B3F8F', '#FAFAF7', 9.09],
  ['Action Orange Dark on Clean Surface', '#B23A00', '#FAFAF7', 5.74],
  ['Signal Teal Dark on Clean Surface', '#006B6B', '#FAFAF7', 6.06],
  ['White on OZMO Blue', '#FFFFFF', '#2B3F8F', 9.5],
  ['White on Action Orange Dark', '#FFFFFF', '#B23A00', 6.0],
  ['Deep Ink on Before Gray', '#171923', '#D8DDE7', 12.85],
  ['Muted Ink on Before Gray', '#4B5563', '#D8DDE7', 5.55],
  ['OZMO Blue on After Blue Soft', '#2B3F8F', '#EEF2FF', 8.5],
  ['Action Orange Dark on Orange Soft', '#B23A00', '#FFF1E8', 5.43],
  ['Signal Teal Dark on Teal Soft', '#006B6B', '#E6F7F7', 5.73],
] as const;

function readTokens() {
  const css = readFileSync(tokenFile, 'utf8');
  const variables = new Map<string, string>();

  for (const match of css.matchAll(/(--color-[a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)) {
    variables.set(match[1], match[2].toUpperCase());
  }

  return { css, variables };
}

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((start) => {
    const value = Number.parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

describe('OZMO color tokens', () => {
  it('defines every required color token with the exact spec value', () => {
    const { variables } = readTokens();

    expect(Object.fromEntries(variables)).toMatchObject(expectedTokens);
  });

  it('keeps approved body-text color pairings at WCAG AA contrast or better', () => {
    for (const [label, foreground, background, documentedRatio] of approvedBodyTextPairs) {
      const ratio = contrastRatio(foreground, background);

      expect(ratio, label).toBeGreaterThanOrEqual(4.5);
      expect(Math.abs(ratio - documentedRatio), label).toBeLessThan(0.05);
    }
  });

  it('documents that bright brand colors are decorative-only on clean surfaces', () => {
    const { css } = readTokens();

    expect(css).toContain('--color-ozmo-orange-role: decoration-only');
    expect(css).toContain('--color-signal-teal-role: decoration-only');
    expect(css).toContain('--color-line-gray-role: borders-only');
  });
});
