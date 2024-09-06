import { describe, expect, it } from 'vitest';
import { convertStorageAndRateUnits } from './data-storage-unit-converter.service';

describe('data-storage-unit-converter', () => {
  describe('convertStorageAndRateUnits', () => {
    it('convert from same base units', () => {
      expect(convertStorageAndRateUnits({ value: 1024 * 1024, fromUnit: 'B', toUnit: 'MiB' })).toBe('1');
      expect(convertStorageAndRateUnits({ value: 1024, fromUnit: 'KiB', toUnit: 'MiB' })).toBe('1');
      expect(convertStorageAndRateUnits({ value: 1, fromUnit: 'MiB', toUnit: 'KiB' })).toBe('1,024');
      expect(convertStorageAndRateUnits({ value: 1000, fromUnit: 'MB', toUnit: 'GB' })).toBe('1');
      expect(convertStorageAndRateUnits({ value: 1024, fromUnit: 'MB', toUnit: 'MB' })).toBe('1,024');
      expect(convertStorageAndRateUnits({ value: 1, fromUnit: 'MB', toUnit: 'KB' })).toBe('1,000');
      expect(convertStorageAndRateUnits({ value: 1024, fromUnit: 'MiB', toUnit: 'GiB' })).toBe('1');
      expect(convertStorageAndRateUnits({ value: 1000, fromUnit: 'MB', toUnit: 'GB' })).toBe('1');
      expect(convertStorageAndRateUnits({ value: 1000, fromUnit: 'Mb', toUnit: 'Gb' })).toBe('1');
    });

    it('convert between base units', () => {
      expect(convertStorageAndRateUnits({ value: 1, fromUnit: 'MB', toUnit: 'MiB' })).toBe('0.954');
      expect(convertStorageAndRateUnits({ value: 1, fromUnit: 'MiB', toUnit: 'MB' })).toBe('1.049');
      expect(convertStorageAndRateUnits({ value: 1000 * 1000, fromUnit: 'B', toUnit: 'MiB' })).toBe('0.954');
      expect(convertStorageAndRateUnits({ value: 1024, fromUnit: 'KB', toUnit: 'MiB' })).toBe('0.977');
      expect(convertStorageAndRateUnits({ value: 1000, fromUnit: 'MiB', toUnit: 'MB' })).toBe('1,048.576');
      expect(convertStorageAndRateUnits({ value: 1, fromUnit: 'MB', toUnit: 'Mb' })).toBe('8');
      expect(convertStorageAndRateUnits({ value: 1000, fromUnit: 'KB', toUnit: 'Kb' })).toBe('8,000');
      expect(convertStorageAndRateUnits({ value: 1000, fromUnit: 'KiB', toUnit: 'Kb' })).toBe('8,192');
      expect(convertStorageAndRateUnits({ value: 8, fromUnit: 'Mb', toUnit: 'MB' })).toBe('1');

      expect(convertStorageAndRateUnits({ value: 1, fromUnit: 'Mb', toUnit: 'KB' })).toBe('125');
      expect(convertStorageAndRateUnits({ value: 125, fromUnit: 'KB', toUnit: 'Mb' })).toBe('1');

      expect(convertStorageAndRateUnits({ value: 1, fromUnit: 'MiB', toUnit: 'Kb' })).toBe('8,388.608');
      expect(convertStorageAndRateUnits({ value: 8388.608, fromUnit: 'Kb', toUnit: 'MiB' })).toBe('1');
    });
  });
});
