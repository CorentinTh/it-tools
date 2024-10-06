import { describe, expect, it } from 'vitest';
import { getSmartValue } from './smart-raw-converter.service';

describe('smart-raw-converter', () => {
  describe('getSmartValue', () => {
    it('to return correct values', () => {
      expect(getSmartValue(8590065666)).to.deep.eq({
        errors: 2,
        operations: 131074,
      });
    });
  });
});
