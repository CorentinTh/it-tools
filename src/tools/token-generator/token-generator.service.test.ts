import { describe, expect, it } from 'vitest';
import { createToken } from './token-generator.service';

describe('token-generator', () => {
  describe('createToken', () => {
    it('should generate an empty string when all params are false', () => {
      const token = createToken({
        withLowercase: false,
        withUppercase: false,
        withNumbers: false,
        withSymbols: false,
        length: 10,
      });

      expect(token).toHaveLength(0);
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
      expect(token).toMatch(/^[.,;:!?./\-"'#{([-|\\@)\]=}*+]+$/);
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
});
