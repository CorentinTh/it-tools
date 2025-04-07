import { describe, expect, it } from 'vitest';
import { convertTextToUtf8Binary, convertUtf8BinaryToText } from './text-to-binary.models';

describe('text-to-binary', () => {
  const utf8Tests = [
    {
      text: '文字',
      binary: '11100110 10010110 10000111 11100101 10101101 10010111',
      decimal: '',
      octal: '',
      hex: '',
    },
    {
      text: '💩',
      binary: '11110000 10011111 10010010 10101001',
      decimal: '',
      octal: '',
      hex: '',
    },
  ];

  describe('convertTextToUtf8Binary', () => {
    it('a text string is converted to its UTF-8 binary representation', () => {
      expect(convertTextToUtf8Binary('A')).toBe('01000001');
      expect(convertTextToUtf8Binary('A', { base: 8 })).toBe('0101');
      expect(convertTextToUtf8Binary('A', { base: 10 })).toBe('65');
      expect(convertTextToUtf8Binary('A', { base: 16 })).toBe('41');
      expect(convertTextToUtf8Binary('hello')).toBe('01101000 01100101 01101100 01101100 01101111');
      expect(convertTextToUtf8Binary('hello', { base: 8 })).toBe('0150 0145 0154 0154 0157');
      expect(convertTextToUtf8Binary('hello', { base: 10 })).toBe('104 101 108 108 111');
      expect(convertTextToUtf8Binary('hello', { base: 16 })).toBe('68 65 6c 6c 6f');
      expect(convertTextToUtf8Binary('')).toBe('');
    });
    it('the separator between octets can be changed', () => {
      expect(convertTextToUtf8Binary('hello', { separator: '' })).toBe('0110100001100101011011000110110001101111');
      expect(convertTextToUtf8Binary('hello', { separator: '-' })).toBe('01101000-01100101-01101100-01101100-01101111');
      expect(convertTextToUtf8Binary('hello', { separator: '-', base: 16 })).toBe('68-65-6c-6c-6f');
    });
    it('works with non-ASCII input', () => {
      for (const { text, binary } of utf8Tests) {
        const converted = convertTextToUtf8Binary(text);
        expect(converted).toBe(binary);
      }

      expect(convertTextToUtf8Binary('💩 A', { base: 2 })).toBe('11110000 10011111 10010010 10101001 00100000 01000001');
      expect(convertTextToUtf8Binary('💩 A', { base: 8 })).toBe('0360 0237 0222 0251 040 0101');
      expect(convertTextToUtf8Binary('💩 A', { base: 10 })).toBe('240 159 146 169 32 65');
      expect(convertTextToUtf8Binary('💩 A', { base: 16 })).toBe('f0 9f 92 a9 20 41');
    });
  });

  describe('convertUtf8BinaryToText', () => {
    it('an ascii binary string is converted to its text representation', () => {
      expect(convertUtf8BinaryToText('01101000 01100101 01101100 01101100 01101111')).toBe('hello');
      expect(convertUtf8BinaryToText('01101000 01100101 01101100 01101100 01101111', { base: 2 })).toBe('hello');
      expect(convertUtf8BinaryToText('0150 0145 0154 0154 0157', { base: 8 })).toBe('hello');
      expect(convertUtf8BinaryToText('104 101 108 108 111', { base: 10 })).toBe('hello');
      expect(convertUtf8BinaryToText('68 65 6c 6c 6f', { base: 16 })).toBe('hello');

      expect(convertUtf8BinaryToText('11110000 10011111 10010010 10101001 00100000 01000001', { base: 2 })).toBe('💩 A');
      expect(convertUtf8BinaryToText('0360 0237 0222 0251 040 0101', { base: 8 })).toBe('💩 A');
      expect(convertUtf8BinaryToText('240 159 146 169 32 65', { base: 10 })).toBe('💩 A');
      expect(convertUtf8BinaryToText('f0 9f 92 a9 20 41', { base: 16 })).toBe('💩 A');

      expect(convertUtf8BinaryToText('')).toBe('');

      expect(convertUtf8BinaryToText('01000001')).toBe('A');
      expect(convertUtf8BinaryToText('0101', { base: 8 })).toBe('A');
      expect(convertUtf8BinaryToText('65', { base: 10 })).toBe('A');
      expect(convertUtf8BinaryToText('41', { base: 16 })).toBe('A');
    });

    it('the given string is cleaned before conversion', () => {
      expect(convertUtf8BinaryToText('  01000 001garbage')).toBe('A');
      expect(convertUtf8BinaryToText('  65garbage', { base: 10 })).toBe('A');
      expect(convertUtf8BinaryToText('  41xxxx', { base: 16 })).toBe('A');
    });

    it('throws an error if the given binary string is not an integer number of complete octets', () => {
      expect(() => convertUtf8BinaryToText('010000011')).toThrow('Invalid binary string');
      expect(() => convertUtf8BinaryToText('010000011 010000011')).toThrow('Invalid binary string');
      expect(() => convertUtf8BinaryToText('1')).toThrow('Invalid binary string');
    });

    it('throws an error if the given binary string is not valid UTF-8', () => {
      expect(() => convertUtf8BinaryToText('11111111')).toThrow();
    });

    it('the given string is cleaned from prefix before conversion', () => {
      expect(convertUtf8BinaryToText('0b01000001')).toBe('A');
      expect(convertUtf8BinaryToText('0x41', { base: 16 })).toBe('A');
      expect(convertUtf8BinaryToText('0x68 0x65 0x6c 0x6c 0x6f', { base: 16 })).toBe('hello');
      expect(convertUtf8BinaryToText('\\x68\\x65\\x6c\\x6c\\x6f', { base: 16 })).toBe('hello');
    });

    it('works with non-ASCII input', () => {
      for (const { text, binary } of utf8Tests) {
        const reverted = convertUtf8BinaryToText(binary);
        expect(reverted).toBe(text);
      }
    });
  });
});
