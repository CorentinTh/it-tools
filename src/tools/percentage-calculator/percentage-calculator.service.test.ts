import { describe, expect, it } from 'vitest';
import { computeIsWhatPercentOf, computePercentageIncreaseDecrease, computePercentageOf } from './percentage-calculator.service';

describe('percentage-calculator', () => {
  describe('computePercentageOf', () => {
    it('computes a percentage of a value', () => {
      expect(computePercentageOf(123, 456)).toBe('560.88');
      expect(computePercentageOf(0, 200)).toBe('0');
    });

    it('returns an empty result when an input is missing', () => {
      expect(computePercentageOf(undefined, 200)).toBe('');
      expect(computePercentageOf(200, undefined)).toBe('');
      expect(computePercentageOf(null, 200)).toBe('');
      expect(computePercentageOf(200, null)).toBe('');
    });
  });

  describe('computeIsWhatPercentOf', () => {
    it('computes what percent x is of y', () => {
      expect(computeIsWhatPercentOf(123, 456)).toBe('26.973684210526315');
    });

    it('returns an empty result when an input is missing', () => {
      expect(computeIsWhatPercentOf(undefined, 12)).toBe('');
      expect(computeIsWhatPercentOf(12, undefined)).toBe('');
      expect(computeIsWhatPercentOf(null, 12)).toBe('');
      expect(computeIsWhatPercentOf(12, null)).toBe('');
    });

    it('returns an empty result when the divisor is zero', () => {
      expect(computeIsWhatPercentOf(12, 0)).toBe('');
    });
  });

  describe('computePercentageIncreaseDecrease', () => {
    it('computes the increase and the decrease', () => {
      expect(computePercentageIncreaseDecrease(123, 456)).toBe('270.7317073170732');
      expect(computePercentageIncreaseDecrease(40, 46)).toBe('15');
      expect(computePercentageIncreaseDecrease(46, 40)).toBe('-13.043478260869565');
    });

    it('returns an empty result when an input is missing', () => {
      expect(computePercentageIncreaseDecrease(undefined, 46)).toBe('');
      expect(computePercentageIncreaseDecrease(40, undefined)).toBe('');
      expect(computePercentageIncreaseDecrease(null, 46)).toBe('');
      expect(computePercentageIncreaseDecrease(40, null)).toBe('');
    });

    it('returns an empty result when the reference value is zero', () => {
      expect(computePercentageIncreaseDecrease(0, 46)).toBe('');
    });
  });
});
