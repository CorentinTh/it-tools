import { describe, expect, it } from 'vitest';
import { bitsToUnit, formatPrecision, unitToBits } from './data-storage-converter.models';

describe('data-storage-converter models', () => {
  it('converts bits and bytes', () => {
    expect(unitToBits(1, 'byte')).toBe(8);
    expect(bitsToUnit(8, 'byte')).toBe(1);
    expect(unitToBits(1, 'bit')).toBe(1);
  });

  it('converts decimal (SI) units', () => {
    expect(unitToBits(1, 'kilobyte')).toBe(8000);
    expect(bitsToUnit(8e9, 'gigabyte')).toBe(1);
    expect(bitsToUnit(unitToBits(1, 'petabyte'), 'gigabyte')).toBe(1e6);
    expect(bitsToUnit(unitToBits(1, 'megabit'), 'kilobit')).toBe(1000);
  });

  it('converts binary (IEC) units', () => {
    expect(unitToBits(1, 'kibibyte')).toBe(1024 * 8);
    expect(bitsToUnit(unitToBits(1, 'gibibyte'), 'megabyte')).toBeCloseTo(1073.741824, 6);
    expect(bitsToUnit(unitToBits(1, 'pebibyte'), 'terabyte')).toBeCloseTo(1125.899906842624, 6);
  });

  it('round-trips without loss of precision', () => {
    for (const unit of ['bit', 'byte', 'megabyte', 'gibibyte', 'terabit', 'pebibyte'] as const) {
      const bits = unitToBits(123.456, unit);
      expect(bitsToUnit(bits, unit)).toBeCloseTo(123.456, 6);
    }
  });

  it('formats precision by trimming trailing zeros', () => {
    expect(formatPrecision(0)).toBe('0');
    expect(formatPrecision(1024)).toBe('1024');
    expect(formatPrecision(1073.741824)).toBe('1073.741824');
  });
});
