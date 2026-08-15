// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), 'utf8');
}

describe('form layout contract', () => {
  it('keeps dense list options responsive and the transformer vertical', () => {
    const source = readSource('../../tools/list-converter/list-converter.vue');

    expect(source).toContain('class="c-tool-workbench c-tool-stack"');
    expect(source).toContain('<CSwitch');
    expect(source).not.toContain('<n-switch');
    expect(source).not.toMatch(/label-width=["'](?:120|130|150)(?:px)?["']/);
  });

  it('uses full-width fields with a result below the Wi-Fi form', () => {
    const source = readSource('../../tools/wifi-qr-code-generator/wifi-qr-code-generator.vue');
    const formIndex = source.indexOf('<c-card>');
    const resultIndex = source.indexOf('data-test-id="wifi-qrcode-result"');

    expect(source).toContain('class="c-form-layout"');
    expect(source).toContain('<c-field');
    expect(source).not.toMatch(/label-width=["']130px["']/);
    expect(resultIndex).toBeGreaterThan(formIndex);
  });

  it('uses equal responsive columns for all percentage calculator groups', () => {
    const source = readSource('../../tools/percentage-calculator/percentage-calculator.vue');

    expect(source).toContain('class="c-form-layout"');
    expect(source.match(/sm:grid-cols-3/g)).toHaveLength(3);
    expect(source.match(/<c-field/g)).toHaveLength(9);
    expect(source.match(/<CInputNumber/g)).toHaveLength(6);
    expect(source).not.toContain('<n-input-number');
    expect(source).not.toContain('max-width: 150px');
  });

  it('defines one full-width vertical form rhythm in the shared tokens', () => {
    const source = readSource('./tokens.css');

    expect(source).toMatch(/\.c-form-layout\s*\{[^}]*width:\s*100%/s);
    expect(source).toMatch(/\.c-form-layout\s*\{[^}]*flex-direction:\s*column/s);
  });
});
