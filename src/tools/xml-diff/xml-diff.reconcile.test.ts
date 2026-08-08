import { describe, expect, it } from 'vitest';
import { diff } from './xml-diff.models';
import { reconcileArrayShapes } from './xml-diff.reconcile';

describe('xml-diff reconcile', () => {
  describe('reconcileArrayShapes', () => {
    it('leaves matching plain values untouched', () => {
      expect(reconcileArrayShapes({ item: 'A' }, { item: 'B' })).toEqual([{ item: 'A' }, { item: 'B' }]);
    });

    it('pads the shorter side when both are arrays of different lengths', () => {
      expect(reconcileArrayShapes({ item: ['A'] }, { item: ['A', 'B'] })).toEqual([
        { item: ['A', undefined] },
        { item: ['A', 'B'] },
      ]);
    });

    it('wraps a single value in an array when the other side has an array for the same key', () => {
      const [left, right] = reconcileArrayShapes({ item: 'A' }, { item: ['A', 'B'] });

      expect(left).toEqual({ item: ['A', undefined] });
      expect(right).toEqual({ item: ['A', 'B'] });
    });

    it('recurses into nested objects', () => {
      const [left, right] = reconcileArrayShapes(
        { root: { item: 'A' } },
        { root: { item: ['A', 'B'] } },
      );

      expect(left).toEqual({ root: { item: ['A', undefined] } });
      expect(right).toEqual({ root: { item: ['A', 'B'] } });
    });
  });

  describe('diff after reconciliation', () => {
    it('produces a clean diff when an element goes from single to repeated', () => {
      const left = { item: 'A' };
      const right = { item: ['A', 'B'] };
      const [reconciledLeft, reconciledRight] = reconcileArrayShapes(left, right);

      const result = diff(reconciledLeft, reconciledRight);

      expect(result).toEqual({
        key: '',
        type: 'object',
        oldValue: { item: ['A', undefined] },
        value: { item: ['A', 'B'] },
        status: 'children-updated',
        children: [
          {
            key: 'item',
            type: 'array',
            oldValue: ['A', undefined],
            value: ['A', 'B'],
            status: 'children-updated',
            children: [
              { key: 0, type: 'value', oldValue: 'A', value: 'A', status: 'unchanged' },
              { key: 1, type: 'value', oldValue: undefined, value: 'B', status: 'added' },
            ],
          },
        ],
      });
    });
  });
});
