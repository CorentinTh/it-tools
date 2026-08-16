import { describe, expect, it } from 'vitest';
import { INTEGER_INPUT_MAX_LENGTH, convertBase, formatInteger, parseInteger } from './integer-base-converter.model';

describe('integer-base-converter', () => {
  it('converts exact arbitrary-precision signed integers between bases 2–64', () => {
    expect(convertBase({ value: '0', fromBase: 2, toBase: 11 })).toBe('0');
    expect(convertBase({ value: '-10100101', fromBase: 2, toBase: 16 })).toBe('-a5');
    expect(convertBase({ value: '192654', fromBase: 10, toBase: 8 })).toBe('570216');
    expect(convertBase({ value: 'zz', fromBase: 64, toBase: 10 })).toBe('2275');
    expect(convertBase({ value: '42540766411283223938465490632011909384', fromBase: 10, toBase: 16 }))
      .toBe('20010db8000085a300000000ac1f8908');
    expect(convertBase({ value: '20010db8000085a300000000ac1f8908', fromBase: 16, toBase: 10 }))
      .toBe('42540766411283223938465490632011909384');
  });

  it('accepts matching common prefixes or suffixes with optional signs and outer whitespace', () => {
    expect(convertBase({ value: '  +0Xff  ', fromBase: 16, toBase: 10 })).toBe('255');
    expect(convertBase({ value: '-FFh', fromBase: 16, toBase: 10 })).toBe('-255');
    expect(convertBase({ value: '0b1010', fromBase: 2, toBase: 10 })).toBe('10');
    expect(convertBase({ value: '1010B', fromBase: 2, toBase: 10 })).toBe('10');
    expect(convertBase({ value: '0o77', fromBase: 8, toBase: 10 })).toBe('63');
    expect(convertBase({ value: '77o', fromBase: 8, toBase: 10 })).toBe('63');
    expect(convertBase({ value: '42d', fromBase: 10, toBase: 16 })).toBe('2a');
  });

  it('is case-insensitive through base 36 and remains case-sensitive for bases 37–64', () => {
    expect(parseInteger({ value: 'Z', base: 36 })).toBe(35n);
    expect(parseInteger({ value: 'z', base: 36 })).toBe(35n);
    expect(parseInteger({ value: 'A', base: 37 })).toBe(36n);
    expect(parseInteger({ value: 'a', base: 37 })).toBe(10n);
    expect(formatInteger({ value: 36n, base: 37 })).toBe('A');
  });

  it.each([
    [{ value: '', fromBase: 10, toBase: 16 }, 'empty'],
    [{ value: '+', fromBase: 10, toBase: 16 }, 'at least one digit'],
    [{ value: '0x10', fromBase: 10, toBase: 16 }, 'requires input base 16'],
    [{ value: '0xFFh', fromBase: 16, toBase: 10 }, 'either a base prefix or a suffix'],
    [{ value: '10h', fromBase: 10, toBase: 16 }, 'requires input base 16'],
    [{ value: '1 0', fromBase: 2, toBase: 10 }, 'Whitespace'],
    [{ value: '2', fromBase: 2, toBase: 10 }, 'Invalid digit'],
    [{ value: '10', fromBase: 1, toBase: 10 }, 'Input base'],
    [{ value: '10', fromBase: 10, toBase: 65 }, 'Output base'],
  ])('rejects malformed or mismatched input %#', (input, message) => {
    expect(() => convertBase(input)).toThrow(message);
  });

  it('bounds attacker-controlled input before BigInt work', () => {
    expect(() => parseInteger({ value: '1'.repeat(INTEGER_INPUT_MAX_LENGTH + 1), base: 2 }))
      .toThrow(`${INTEGER_INPUT_MAX_LENGTH} characters`);
  });
});
