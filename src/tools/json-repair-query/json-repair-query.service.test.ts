import { describe, expect, it } from 'vitest';
import { parseJsonPath, processJsonWorkspace, queryJson, repairJson, unescapeJsonString } from './json-repair-query.service';

describe('JSON repair and query', () => {
  it('repairs comments, single quotes, unquoted keys, and trailing commas through JSON5', () => {
    expect(repairJson('{ // comment\n unquoted: \'value\', list: [1, 2,], }')).toBe('{\n  "unquoted": "value",\n  "list": [\n    1,\n    2\n  ]\n}');
  });

  it('queries property, quoted-key, index, and wildcard steps', () => {
    const source = '{"users":[{"full-name":"Ada"},{"full-name":"Grace"}]}';
    expect(queryJson(source, '$.users[*][\'full-name\']')).toBe('[\n  "Ada",\n  "Grace"\n]');
    expect(queryJson(source, '$.users[1]["full-name"]')).toBe('"Grace"');
  });

  it('rejects filters, recursive descent, and executable expressions', () => {
    expect(() => parseJsonPath('$..password')).toThrow('Expected a property');
    expect(() => parseJsonPath('$.users[?(@.admin)]')).toThrow('Only numeric');
    expect(() => parseJsonPath('$[(@.length-1)]')).toThrow('Only numeric');
  });

  it('requires strict JSON for queries', () => {
    expect(() => processJsonWorkspace({ operation: 'query', source: '{unquoted: 1}', query: '$.unquoted' })).toThrow();
  });

  it('decodes one outer JSON string without reformatting the inner JSON', () => {
    const inner = '{\n  "id": 9007199254740993,\n  "ok": true\n}';
    expect(unescapeJsonString(JSON.stringify(inner))).toBe(inner);
  });

  it('rejects ordinary JSON and strings whose decoded text is not JSON', () => {
    expect(() => unescapeJsonString('{"ok":true}')).toThrow(/outer JSON string/u);
    expect(() => unescapeJsonString('"not json"')).toThrow();
  });
});
