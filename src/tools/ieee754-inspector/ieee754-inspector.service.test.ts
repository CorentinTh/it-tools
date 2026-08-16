import { describe, expect, it } from 'vitest';
import { inspectFloat } from './ieee754-inspector.service';

describe('IEEE-754 inspector', () => {
  it('shows the canonical binary32 encoding and exact rounding error', () => {
    const result = inspectFloat('0.1', 'binary32');
    expect(result).toMatchObject({
      classification: 'normal',
      signBit: '0',
      exponentBits: '01111011',
      bigEndianHex: '3d cc cc cd',
      littleEndianHex: 'cd cc cc 3d',
    });
    expect(result.exactStoredValue).toBe('0.100000001490116119384765625');
    expect(result.roundingError).toBe('0.000000001490116119384765625');
  });

  it('handles binary64 special values, signed zero, and subnormals', () => {
    expect(inspectFloat('-0', 'binary64')).toMatchObject({ classification: 'zero', signBit: '1', exactStoredValue: '-0' });
    expect(inspectFloat('Infinity', 'binary64')).toMatchObject({ classification: 'infinity', exponentBits: '11111111111' });
    expect(inspectFloat('NaN', 'binary64').classification).toBe('nan');
    expect(inspectFloat('5e-324', 'binary64')).toMatchObject({ classification: 'subnormal', bigEndianHex: '00 00 00 00 00 00 00 01' });
  });

  it('rejects unsupported syntax and excessive exponents', () => {
    expect(() => inspectFloat('0x10', 'binary64')).toThrow(/decimal/u);
    expect(() => inspectFloat('1e401', 'binary64')).toThrow(/between -400 and 400/u);
  });
});
