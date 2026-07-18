import { describe, expect, it } from 'vitest';
import {
  type TemperatureScale,
  convertTemperature,
  isTemperaturePhysicallyValid,
  roundTemperature,
  temperatureBounds,
} from './temperature-converter.models';

const absoluteZeroFixtures: ReadonlyArray<{
  scale: TemperatureScale
  value: number
  invalidValue: number
}> = [
  { scale: 'kelvin', value: 0, invalidValue: -0.000001 },
  { scale: 'celsius', value: -273.15, invalidValue: -273.150001 },
  { scale: 'fahrenheit', value: -459.67, invalidValue: -459.670001 },
  { scale: 'rankine', value: 0, invalidValue: -0.000001 },
  { scale: 'delisle', value: 559.725, invalidValue: 559.725001 },
  { scale: 'newton', value: -90.1395, invalidValue: -90.139501 },
  { scale: 'reaumur', value: -218.52, invalidValue: -218.520001 },
  { scale: 'romer', value: -135.90375, invalidValue: -135.903751 },
];

describe('temperature-converter models', () => {
  describe('roundTemperature', () => {
    it.each([
      [273.15, 273.15],
      [1.005, 1.01],
      [-1.005, -1.01],
      [10.075, 10.08],
      [-10.075, -10.08],
      [1.0049, 1],
      [-1.0049, -1],
    ])('rounds %s symmetrically to %s', (temperature, expected) => {
      expect(roundTemperature(temperature)).toBe(expected);
    });

    it('normalizes negative zero', () => {
      expect(Object.is(roundTemperature(-0.004), -0)).toBe(false);
      expect(roundTemperature(-0.004)).toBe(0);
    });
  });

  describe.each(absoluteZeroFixtures)('$scale physical limit', ({ scale, value, invalidValue }) => {
    it('accepts the exact absolute-zero value', () => {
      expect(isTemperaturePhysicallyValid(scale, value)).toBe(true);
      expect(convertTemperature(value, scale, 'kelvin')).toBe(0);
    });

    it('rejects a value below absolute zero', () => {
      expect(isTemperaturePhysicallyValid(scale, invalidValue)).toBe(false);
      expect(convertTemperature(invalidValue, scale, 'kelvin')).toBeNull();
    });
  });

  it('preserves every exact absolute-zero representation during conversion', () => {
    for (const source of absoluteZeroFixtures) {
      for (const target of absoluteZeroFixtures) {
        expect(convertTemperature(source.value, source.scale, target.scale)).toBe(target.value);
      }
    }
  });

  it('fixes the 0 Celsius to Kelvin floating-point regression', () => {
    expect(convertTemperature(0, 'celsius', 'kelvin')).toBe(273.15);
  });

  it('declares Delisle as the sole upper-bounded scale', () => {
    expect(temperatureBounds.delisle).toEqual({ max: 559.725 });
    expect(temperatureBounds.kelvin).toEqual({ min: 0 });
  });
});
