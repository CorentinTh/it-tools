import { describe, expect, it } from 'vitest';
import { convertTextToUtf8Binary, convertUtf8BinaryToText } from './text-to-binary.models';

describe('text-to-binary', () => {
  const utf8Tests = [
    { text: '文字', binary: '11100110 10010110 10000111 11100101 10101101 10010111' },
    { text: '💩', binary: '11110000 10011111 10010010 10101001' },
  ];

  describe('convertTextToUtf8Binary', () => {
    it('a text string is converted to its UTF-8 binary representation', () => {
      expect(convertTextToUtf8Binary('A')).toBe('01000001');
      expect(convertTextToUtf8Binary('hello')).toBe('01101000 01100101 01101100 01101100 01101111');
      expect(convertTextToUtf8Binary('')).toBe('');
    });
    it('the separator between octets can be changed', () => {
      expect(convertTextToUtf8Binary('hello', { separator: '' })).toBe('0110100001100101011011000110110001101111');
      expect(convertTextToUtf8Binary('hello', { separator: '-' })).toBe('01101000-01100101-01101100-01101100-01101111');
    });
    it('works with non-ASCII input', () => {
      for (const { text, binary } of utf8Tests) {
        const converted = convertTextToUtf8Binary(text);
        expect(converted).toBe(binary);
      }
    });
  });

  describe('convertUtf8BinaryToText', () => {
    it('an ascii binary string is converted to its text representation', () => {
      expect(convertUtf8BinaryToText('01101000 01100101 01101100 01101100 01101111')).toBe('hello');
      expect(convertUtf8BinaryToText('01000001')).toBe('A');
      expect(convertTextToUtf8Binary('')).toBe('');
    });

    it('the given binary string is cleaned before conversion', () => {
      expect(convertUtf8BinaryToText('  01000 001garbage')).toBe('A');
    });

    it('throws an error if the given binary string is not an integer number of complete octets', () => {
      expect(() => convertUtf8BinaryToText('010000011')).toThrow('Invalid binary string');
      expect(() => convertUtf8BinaryToText('010000011 010000011')).toThrow('Invalid binary string');
      expect(() => convertUtf8BinaryToText('1')).toThrow('Invalid binary string');
    });

    it('throws an error if the given binary string is not valid UTF-8', () => {
      expect(() => convertUtf8BinaryToText('11111111')).toThrow();
    });

    it('works with non-ASCII input', () => {
      for (const { text, binary } of utf8Tests) {
        const reverted = convertUtf8BinaryToText(binary);
        expect(reverted).toBe(text);
      }
    });
  });
});
