import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('dependency resolution contract', () => {
  it('keeps route metadata independent from the retired legacy Unhead package', () => {
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
      dependencies?: Record<string, string>
    };
    const lockfile = readFileSync(new URL('../pnpm-lock.yaml', import.meta.url), 'utf8');

    expect(packageJson.dependencies?.['@vueuse/head']).toBeUndefined();
    expect(lockfile).not.toContain('@vueuse/head');
    expect(lockfile).not.toContain('@unhead/vue');
  });
});
