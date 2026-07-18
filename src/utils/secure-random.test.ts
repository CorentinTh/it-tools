import { describe, expect, it, vi } from 'vitest';
import type { RandomValuesProvider } from './secure-random';
import { secureRandomString } from './secure-random';

function sequenceRandomValues(sequence: number[]): RandomValuesProvider {
  let offset = 0;

  return (values) => {
    for (let index = 0; index < values.length; index++) {
      values[index] = sequence[offset % sequence.length];
      offset++;
    }

    return values;
  };
}

describe('secureRandomString', () => {
  it('maps deterministic random values to alphabet characters', () => {
    expect(secureRandomString({
      alphabet: 'ABC',
      length: 6,
      getRandomValues: sequenceRandomValues([0, 1, 2]),
    })).toBe('ABCABC');
  });

  it('uses Unicode code points as complete alphabet characters', () => {
    expect(secureRandomString({
      alphabet: 'A🚀B',
      length: 3,
      getRandomValues: sequenceRandomValues([0, 1, 2]),
    })).toBe('A🚀B');
  });

  it('rejects values in the biased tail of the uint32 range', () => {
    const getRandomValues = vi.fn(sequenceRandomValues([0xFFFF_FFFF, 2]));

    expect(secureRandomString({ alphabet: 'ABC', length: 1, getRandomValues })).toBe('C');
    expect(getRandomValues).toHaveBeenCalledTimes(2);
  });

  it('does not request random values for an empty result', () => {
    const getRandomValues = vi.fn(sequenceRandomValues([0]));

    expect(secureRandomString({ alphabet: 'ABC', length: 0, getRandomValues })).toBe('');
    expect(secureRandomString({ alphabet: '', length: 10, getRandomValues })).toBe('');
    expect(getRandomValues).not.toHaveBeenCalled();
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    'rejects invalid length %s',
    (length) => {
      expect(() => secureRandomString({ alphabet: 'ABC', length })).toThrow(RangeError);
    },
  );
});
