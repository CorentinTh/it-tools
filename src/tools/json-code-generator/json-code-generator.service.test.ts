import { describe, expect, it } from 'vitest';
import { generateJsonCode } from './json-code-generator.service';

const source = '{ users: [{id: 1, name: "Ada"}, {id: 2, name: "Grace"}], active: true }';

describe('JSON code generator service', () => {
  it('infers a Draft 2020-12 schema from one JSON5 parse', () => {
    const schema = JSON.parse(generateJsonCode({ source, comparison: '', target: 'schema', rootName: 'API response' }));
    expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(schema.title).toBe('APIResponse');
    expect(schema.properties.users.items.properties.id.type).toBe('integer');
    expect(schema.required).toEqual(['users', 'active']);
  });

  it('generates safe TypeScript property syntax including prototype-shaped keys', () => {
    const output = generateJsonCode({ source: '{"__proto__": 1, "display-name": "Ada"}', comparison: '', target: 'typescript', rootName: '123 model' });
    expect(output).toContain('export interface _123Model');
    expect(output).toContain('__proto__: number;');
    expect(output).toContain('"display-name": string;');
  });

  it('reports bounded graph and input statistics', () => {
    const stats = JSON.parse(generateJsonCode({ source, comparison: '', target: 'stats', rootName: 'Root' }));
    expect(stats.nodes).toBe(9);
    expect(stats.objects).toBe(3);
    expect(stats.arrays).toBe(1);
    expect(stats.utf8Bytes).toBeGreaterThan(0);
  });

  it('bounds heterogeneous array unions', () => {
    const source = `[${Array.from({ length: 21 }, (_, index) => JSON.stringify({ [`field-${index}`]: index })).join(',')}]`;
    expect(generateJsonCode({ source, comparison: '', target: 'typescript', rootName: 'Root' })).toContain('unknown[]');
  });

  it('generates deterministic RFC 6902 add/remove/replace operations with JSON Pointer escaping', () => {
    const patch = generateJsonCode({
      source: '{"a/b":1,"gone":true,"items":[1,2],"big":9007199254740993}',
      comparison: '{"a/b":2,"items":[1,3,4],"big":9007199254740994,"~new":"ok"}',
      target: 'patch',
      rootName: '',
    });
    expect(JSON.parse(patch)).toEqual([
      { op: 'remove', path: '/gone' },
      { op: 'replace', path: '/a~1b', value: 2 },
      { op: 'replace', path: '/big', value: 9007199254740994 },
      { op: 'replace', path: '/items/1', value: 3 },
      { op: 'add', path: '/items/2', value: 4 },
      { op: 'add', path: '/~0new', value: 'ok' },
    ]);
    expect(patch).toContain('9007199254740994');
  });

  it('uses the empty JSON Pointer to replace the document root', () => {
    expect(JSON.parse(generateJsonCode({ source: '1', comparison: '{"value":2}', target: 'patch', rootName: '' }))).toEqual([
      { op: 'replace', path: '', value: { value: 2 } },
    ]);
  });
});
