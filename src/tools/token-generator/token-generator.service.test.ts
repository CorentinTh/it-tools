import { afterEach, describe, expect, it, vi } from 'vitest';
import { TOKEN_ALPHABETS, createToken, createTokenAlphabet, createTokens } from './token-generator.service';
import type { RandomValuesProvider } from '@/utils/secure-random';

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

afterEach(() => {
  vi.restoreAllMocks();
});

describe('token-generator', () => {
  describe('createToken', () => {
    it('should generate an empty string when all params are false', () => {
      const getRandomValues = vi.fn(sequenceRandomValues([0]));
      const token = createToken({
        withLowercase: false,
        withUppercase: false,
        withNumbers: false,
        withSymbols: false,
        length: 10,
        getRandomValues,
      });

      expect(token).toHaveLength(0);
      expect(getRandomValues).not.toHaveBeenCalled();
    });

    it('should restore every uppercase and lowercase character', () => {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const token = createToken({
        withLowercase: true,
        withUppercase: true,
        withNumbers: false,
        withSymbols: false,
        length: alphabet.length,
        getRandomValues: sequenceRandomValues(Array.from({ length: alphabet.length }, (_, index) => index)),
      });

      expect(token).toBe(alphabet);
      expect(token).toContain('N');
      expect(token).toContain('n');
    });

    it('should not weight default symbols through duplicate alphabet entries', () => {
      expect(new Set(TOKEN_ALPHABETS.symbols).size).toBe(TOKEN_ALPHABETS.symbols.length);
    });

    it('should select custom alphabet characters deterministically', () => {
      expect(createToken({
        alphabet: 'xyz',
        length: 6,
        getRandomValues: sequenceRandomValues([2, 1, 0]),
      })).toBe('zyxzyx');
    });

    it('should reject invalid lengths', () => {
      expect(() => createToken({ length: -1 })).toThrow(RangeError);
      expect(() => createToken({ length: 1.5 })).toThrow(RangeError);
      expect(() => createToken({ length: 513 })).toThrow(RangeError);
    });

    it('should not use Math.random', () => {
      const mathRandom = vi.spyOn(Math, 'random').mockImplementation(() => {
        throw new Error('Math.random must not be used for tokens');
      });

      expect(createToken({ alphabet: 'A', length: 16 })).toBe('A'.repeat(16));
      expect(mathRandom).not.toHaveBeenCalled();
    });

    it('should generate a random string with the specified length', () => {
      const createTokenWithLength = (length: number) =>
        createToken({
          withLowercase: true,
          withUppercase: true,
          withNumbers: true,
          withSymbols: true,
          length,
        });

      expect(createTokenWithLength(5)).toHaveLength(5);
      expect(createTokenWithLength(10)).toHaveLength(10);
      expect(createTokenWithLength(100)).toHaveLength(100);
    });

    it('should generate a random string with just uppercase if only withUppercase is set', () => {
      const token = createToken({
        withLowercase: false,
        withUppercase: true,
        withNumbers: false,
        withSymbols: false,
        length: 256,
      });

      expect(token).toHaveLength(256);
      expect(token).toMatch(/^[A-Z]+$/);
    });

    it('should generate a random string with just lowercase if only withLowercase is set', () => {
      const token = createToken({
        withLowercase: true,
        withUppercase: false,
        withNumbers: false,
        withSymbols: false,
        length: 256,
      });

      expect(token).toHaveLength(256);
      expect(token).toMatch(/^[a-z]+$/);
    });

    it('should generate a random string with just numbers if only withNumbers is set', () => {
      const token = createToken({
        withLowercase: false,
        withUppercase: false,
        withNumbers: true,
        withSymbols: false,
        length: 256,
      });

      expect(token).toHaveLength(256);
      expect(token).toMatch(/^[0-9]+$/);
    });

    it('should generate a random string with just symbols if only withSymbols is set', () => {
      const token = createToken({
        withLowercase: false,
        withUppercase: false,
        withNumbers: false,
        withSymbols: true,
        length: 256,
      });

      expect(token).toHaveLength(256);
      expect([...token].every(character => TOKEN_ALPHABETS.symbols.includes(character))).toBe(true);
    });

    it('should generate a random string with just letters (case incensitive) with withLowercase and withUppercase', () => {
      const token = createToken({
        withLowercase: true,
        withUppercase: true,
        withNumbers: false,
        withSymbols: false,
        length: 256,
      });

      expect(token).toHaveLength(256);
      expect(token).toMatch(/^[a-zA-Z]+$/);
    });
  });

  it('deduplicates custom alphabets and removes denied Unicode characters', () => {
    expect(createTokenAlphabet({ customAlphabet: 'aabb💩💩c', deniedCharacters: 'b💩' })).toBe('ac');
  });

  it('generates a bounded batch with the final unbiased alphabet', () => {
    expect(createTokens({
      customAlphabet: 'abc',
      deniedCharacters: 'b',
      length: 3,
      quantity: 2,
      getRandomValues: sequenceRandomValues([0, 1]),
    })).toEqual(['aca', 'cac']);
    expect(() => createTokens({ quantity: 101 })).toThrow('quantity');
    expect(() => createTokens({ customAlphabet: 'x', deniedCharacters: 'x' })).toThrow('allowed character');
  });
});
