import { describe, expect, it, vi } from 'vitest';
import JSON5 from 'json5';
import { parseTree } from 'jsonc-parser';
import { formatJson, sortObjectKeys } from './json.models';
import { JSON_MAX_DEPTH, type JsonFormatMode, JsonTaskError } from './json-viewer.worker.protocol';

function task(
  source: string,
  overrides: Partial<{ indentSize: number; sortKeys: boolean; mode: JsonFormatMode }> = {},
) {
  return {
    operation: 'format' as const,
    source,
    indentSize: overrides.indentSize ?? 2,
    sortKeys: overrides.sortKeys ?? false,
    mode: overrides.mode ?? 'strict',
  };
}

function expectErrorCode(action: () => unknown, code: JsonTaskError['code']): void {
  try {
    action();
    throw new Error('Expected JSON formatting to fail.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(JsonTaskError);
    expect((error as JsonTaskError).code).toBe(code);
  }
}

describe('JSON formatter model', () => {
  it('parses strict JSON exactly once and preserves every scalar token lexeme', () => {
    const parseOnce = vi.fn(parseTree);
    const source = '{"large":17478252242305210114,"decimal":1.2300,"exponent":1E+09,"negativeZero":-0,"escaped":"\\uD83D\\uDE00","unicode":"Привет 😀"}';

    expect(formatJson(task(source), { parseStrict: parseOnce })).toBe([
      '{',
      '  "large": 17478252242305210114,',
      '  "decimal": 1.2300,',
      '  "exponent": 1E+09,',
      '  "negativeZero": -0,',
      '  "escaped": "\\uD83D\\uDE00",',
      '  "unicode": "Привет 😀"',
      '}',
    ].join('\n'));
    expect(parseOnce).toHaveBeenCalledOnce();
    expect(parseOnce).toHaveBeenCalledWith(source, expect.any(Array), {
      allowEmptyContent: false,
      allowTrailingComma: false,
      disallowComments: true,
    });
  });

  it('sorts keys recursively without changing number lexemes', () => {
    const source = '{"b":1e0,"a":2.00,"c":3E+0,"nested":{"z":-0,"a":17478252242305210114}}';

    expect(formatJson(task(source, { indentSize: 0, sortKeys: true }))).toBe(
      '{"a":2.00,"b":1e0,"c":3E+0,"nested":{"a":17478252242305210114,"z":-0}}',
    );
  });

  it('rejects duplicate strict keys before optional sorting can change their semantics', () => {
    const source = '{"a":1,"b":{"x":1,"x":2}}';

    expectErrorCode(() => formatJson(task(source, { sortKeys: false })), 'syntax');
    expectErrorCode(() => formatJson(task(source, { sortKeys: true })), 'syntax');
    expectErrorCode(() => formatJson(task('{"a":1,"\\u0061":2}')), 'syntax');
  });

  it('supports compact through ten-space indentation and preserves array order', () => {
    expect(formatJson(task('{"items":[3,2,1]}', { indentSize: 0 }))).toBe('{"items":[3,2,1]}');
    expect(formatJson(task('[{"a":1}]', { indentSize: 10 }))).toBe([
      '[',
      '          {',
      '                    "a": 1',
      '          }',
      ']',
    ].join('\n'));
  });

  it('keeps JSON5 behavior in an explicit compatibility mode and parses once', () => {
    const parseCompatibility = vi.fn(JSON5.parse);
    const source = '{unquoted:\'value\', trailing:[1, 2,], decimal:0.100000000000000005}';
    const formatted = formatJson(task(source, {
      indentSize: 0,
      sortKeys: true,
      mode: 'json5',
    }), { parseCompatibility });

    expect(parseCompatibility).toHaveBeenCalledOnce();
    expect(formatted).toContain('"unquoted":"value"');
    expect(formatted).toContain('"trailing":[1,2]');
    expect(formatted).toContain('"decimal":0.1');
  });

  it('serializes JSON5 strings like JSON.stringify while enforcing the output limit incrementally', () => {
    const source = String.raw`{z:'quote" slash\\ controls\b\t\n\f\r\x01', a:'😀\uD800'}`;
    const expectedValue = JSON5.parse(source);
    const expected = JSON.stringify(sortObjectKeys(expectedValue), null, 2);
    const stringify = vi.spyOn(JSON, 'stringify');

    try {
      expect(formatJson(task(source, { mode: 'json5', sortKeys: true }))).toBe(expected);
      expectErrorCode(
        () => formatJson(task(source, { mode: 'json5', sortKeys: true }), { maxOutputBytes: 24 }),
        'limit',
      );
      expect(stringify).not.toHaveBeenCalled();
    }
    finally {
      stringify.mockRestore();
    }
  });

  it('stops indentation amplification without constructing the complete compatibility output', () => {
    const nested = Array.from({ length: 128 }).reduce<unknown>(value => [value], 0);

    expectErrorCode(
      () => formatJson(task('ignored', { indentSize: 10, mode: 'json5' }), {
        parseCompatibility: () => nested,
        maxOutputBytes: 1_024,
      }),
      'limit',
    );
  });

  it('preserves exact ±2^53 and uint64 lexemes in strict mode', () => {
    const source = '[9007199254740992,-9007199254740992,18446744073709551615]';

    expect(formatJson(task(source, { indentSize: 0 }))).toBe(source);
  });

  it('rejects JSON5 unsafe integers and non-finite numbers instead of silently corrupting them', () => {
    expect(formatJson(task('[9007199254740991,-9007199254740991]', {
      indentSize: 0,
      mode: 'json5',
    }))).toBe('[9007199254740991,-9007199254740991]');

    for (const source of [
      '9007199254740992',
      '-9007199254740992',
      '18446744073709551615',
      '17478252242305210114',
      'Infinity',
      '-Infinity',
      'NaN',
    ]) {
      expectErrorCode(() => formatJson(task(source, { mode: 'json5' })), 'operation');
    }
  });

  it('rejects JSON5-only syntax in strict mode with a structured syntax error', () => {
    expectErrorCode(() => formatJson(task('{unquoted: true}')), 'syntax');
    expectErrorCode(() => formatJson(task('{"trailing": true,}')), 'syntax');
    expectErrorCode(() => formatJson(task('{"comment": /* no */ true}')), 'syntax');
    expectErrorCode(() => formatJson(task('')), 'syntax');
  });

  it('enforces collection depth and syntax-node limits in both modes', () => {
    const accepted = `${'['.repeat(JSON_MAX_DEPTH)}0${']'.repeat(JSON_MAX_DEPTH)}`;
    const rejected = `${'['.repeat(JSON_MAX_DEPTH + 1)}0${']'.repeat(JSON_MAX_DEPTH + 1)}`;

    expect(formatJson(task(accepted, { indentSize: 0 }))).toBe(accepted);
    expectErrorCode(() => formatJson(task(rejected, { indentSize: 0 })), 'limit');
    expectErrorCode(() => formatJson(task('[1,2]', { indentSize: 0 }), { maxNodes: 2 }), 'limit');
    expectErrorCode(
      () => formatJson(task('[[[0]]]', { indentSize: 0, mode: 'json5' }), { maxDepth: 2 }),
      'limit',
    );
  });

  it('stops output generation at the UTF-8 byte limit', () => {
    expect(formatJson(task('{"message":"😀"}', { indentSize: 0 }), { maxOutputBytes: 18 })).toBe('{"message":"😀"}');
    expectErrorCode(
      () => formatJson(task('{"message":"😀"}', { indentSize: 0 }), { maxOutputBytes: 17 }),
      'limit',
    );
    expectErrorCode(
      () => formatJson(task('{message:"😀"}', { indentSize: 0, mode: 'json5' }), { maxOutputBytes: 17 }),
      'limit',
    );
  });

  it('sorts compatibility objects without treating __proto__ as a prototype mutation', () => {
    const value = JSON.parse('{"z":1,"__proto__":{"polluted":true},"a":2}') as Record<string, unknown>;
    const sorted = sortObjectKeys(value);

    expect(sorted).toBeTypeOf('object');
    if (typeof sorted !== 'object' || sorted === null) {
      throw new Error('Expected a sorted object.');
    }

    expect(Object.keys(sorted)).toEqual(['__proto__', 'a', 'z']);
    expect(Object.prototype.hasOwnProperty.call(sorted, '__proto__')).toBe(true);
    expect(Reflect.get({}, 'polluted')).toBeUndefined();
  });
});
