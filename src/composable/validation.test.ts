import { describe, expect, it } from 'vitest';
import { isFalsyOrHasThrown } from './validation';

describe('useValidation', () => {
  describe('isFalsyOrHasThrown', () => {
    it('should return true if the callback return nil, false or throw', () => {
      expect(isFalsyOrHasThrown(() => false)).toBe(true);
      expect(isFalsyOrHasThrown(() => null)).toBe(true);
      expect(isFalsyOrHasThrown(() => undefined)).toBe(true);
      expect(isFalsyOrHasThrown(() => {})).toBe(true);
      expect(
        isFalsyOrHasThrown(() => {
          throw new Error('message');
        }),
      ).toBe(true);
    });

    it('should return true for any truthy values and empty string and 0 values', () => {
      expect(isFalsyOrHasThrown(() => true)).toBe(false);
      expect(isFalsyOrHasThrown(() => 'string')).toBe(false);
      expect(isFalsyOrHasThrown(() => 1)).toBe(false);
      expect(isFalsyOrHasThrown(() => 0)).toBe(false);
      expect(isFalsyOrHasThrown(() => '')).toBe(false);
      expect(isFalsyOrHasThrown(() => [])).toBe(false);
      expect(isFalsyOrHasThrown(() => ({}))).toBe(false);
    });
  });
});
