import { readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const fontDir = resolve(process.cwd(), 'src/assets/fonts');
const maxCompressedBytes = 110 * 1024;
const requiredFonts = [
  'sora-latin-600-normal.woff2',
  'sora-latin-700-normal.woff2',
  'source-sans-3-latin-400-normal.woff2',
  'source-sans-3-latin-600-normal.woff2',
];

describe('font loading budget', () => {
  it('ships only the required self-hosted WOFF2 font files', () => {
    const files = readdirSync(fontDir).filter((file) => file.endsWith('.woff2')).sort();

    expect(files).toEqual(requiredFonts);
  });

  it('keeps the total compressed WOFF2 payload at or below 110 KB', () => {
    const totalBytes = requiredFonts.reduce((total, file) => {
      return total + statSync(resolve(fontDir, file)).size;
    }, 0);

    expect(totalBytes).toBeLessThanOrEqual(maxCompressedBytes);
  });
});
