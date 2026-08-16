// @vitest-environment node

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function collectVueFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return collectVueFiles(path);
    }
    return entry.isFile() && entry.name.endsWith('.vue') ? [path] : [];
  });
}

describe('route control adapter contract', () => {
  it('keeps direct Naive switches out of every tool component', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const offenders = collectVueFiles(toolsDirectory)
      .filter(path => readFileSync(path, 'utf8').includes('<n-switch'));

    expect(offenders).toEqual([]);
  });

  it('keeps direct Naive number inputs out of every tool component', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const offenders = collectVueFiles(toolsDirectory)
      .filter(path => readFileSync(path, 'utf8').includes('<n-input-number'));

    expect(offenders).toEqual([]);
  });

  it('keeps direct Naive checkboxes out of every tool component', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const offenders = collectVueFiles(toolsDirectory)
      .filter(path => readFileSync(path, 'utf8').includes('<n-checkbox'));

    expect(offenders).toEqual([]);
  });

  it('keeps direct Naive color pickers out of every tool component', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const offenders = collectVueFiles(toolsDirectory)
      .filter(path => readFileSync(path, 'utf8').includes('<n-color-picker'));

    expect(offenders).toEqual([]);
  });

  it('keeps direct Naive form items out of every tool component', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const offenders = collectVueFiles(toolsDirectory)
      .filter(path => readFileSync(path, 'utf8').includes('<n-form-item'));

    expect(offenders).toEqual([]);
  });

  it('keeps fixed Naive input groups out of every tool component', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const offenders = collectVueFiles(toolsDirectory)
      .filter(path => /<n-input-group(?:\s|>)/.test(readFileSync(path, 'utf8')));

    expect(offenders).toEqual([]);
  });

  it('keeps direct Naive text inputs and selects out of every tool component', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const directControlPattern = /<(?:n-input|NInput|n-select|NSelect)(?:\s|>)/;
    const offenders = collectVueFiles(toolsDirectory)
      .filter(path => directControlPattern.test(readFileSync(path, 'utf8')));

    expect(offenders).toEqual([]);
  });

  it('keeps literal label widths out of every tool component', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const offenders = collectVueFiles(toolsDirectory)
      .filter(path => /label-width=|labelWidth/.test(readFileSync(path, 'utf8')));

    expect(offenders).toEqual([]);
  });

  it('limits template width exceptions to documented media, compact-option, and catalog routes', () => {
    const toolsDirectory = new URL('../../tools', import.meta.url).pathname;
    const allowed = [
      'emoji-picker/emoji-picker.vue',
      'image-metadata-remover/image-metadata-remover.vue',
      'json-schema-validator/json-schema-validator.vue',
      'svg-placeholder-generator/svg-placeholder-generator.vue',
    ].map(path => join(toolsDirectory, path)).sort();
    const templateWidthPattern = /style="[^"]*(?:width|max-width|min-width)|\bmax-w-/;
    const exceptions = collectVueFiles(toolsDirectory)
      .filter(path => templateWidthPattern.test(readFileSync(path, 'utf8')))
      .sort();

    expect(exceptions).toEqual(allowed);
  });
});
