import { describe, expect, it } from 'vitest';
import { convertStorageAndRateUnitsDisplay, displayStorageAndRateUnits } from './data-storage-unit-converter.service';

describe('data-storage-unit-converter', () => {
  describe('convertStorageAndRateUnitsDisplay', () => {
    it('convert from same base units', () => {
      expect(convertStorageAndRateUnitsDisplay({ value: 1024 * 1024, fromUnit: 'B', toUnit: 'MiB' })).toBe('1');
      expect(convertStorageAndRateUnitsDisplay({ value: 1024, fromUnit: 'KiB', toUnit: 'MiB' })).toBe('1');
      expect(convertStorageAndRateUnitsDisplay({ value: 1, fromUnit: 'MiB', toUnit: 'KiB' })).toBe('1024');
      expect(convertStorageAndRateUnitsDisplay({ value: 1000, fromUnit: 'MB', toUnit: 'GB' })).toBe('1');
      expect(convertStorageAndRateUnitsDisplay({ value: 1024, fromUnit: 'MB', toUnit: 'MB' })).toBe('1024');
      expect(convertStorageAndRateUnitsDisplay({ value: 1, fromUnit: 'MB', toUnit: 'KB' })).toBe('1000');
      expect(convertStorageAndRateUnitsDisplay({ value: 1024, fromUnit: 'MiB', toUnit: 'GiB' })).toBe('1');
      expect(convertStorageAndRateUnitsDisplay({ value: 1000, fromUnit: 'MB', toUnit: 'GB' })).toBe('1');
      expect(convertStorageAndRateUnitsDisplay({ value: 1000, fromUnit: 'Mb', toUnit: 'Gb' })).toBe('1');
    });

    it('convert between base units', () => {
      expect(convertStorageAndRateUnitsDisplay({ value: 1, fromUnit: 'MB', toUnit: 'MiB' })).toBe('0.954');
      expect(convertStorageAndRateUnitsDisplay({ value: 1, fromUnit: 'MiB', toUnit: 'MB' })).toBe('1.049');
      expect(convertStorageAndRateUnitsDisplay({ value: 1000 * 1000, fromUnit: 'B', toUnit: 'MiB' })).toBe('0.954');
      expect(convertStorageAndRateUnitsDisplay({ value: 1024, fromUnit: 'KB', toUnit: 'MiB' })).toBe('0.977');
      expect(convertStorageAndRateUnitsDisplay({ value: 1000, fromUnit: 'MiB', toUnit: 'MB' })).toBe('1048.576');
      expect(convertStorageAndRateUnitsDisplay({ value: 1, fromUnit: 'MB', toUnit: 'Mb' })).toBe('8');
      expect(convertStorageAndRateUnitsDisplay({ value: 1000, fromUnit: 'KB', toUnit: 'Kb' })).toBe('8000');
      expect(convertStorageAndRateUnitsDisplay({ value: 1000, fromUnit: 'KiB', toUnit: 'Kb' })).toBe('8192');
      expect(convertStorageAndRateUnitsDisplay({ value: 8, fromUnit: 'Mb', toUnit: 'MB' })).toBe('1');

      expect(convertStorageAndRateUnitsDisplay({ value: 1, fromUnit: 'Mb', toUnit: 'KB' })).toBe('125');
      expect(convertStorageAndRateUnitsDisplay({ value: 125, fromUnit: 'KB', toUnit: 'Mb' })).toBe('1');

      expect(convertStorageAndRateUnitsDisplay({ value: 1, fromUnit: 'MiB', toUnit: 'Kb' })).toBe('8388.608');
      expect(convertStorageAndRateUnitsDisplay({ value: 8388.608, fromUnit: 'Kb', toUnit: 'MiB' })).toBe('1');
    });
    it('convert with unit display', () => {
      expect(convertStorageAndRateUnitsDisplay({ value: 1024 * 1024, fromUnit: 'B', toUnit: 'MiB', appendUnit: true })).toBe('1MiB');
    });

    //
  });
  describe('displayStorageAndRateUnits', () => {
    it('convert to correct display value', () => {
      expect(displayStorageAndRateUnits({
        value: 1.234567, unit: 'MB', appendUnit: false,
      })).toBe('1.235');
      expect(displayStorageAndRateUnits({
        value: 1.234567, unit: 'MB', appendUnit: true,
      })).toBe('1.235MB');
      expect(displayStorageAndRateUnits({
        value: 1.234567, unit: 'MB', appendUnit: true, precision: 5,
      })).toBe('1.23457MB');
    });
  });
});
