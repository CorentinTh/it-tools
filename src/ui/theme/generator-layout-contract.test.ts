// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const CONFIGURABLE_GENERATOR_SOURCES = [
  '../../tools/nanoid-generator/nanoid-generator.vue',
  '../../tools/uuid-generator/uuid-generator.vue',
  '../../tools/ulid-generator/ulid-generator.vue',
  '../../tools/token-generator/token-generator.tool.vue',
  '../../tools/mac-address-generator/mac-address-generator.vue',
  '../../tools/ipv6-ula-generator/ipv6-ula-generator.vue',
  '../../tools/lorem-ipsum-generator/lorem-ipsum-generator.vue',
  '../../tools/svg-placeholder-generator/svg-placeholder-generator.vue',
] as const;

const SIMPLE_GENERATOR_SOURCES = [
  '../../tools/random-port-generator/random-port-generator.vue',
] as const;

describe('identifier generator layout contract', () => {
  it.each(CONFIGURABLE_GENERATOR_SOURCES)('%s follows NanoID options -> output -> actions order', (relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    const optionsIndex = source.indexOf('class="c-generator-options"');
    const outputIndex = source.indexOf('class="c-generator-output"');
    const actionsIndex = source.indexOf('class="c-generator-actions"');

    expect(source).toContain('class="c-generator-layout"');
    expect(optionsIndex).toBeGreaterThan(-1);
    expect(outputIndex).toBeGreaterThan(optionsIndex);
    expect(actionsIndex).toBeGreaterThan(outputIndex);
  });

  it.each(SIMPLE_GENERATOR_SOURCES)('%s follows the shared output -> actions order', (relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    const outputIndex = source.indexOf('class="c-generator-output"');
    const actionsIndex = source.indexOf('class="c-generator-actions"');

    expect(source).toContain('class="c-generator-layout"');
    expect(outputIndex).toBeGreaterThan(-1);
    expect(actionsIndex).toBeGreaterThan(outputIndex);
  });

  it('defines one responsive generator rhythm in the shared tokens', () => {
    const source = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

    expect(source).toMatch(/\.c-generator-layout\s*\{[^}]*flex-direction:\s*column/s);
    expect(source).toMatch(/\.c-generator-actions\s*\{[^}]*flex-wrap:\s*wrap/s);
  });
});
