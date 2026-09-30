import { describe, expect, it } from 'vitest';
import { decodeResistor } from './resistor-calculator.models';

describe('resistor-calculator: 4-band', () => {
  it('decodes yellow-violet-red-gold as 4.7 kΩ ±5%', () => {
    const decoded = decodeResistor({
      bandCount: 4,
      digits: ['Yellow', 'Violet'],
      multiplier: 'Red',
      tolerance: 'Gold',
    });
    expect(decoded.ohms).toBe(4700);
    expect(decoded.formatted).toBe('4.7 kΩ');
    expect(decoded.tolerance).toBe(5);
  });

  it('decodes brown-black-red as 1 kΩ with 20% default (no tolerance band)', () => {
    const decoded = decodeResistor({
      bandCount: 4,
      digits: ['Brown', 'Black'],
      multiplier: 'Red',
      tolerance: 'None (20%)',
    });
    expect(decoded.ohms).toBe(1000);
    expect(decoded.tolerance).toBe(20);
  });

  it('decodes gold and silver multipliers for sub-ohm values', () => {
    const gold = decodeResistor({
      bandCount: 4,
      digits: ['Green', 'Blue'],
      multiplier: 'Gold',
      tolerance: 'Silver',
    });
    expect(gold.ohms).toBeCloseTo(5.6);
    expect(gold.formatted).toBe('5.6 Ω');

    const silver = decodeResistor({
      bandCount: 4,
      digits: ['Yellow', 'Violet'],
      multiplier: 'Silver',
      tolerance: 'Gold',
    });
    expect(silver.ohms).toBeCloseTo(0.47);
    expect(silver.formatted).toBe('0.47 Ω');
  });

  it('formats large values with MΩ and GΩ', () => {
    const mega = decodeResistor({ bandCount: 4, digits: ['Brown', 'Black'], multiplier: 'Green', tolerance: 'Brown' });
    expect(mega.formatted).toBe('1 MΩ');

    const giga = decodeResistor({ bandCount: 4, digits: ['Brown', 'Black'], multiplier: 'White', tolerance: 'Brown' });
    expect(giga.formatted).toBe('10 GΩ');
  });

  it('returns the band colors for the resistor graphic', () => {
    const decoded = decodeResistor({
      bandCount: 4,
      digits: ['Red', 'Red'],
      multiplier: 'Brown',
      tolerance: 'Brown',
    });
    expect(decoded.bandColors).toEqual(['Red', 'Red', 'Brown', 'Brown']);
  });
});

describe('resistor-calculator: 5-band', () => {
  it('decodes brown-black-black-brown-brown as 1 kΩ ±1%', () => {
    const decoded = decodeResistor({
      bandCount: 5,
      digits: ['Brown', 'Black', 'Black'],
      multiplier: 'Brown',
      tolerance: 'Brown',
    });
    expect(decoded.ohms).toBe(1000);
    expect(decoded.tolerance).toBe(1);
  });

  it('decodes five bands with three significant digits', () => {
    const decoded = decodeResistor({
      bandCount: 5,
      digits: ['Orange', 'Orange', 'Red'],
      multiplier: 'Orange',
      tolerance: 'Green',
    });
    // 332 * 1e3
    expect(decoded.ohms).toBe(332000);
    expect(decoded.formatted).toBe('332 kΩ');
    expect(decoded.tolerance).toBe(0.5);
  });

  it('lists all five band colors in order', () => {
    const decoded = decodeResistor({
      bandCount: 5,
      digits: ['Brown', 'Green', 'Black'],
      multiplier: 'Red',
      tolerance: 'Red',
    });
    expect(decoded.bandColors).toEqual(['Brown', 'Green', 'Black', 'Red', 'Red']);
  });
});

describe('resistor-calculator: errors', () => {
  it('rejects a digit count mismatch', () => {
    expect(() =>
      decodeResistor({ bandCount: 5, digits: ['Brown', 'Black'], multiplier: 'Red', tolerance: 'Brown' }),
    ).toThrow('needs 3 digit bands');
  });

  it('rejects unknown colors', () => {
    expect(() =>
      decodeResistor({ bandCount: 4, digits: ['Pink', 'Black'], multiplier: 'Red', tolerance: 'Brown' }),
    ).toThrow('Unknown band color: Pink');
  });
});
