// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const TASK_SOURCES = [
  '../../tools/file-hash/file-hash.vue',
  '../../tools/json-schema-validator/json-schema-validator.vue',
  '../../tools/regex-tester/regex-tester.vue',
] as const;

describe('explicit task layout contract', () => {
  it.each(TASK_SOURCES)('%s uses the shared action, status, and result slots', (relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');

    expect(source).toContain('c-task-layout');
    expect(source).toContain('class="c-task-actions"');
    expect(source).toContain('class="c-task-status"');
    expect(source).toContain('class="c-task-results"');
  });

  it('keeps JSON Schema inputs vertical because it is not a diff tool', () => {
    const source = readFileSync(
      new URL('../../tools/json-schema-validator/json-schema-validator.vue', import.meta.url),
      'utf8',
    );

    expect(source).toContain('<div class="c-tool-stack">');
    expect(source).not.toContain('xl:grid-cols-2');
  });

  it('keeps Regex wide and uses the shared independent-choice group', () => {
    const source = readFileSync(
      new URL('../../tools/regex-tester/regex-tester.vue', import.meta.url),
      'utf8',
    );

    expect(source).toContain('class="c-tool-workbench c-task-layout"');
    expect(source.match(/<CCheckbox/g)).toHaveLength(6);
    expect(source).toContain('<CChoiceGroup');
    expect(source).not.toContain('<n-checkbox');
    expect(source).not.toContain('max-w-600px');
  });
});
