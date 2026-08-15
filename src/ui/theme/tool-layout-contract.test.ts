// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const STACKED_TRANSFORMER_SOURCES = [
  '../../tools/base64-string-converter/base64-string-converter.vue',
  '../../tools/base64-file-converter/base64-file-converter.vue',
  '../../tools/docker-run-to-docker-compose-converter/docker-run-to-docker-compose-converter.vue',
  '../../tools/email-normalizer/email-normalizer.vue',
  '../../tools/encryption/encryption.vue',
  '../../tools/hash-text/hash-text.vue',
  '../../tools/html-entities/html-entities.vue',
  '../../tools/hmac-generator/hmac-generator.vue',
  '../../tools/json-viewer/json-viewer.vue',
  '../../tools/list-converter/list-converter.vue',
  '../../tools/markdown-to-html/markdown-to-html.vue',
  '../../tools/meta-tag-generator/meta-tag-generator.vue',
  '../../tools/safelink-decoder/safelink-decoder.vue',
  '../../tools/slugify-string/slugify-string.vue',
  '../../tools/sql-prettify/sql-prettify.vue',
  '../../tools/string-obfuscator/string-obfuscator.vue',
  '../../tools/text-to-binary/text-to-binary.vue',
  '../../tools/text-to-unicode/text-to-unicode.vue',
  '../../tools/url-encoder/url-encoder.vue',
  '../../tools/xml-formatter/xml-formatter.vue',
  '../../tools/yaml-viewer/yaml-viewer.vue',
] as const;

const STANDARDIZED_FORMATTER_OPTIONS = [
  '../../tools/json-viewer/json-viewer.vue',
  '../../tools/xml-formatter/xml-formatter.vue',
  '../../tools/yaml-viewer/yaml-viewer.vue',
] as const;

describe('non-diff transformer layout contract', () => {
  it.each(STACKED_TRANSFORMER_SOURCES)('%s opts into the wide vertical workbench', (relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');

    expect(source).toContain('class="c-tool-workbench c-tool-stack"');
  });

  it('defines a vertical stack and reserves side-by-side editors for diff tools', () => {
    const source = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

    expect(source).toMatch(/\.c-tool-stack\s*\{[^}]*flex-direction:\s*column/s);
    expect(source).toContain('Only real diff tools may use');
  });

  it.each(STANDARDIZED_FORMATTER_OPTIONS)('%s uses shared switch and numeric adapters', (relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');

    expect(source).toContain('<CSwitch');
    expect(source).toContain('<CInputNumber');
    expect(source).not.toContain('<n-switch');
    expect(source).not.toContain('<n-input-number');
    expect(source).not.toContain('<n-form-item');
    expect(source).not.toMatch(/width:\s*100px|w-100px/);
  });
});
