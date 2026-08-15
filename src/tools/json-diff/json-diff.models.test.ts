import { describe, expect, it } from 'vitest';
import { diff } from './json-diff.models';

describe('json-diff models', () => {
  describe('diff', () => {
    it('list object differences', () => {
      const obj = { a: 1, b: 2 };
      const newObj = { a: 1, b: 2, c: 3 };
      const result = diff(obj, newObj);

      expect(result).toEqual({
        key: '',
        type: 'object',
        nodeCount: 4,
        children: [
          {
            key: 'a',
            type: 'value',
            nodeCount: 1,
            value: 1,
            oldValue: 1,
            status: 'unchanged',
          },
          {
            key: 'b',
            type: 'value',
            nodeCount: 1,
            value: 2,
            oldValue: 2,
            status: 'unchanged',
          },
          {
            key: 'c',
            type: 'value',
            nodeCount: 1,
            value: 3,
            oldValue: undefined,
            status: 'added',
          },
        ],
        oldValue: { a: 1, b: 2 },
        value: { a: 1, b: 2, c: 3 },
        status: 'children-updated',
      });
    });

    it('list array differences', () => {
      const obj = [1, 2];
      const newObj = [1, 2, 3];
      const result = diff(obj, newObj);

      expect(result).toEqual({
        key: '',
        type: 'array',
        alignment: 'lcs',
        nodeCount: 4,
        children: [
          {
            key: 0,
            type: 'value',
            nodeCount: 1,
            value: 1,
            oldValue: 1,
            status: 'unchanged',
          },
          {
            key: 1,
            type: 'value',
            nodeCount: 1,
            value: 2,
            oldValue: 2,
            status: 'unchanged',
          },
          {
            key: 2,
            type: 'value',
            nodeCount: 1,
            value: 3,
            oldValue: undefined,
            status: 'added',
          },
        ],
        oldValue: [1, 2],
        value: [1, 2, 3],
        status: 'children-updated',
      });
    });

    it('visits a deep unchanged document in one linear pass', () => {
      let propertyReads = 0;
      const trackedChain = (depth: number): Record<string, unknown> => {
        let node: Record<string, unknown> = { value: true };
        for (let index = 0; index < depth; index += 1) {
          const child = node;
          node = {};
          Object.defineProperty(node, 'next', {
            enumerable: true,
            get() {
              propertyReads += 1;
              return child;
            },
          });
        }
        return node;
      };
      const left = trackedChain(80);
      const right = trackedChain(80);

      const result = diff(left, right);

      expect(result.status).toBe('unchanged');
      expect(propertyReads).toBeLessThan(1_000);
    });

    it('aligns primitive insertions with bounded LCS instead of cascading index updates', () => {
      const result = diff(['alpha', 'beta', 'gamma'], ['new', 'alpha', 'beta', 'gamma']);

      expect(result.type).toBe('array');
      if (result.type !== 'array') {
        throw new Error('Expected an array difference.');
      }
      expect(result.alignment).toBe('lcs');
      expect(result.children.map(child => child.status)).toEqual(['added', 'unchanged', 'unchanged', 'unchanged']);
    });

    it('aligns object arrays by a stable unique id', () => {
      const result = diff(
        [{ id: 1, name: 'first' }, { id: 2, name: 'second' }],
        [{ id: 2, name: 'updated' }, { id: 1, name: 'first' }],
      );

      expect(result.type).toBe('array');
      if (result.type !== 'array') {
        throw new Error('Expected an array difference.');
      }
      expect(result.alignment).toBe('key');
      expect(result.children).toHaveLength(2);
      expect(result.children[0]?.status).toBe('children-updated');
      expect(result.children[1]?.status).toBe('unchanged');
    });

    it('falls back to index alignment when the LCS work ceiling would be exceeded', () => {
      const result = diff([1, 2, 3], [0, 1, 2], { maxLcsCells: 8 });

      expect(result.type).toBe('array');
      expect(result.type === 'array' ? result.alignment : '').toBe('index');
    });

    it('rejects excessive depth, input nodes, and output nodes', () => {
      expect(() => diff({ nested: { value: true } }, {}, { maxDepth: 1 })).toThrow(/nesting/);
      expect(() => diff([1, 2], [1, 2], { maxInputNodes: 3 })).toThrow(/input nodes/);
      expect(() => diff([1, 2], [1, 2], { maxOutputNodes: 2 })).toThrow(/output/);
    });
  });
});
