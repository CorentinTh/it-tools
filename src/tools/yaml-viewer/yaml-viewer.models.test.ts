import { describe, expect, it, vi } from 'vitest';
import { Document, parseDocument } from 'yaml';
import {
  assertYamlDocumentWithinLimits,
  assertYamlOutputWithinLimits,
  formatYaml,
} from './yaml-viewer.models';
import { YAML_MAX_DEPTH, YamlTaskError } from './yaml-viewer.worker.protocol';

function expectErrorCode(action: () => unknown, code: YamlTaskError['code']): void {
  try {
    action();
    throw new Error('Expected YAML formatting to fail.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(YamlTaskError);
    expect((error as YamlTaskError).code).toBe(code);
  }
}

function task(source: string, overrides: Partial<{ indentSize: number; sortKeys: boolean }> = {}) {
  return {
    operation: 'format' as const,
    source,
    indentSize: overrides.indentSize ?? 2,
    sortKeys: overrides.sortKeys ?? false,
  };
}

describe('YAML formatter model', () => {
  it('parses exactly once and preserves formatting settings', () => {
    const parseOnce = vi.fn((source: string, options?: Parameters<typeof parseDocument>[1]) => parseDocument(source, options));

    expect(formatYaml(task('z:\n  b: 2\n  a: 1\na: 0', { indentSize: 4, sortKeys: true }), parseOnce)).toBe(
      'a: 0\nz:\n    a: 1\n    b: 2\n',
    );
    expect(parseOnce).toHaveBeenCalledOnce();
  });

  it('preserves current empty, Unicode, sequence, and anchor behavior', () => {
    expect(formatYaml(task(''))).toBe('null\n');
    expect(formatYaml(task('message: 😀\nitems: [one, two]'))).toBe(
      'message: 😀\nitems:\n  - one\n  - two\n',
    );
    expect(formatYaml(task('base: &base\n  enabled: true\ncopy: *base'))).toBe(
      'base: &a1\n  enabled: true\ncopy: *a1\n',
    );
  });

  it('preserves integers beyond the JavaScript safe-number range, including aliases', () => {
    expect(formatYaml(task([
      'maximum: 18446744073709551615',
      'minimum: -18446744073709551615',
      'anchor: &large 17478252242305210114',
      'copy: *large',
      'decimal: 1.234567890123456789',
    ].join('\n')))).toBe([
      'maximum: 18446744073709551615',
      'minimum: -18446744073709551615',
      'anchor: 17478252242305210114',
      'copy: 17478252242305210114',
      'decimal: 1.2345678901234567',
      '',
    ].join('\n'));
  });

  it('returns structured syntax errors for malformed and multiple documents', () => {
    expectErrorCode(() => formatYaml(task('a: [1')), 'syntax');
    expectErrorCode(() => formatYaml(task('a: 1\n---\nb: 2')), 'syntax');
  });

  it('enforces collection depth and node-count limits before JS conversion', () => {
    const accepted = `[${'['.repeat(YAML_MAX_DEPTH - 1)}0${']'.repeat(YAML_MAX_DEPTH - 1)}]`;
    const rejected = `[${'['.repeat(YAML_MAX_DEPTH)}0${']'.repeat(YAML_MAX_DEPTH)}]`;

    expect(formatYaml(task(accepted))).toContain('0');
    expectErrorCode(() => formatYaml(task(rejected)), 'limit');

    const smallDocument = parseDocument('a:\n  - one\n  - two', { logLevel: 'silent' });
    expectErrorCode(
      () => assertYamlDocumentWithinLimits(smallDocument, { maxDepth: YAML_MAX_DEPTH, maxNodes: 2 }),
      'limit',
    );
  });

  it('rejects excessive alias expansion as a limit error', () => {
    const source = [
      'a: &a [one, two]',
      'b: &b [*a, *a]',
      'c: &c [*b, *b]',
      'd: &d [*c, *c]',
      'e: &e [*d, *d]',
      'f: &f [*e, *e]',
      'g: [*f, *f]',
    ].join('\n');

    expectErrorCode(() => formatYaml(task(source)), 'limit');
  });

  it('rejects scalar-alias output amplification before full serialization', () => {
    const source = [
      `payload: &payload ${'x'.repeat(100_000)}`,
      ...Array.from({ length: 49 }, (_unused, index) => `copy${index}: *payload`),
    ].join('\n');
    const serialize = vi.spyOn(Document.prototype, 'toString');

    try {
      expectErrorCode(() => formatYaml(task(source)), 'limit');
      expect(serialize).not.toHaveBeenCalled();
    }
    finally {
      serialize.mockRestore();
    }
  });

  it('rejects deep-sequence indentation amplification before full serialization', () => {
    const source = `${'['.repeat(YAML_MAX_DEPTH - 1)}${Array(17_000).fill('0').join(',')}${']'.repeat(YAML_MAX_DEPTH - 1)}`;
    const serialize = vi.spyOn(Document.prototype, 'toString');

    try {
      expectErrorCode(() => formatYaml(task(source, { indentSize: 1 })), 'limit');
      expect(serialize).not.toHaveBeenCalled();
    }
    finally {
      serialize.mockRestore();
    }
  });

  it('upper-bounds escaped multiline scalars that use physical continuation lines', () => {
    let root: unknown = (`${'\0'.repeat(30)}\n`).repeat(100);
    for (let depth = 0; depth < 8; depth += 1) {
      root = { a: root };
    }

    const actualOutput = new Document(root).toString({ indent: 10, lineWidth: 0 });
    const outputLimit = 13_800;

    expect(new TextEncoder().encode(actualOutput).byteLength).toBeGreaterThan(outputLimit);
    expectErrorCode(() => assertYamlOutputWithinLimits(root, 10, outputLimit), 'limit');
  });

  it('accounts for escaped whitespace next to physical continuation lines', () => {
    let root: unknown = ' \n'.repeat(1_000);
    for (let depth = 0; depth < 8; depth += 1) {
      root = { a: root };
    }

    const actualOutput = new Document(root).toString({ indent: 10, lineWidth: 0 });
    const actualBytes = new TextEncoder().encode(actualOutput).byteLength;
    const outputLimit = actualBytes - 1;

    expect(actualBytes).toBeGreaterThan(outputLimit);
    expectErrorCode(() => assertYamlOutputWithinLimits(root, 10, outputLimit), 'limit');
  });

  it('rejects scalar-alias amplification with a space escaped on both sides', () => {
    const source = [
      `payload: &payload "${'\\n \\nx'.repeat(7_000)}\\f"`,
      ...Array.from({ length: 49 }, (_unused, index) => `copy${index}: *payload`),
    ].join('\n');
    const serialize = vi.spyOn(Document.prototype, 'toString');

    try {
      expectErrorCode(() => formatYaml(task(source)), 'limit');
      expect(serialize).not.toHaveBeenCalled();
    }
    finally {
      serialize.mockRestore();
    }
  });

  it('accepts an ordinary one-megabyte scalar when its output fits the cap', () => {
    expect(() => assertYamlOutputWithinLimits({ payload: 'x'.repeat(1024 * 1024) }, 2)).not.toThrow();
  });

  it('accepts a flat document close to the advertised node limit', () => {
    const output = formatYaml(task(`[${Array(90_000).fill('0').join(',')}]`));

    expect(output).toHaveLength(90_000 * '- 0\n'.length);
  });
});
