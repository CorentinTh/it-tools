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
        children: [
          {
            key: 'a',
            type: 'value',
            value: 1,
            oldValue: 1,
            status: 'unchanged',
          },
          {
            key: 'b',
            type: 'value',
            value: 2,
            oldValue: 2,
            status: 'unchanged',
          },
          {
            key: 'c',
            type: 'value',
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
        children: [
          {
            key: 0,
            type: 'value',
            value: 1,
            oldValue: 1,
            status: 'unchanged',
          },
          {
            key: 1,
            type: 'value',
            value: 2,
            oldValue: 2,
            status: 'unchanged',
          },
          {
            key: 2,
            type: 'value',
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
  });
});
