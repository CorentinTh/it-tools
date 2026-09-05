import { describe, expect, it } from 'vitest';
import { convertTextToUtf8Binary, convertUtf8BinaryToText } from './text-to-binary.models';

describe('text-to-binary', () => {
  describe('convertTextToUtf8Binary', () => {
    it('a text string is converted to its UTF-8 binary representation', () => {
      expect(convertTextToUtf8Binary('A')).toBe('01000001');
      expect(convertTextToUtf8Binary('hello')).toBe('01101000 01100101 01101100 01101100 01101111');
      expect(convertTextToUtf8Binary('')).toBe('');
    });
    it('the separator between octets can be changed', () => {
      expect(convertTextToUtf8Binary('hello', { separator: '' })).toBe('0110100001100101011011000110110001101111');
    });
    it('encodes non-ASCII text as UTF-8 octets', () => {
      expect(convertTextToUtf8Binary('café')).toBe('01100011 01100001 01100110 11000011 10101001');
      expect(convertTextToUtf8Binary('😀')).toBe('11110000 10011111 10011000 10000000');
    });
  });

  describe('convertUtf8BinaryToText', () => {
    it('a UTF-8 binary string is converted to its text representation', () => {
      expect(convertUtf8BinaryToText('01101000 01100101 01101100 01101100 01101111')).toBe('hello');
      expect(convertUtf8BinaryToText('01000001')).toBe('A');
      expect(convertTextToUtf8Binary('')).toBe('');
    });

    it('the given binary string is cleaned before conversion', () => {
      expect(convertUtf8BinaryToText('  01000 001garbage')).toBe('A');
    });

    it('decodes accented, Arabic, and emoji text', () => {
      const text = 'café مرحبا 😀';

      expect(convertUtf8BinaryToText(convertTextToUtf8Binary(text))).toBe(text);
    });

    it('throws an error if the given binary string has no complete octet', () => {
      expect(() => convertUtf8BinaryToText('010000011')).toThrow('Invalid binary string');
      expect(() => convertUtf8BinaryToText('1')).toThrow('Invalid binary string');
    });

    it('throws an error for invalid UTF-8 bytes', () => {
      expect(() => convertUtf8BinaryToText('11111111')).toThrow();
    });
  });
});
