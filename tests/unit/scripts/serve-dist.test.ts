import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { resolveRequestPath, resolveStaticRoot } from '../../../scripts/serve-dist';

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('resolveStaticRoot', () => {
  it('uses dist/client when Astro server builds move static assets there', () => {
    const root = mkdtempSync(join(tmpdir(), 'ozmo-dist-'));
    tempDirs.push(root);
    mkdirSync(join(root, 'dist', 'client'), { recursive: true });

    expect(resolveStaticRoot(root)).toBe(join(root, 'dist', 'client'));
  });

  it('falls back to dist for static-only Astro builds', () => {
    const root = mkdtempSync(join(tmpdir(), 'ozmo-dist-'));
    tempDirs.push(root);
    mkdirSync(join(root, 'dist'), { recursive: true });

    expect(resolveStaticRoot(root)).toBe(join(root, 'dist'));
  });
});

describe('resolveRequestPath', () => {
  it('serves the 404 page from the selected static root', () => {
    const root = mkdtempSync(join(tmpdir(), 'ozmo-dist-'));
    tempDirs.push(root);
    const staticRoot = join(root, 'dist', 'client');
    mkdirSync(staticRoot, { recursive: true });
    writeFileSync(join(staticRoot, '404.html'), 'not found');

    expect(resolveRequestPath('/missing', { root: staticRoot, host: '127.0.0.1', port: 4321 }))
      .toEqual({
        filePath: join(staticRoot, '404.html'),
        status: 404,
      });
  });
});
