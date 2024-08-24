import { describe, expect, it } from 'vitest';
import { randomNumber } from './pin-code-generator.service';

describe('pin-code-generator', () => {
  describe('randomNumber', () => {
    it('should generate random pin code of given length', () => {
      expect(randomNumber({
        length: 10,
      })).toHaveLength(10);
      expect(randomNumber({
        length: 4,
      })).toHaveLength(4);
      expect(randomNumber({
        length: 25,
      })).toHaveLength(25);
    });
    it('should generate random pin code without duplicate', () => {
      const pin = randomNumber({
        length: 10,
      });
      expect(pin).toHaveLength(10);
      expect(pin.length).to.eq([...new Set(pin.split(''))].length);
    });

    it('should generate random pin code with duplicate', () => {
      const pin = randomNumber({
        length: 12,
      });
      const uniqueDigits = [...new Set(pin.split(''))];
      expect(pin).toHaveLength(12);
      expect(pin.length).to.greaterThan(uniqueDigits.length);
      expect(uniqueDigits.length).to.lessThanOrEqual(10);
    });
  });
});
