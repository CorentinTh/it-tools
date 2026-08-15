import { describe, expect, it } from 'vitest';
import { CsvOutputLimitError, convertArrayToCsv, getHeaders } from './json-to-csv.service';

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
    it('converts an array of objects to a CSV string', () => {
      const array = [
        { a: 1, b: 2 },
        { a: 3, b: 4 },

      ];

      expect(convertArrayToCsv({ array })).toMatchInlineSnapshot(`
        "a,b
        1,2
        3,4"
      `);
    });

    it('converts an array of objects with different keys to a CSV string', () => {
      const array = [
        { a: 1, b: 2 },
        { a: 3, c: 4 },
      ];

      expect(convertArrayToCsv({ array })).toMatchInlineSnapshot(`
        "a,b,c
        1,2,
        3,,4"
      `);
    });

    it('when a value is null, it is converted to the string "null"', () => {
      const array = [
        { a: null, b: 2 },
      ];

      expect(convertArrayToCsv({ array })).toMatchInlineSnapshot(`
        "a,b
        null,2"
      `);
    });

    it('when a value is undefined, it is converted to an empty string', () => {
      const array = [
        { a: undefined, b: 2 },
        { b: 3 },
      ];

      expect(convertArrayToCsv({ array })).toMatchInlineSnapshot(`
        "a,b
        ,2
        ,3"
      `);
    });

    it('when a value contains a comma, it is wrapped in double quotes', () => {
      const array = [
        { a: 'hello, world', b: 2 },
      ];

      expect(convertArrayToCsv({ array })).toMatchInlineSnapshot(`
        "a,b
        \\"hello, world\\",2"
      `);
    });

    it('when a value contains a double quote, it is escaped with another double quote', () => {
      const array = [
        { a: 'hello "world"', b: 2 },
      ];

      expect(convertArrayToCsv({ array })).toMatchInlineSnapshot(`
        "a,b
        \\"hello \\"\\"world\\"\\"\\",2"
      `);
    });

    it('quotes values containing line breaks without changing their content', () => {
      const array = [
        { a: 'first line\nsecond line', b: 'carriage\rreturn' },
      ];

      expect(convertArrayToCsv({ array })).toBe('a,b\n"first line\nsecond line","carriage\rreturn"');
    });

    it('quotes and escapes header fields using the same CSV rules', () => {
      const array = [
        { 'comma,key': 1, 'quoted"key': 2 },
      ];

      expect(convertArrayToCsv({ array })).toBe('"comma,key","quoted""key"\n1,2');
    });

    it('stops incrementally before output exceeds its UTF-8 byte budget', () => {
      expect(() => convertArrayToCsv({ array: [{ value: '🙂🙂' }], maxOutputBytes: 12 }))
        .toThrow(CsvOutputLimitError);
      expect(convertArrayToCsv({ array: [{ value: '🙂' }], maxOutputBytes: 10 })).toBe('value\n🙂');
    });
  });
});
