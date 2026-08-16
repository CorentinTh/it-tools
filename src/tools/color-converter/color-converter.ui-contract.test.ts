// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Color Converter UI contract', () => {
  it('associates the external OKLCH field label with the native input', () => {
    const source = readFileSync(new URL('./color-converter.vue', import.meta.url), 'utf8');

    expect(source).toContain('label="CSS OKLCH" label-for="color-converter-oklch"');
    expect(source).toContain('<c-input-text id="color-converter-oklch"');
  });
});
