import { describe, expect, it } from 'vitest';
import { convertArrayToCsv, getHeaders } from './json-to-csv.service';

describe('json-to-csv service', () => {
  describe('getHeaders', () => {
    it('extracts all the keys from the array of objects', () => {
      expect(getHeaders({ array: [{ a: 1, b: 2 }, { a: 3, c: 4 }] })).toEqual(['a', 'b', 'c']);
    });

    it('returns an empty array if the array is empty', () => {
      expect(getHeaders({ array: [] })).toEqual([]);
    });
  });

  describe('convertArrayToCsv', () => {
    it('converts an array of objects to a CSV string with CRLF row separators', () => {
      const array = [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ];

      expect(convertArrayToCsv({ array })).toEqual('a,b\r\n1,2\r\n3,4');
    });

    it('converts an array of objects with different keys to a CSV string', () => {
      const array = [
        { a: 1, b: 2 },
        { a: 3, c: 4 },
      ];

      expect(convertArrayToCsv({ array })).toEqual('a,b,c\r\n1,2,\r\n3,,4');
    });

    it('when a value is null, it is converted to the string "null"', () => {
      const array = [
        { a: null, b: 2 },
      ];

      expect(convertArrayToCsv({ array })).toEqual('a,b\r\nnull,2');
    });

    it('when a value is undefined, it is converted to an empty string', () => {
      const array = [
        { a: undefined, b: 2 },
        { b: 3 },
      ];

      expect(convertArrayToCsv({ array })).toEqual('a,b\r\n,2\r\n,3');
    });

    it('when a value contains a comma, it is wrapped in double quotes', () => {
      const array = [
        { a: 'hello, world', b: 2 },
      ];

      expect(convertArrayToCsv({ array })).toEqual('a,b\r\n"hello, world",2');
    });

    it('when a value contains a double quote, it is escaped with another double quote', () => {
      const array = [
        { a: 'hello "world"', b: 2 },
      ];

      expect(convertArrayToCsv({ array })).toEqual('a,b\r\n"hello ""world""",2');
    });

    it('when a value contains a comma and a double quote, it is wrapped in double quotes and the double quote is escaped', () => {
      const array = [
        { a: 'say "hi", then leave', b: 2 },
      ];

      expect(convertArrayToCsv({ array })).toEqual('a,b\r\n"say ""hi"", then leave",2');
    });

    it('when a value contains a line break, it is wrapped in double quotes and the line break is kept', () => {
      const array = [
        { a: 'line 1\nline 2', b: 'line 1\r\nline 2' },
      ];

      expect(convertArrayToCsv({ array })).toEqual('a,b\r\n"line 1\nline 2","line 1\r\nline 2"');
    });

    it('when a header contains a comma or a double quote, it is escaped like a value', () => {
      const array = [
        { 'a,b': 1, 'say "hi"': 2 },
      ];

      expect(convertArrayToCsv({ array })).toEqual('"a,b","say ""hi"""\r\n1,2');
    });
  });
});
