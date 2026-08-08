// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { isValidXML, parseXml } from './xml-diff.parser';

describe('xml-diff parser', () => {
  describe('parseXml', () => {
    it('returns undefined for an empty string', () => {
      expect(parseXml('')).toBeUndefined();
      expect(parseXml('   ')).toBeUndefined();
    });

    it('returns undefined for invalid xml', () => {
      expect(parseXml('<a><b></a>')).toBeUndefined();
    });

    it('parses a leaf element to its text content', () => {
      expect(parseXml('<foo>bar</foo>')).toEqual('bar');
    });

    it('parses an empty element to an empty string', () => {
      expect(parseXml('<foo/>')).toEqual('');
    });

    it('parses attributes with an "@" prefix', () => {
      expect(parseXml('<foo a="1" b="2"/>')).toEqual({ '@a': '1', '@b': '2' });
    });

    it('parses a single child element as a plain value', () => {
      expect(parseXml('<root><item>A</item></root>')).toEqual({ item: 'A' });
    });

    it('parses repeated child elements as an array', () => {
      expect(parseXml('<root><item>A</item><item>B</item></root>')).toEqual({ item: ['A', 'B'] });
    });

    it('combines attributes, text and children', () => {
      expect(parseXml('<root id="1">hello<child>world</child></root>')).toEqual({
        '@id': '1',
        '#text': 'hello',
        'child': 'world',
      });
    });

    it('ignores insignificant whitespace between tags', () => {
      const withoutWhitespace = parseXml('<foo><bar>baz</bar></foo>');
      const withWhitespace = parseXml('<foo>\n  <bar>baz</bar>\n</foo>');

      expect(withWhitespace).toEqual(withoutWhitespace);
    });
  });

  describe('isValidXML', () => {
    it('accepts an empty string', () => {
      expect(isValidXML('')).toBe(true);
    });

    it('accepts valid xml', () => {
      expect(isValidXML('<foo>bar</foo>')).toBe(true);
    });

    it('rejects invalid xml', () => {
      expect(isValidXML('<a><b></a>')).toBe(false);
    });
  });
});
