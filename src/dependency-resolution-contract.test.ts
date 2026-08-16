import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('dependency resolution contract', () => {
  it('keeps legacy Unhead on a Vue 3.3-compatible VueUse shared runtime', () => {
    const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
      pnpm?: { overrides?: Record<string, string> }
    };
    const lockfile = readFileSync(new URL('../pnpm-lock.yaml', import.meta.url), 'utf8');

    expect(packageJson.pnpm?.overrides?.['@unhead/vue>@vueuse/shared']).toBe('10.3.0');
    expect(lockfile).toContain('\'@unhead/vue>@vueuse/shared\': 10.3.0');
    expect(lockfile).toMatch(/'@unhead\/vue@0\.5\.1\(vue@3\.3\.4\)':\n(?:.|\n)*?\s+'@vueuse\/shared': 10\.3\.0\(vue@3\.3\.4\)/);
  });
});
