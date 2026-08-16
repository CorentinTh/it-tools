import { describe, expect, it } from 'vitest';
import { convertDataUnit, estimateTransferSeconds, formatDuration } from './data-units-converter.service';

describe('data units converter', () => {
  it('distinguishes bytes, bits, SI, and IEC exactly', () => {
    expect(convertDataUnit('1', 'B', 'bit')).toMatchObject({ value: '8', exact: true });
    expect(convertDataUnit('1', 'GB', 'GiB').value).toBe('0.931322574615478515625');
    expect(convertDataUnit('1.5', 'MiB', 'B').value).toBe('1572864');
  });

  it('estimates transfer time without floating-point arithmetic', () => {
    expect(estimateTransferSeconds('1', 'GB', '100', 'Mbit').value).toBe('80');
    expect(estimateTransferSeconds('1', 'bit', '3', 'bit')).toMatchObject({ value: '0.333333333333333333…', exact: false });
    expect(formatDuration('3661.5')).toBe('1 h 1 min 1.5 s');
  });

  it('rejects exponent notation, negative values, and zero rates', () => {
    expect(() => convertDataUnit('1e3', 'B', 'bit')).toThrow(/non-negative decimal/u);
    expect(() => convertDataUnit('-1', 'B', 'bit')).toThrow(/non-negative decimal/u);
    expect(() => estimateTransferSeconds('1', 'GB', '0', 'Mbit')).toThrow(/greater than zero/u);
  });
});
