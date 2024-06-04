import { describe, expect, it } from 'vitest';
import { convertCsvToArray, getHeaders } from './csv-to-json.service';

describe('csv-to-json service', () => {
  describe('getHeaders', () => {
    it('extracts all the keys from the first line of the CSV', () => {
      expect(getHeaders('a,b,c\n1,2,3\n4,5,6')).toEqual(['a', 'b', 'c']);
    });

    it('returns an empty array if the CSV is empty', () => {
      expect(getHeaders('')).toEqual([]);
    });
  });

  describe('convertCsvToArray', () => {
    it('converts a CSV string to an array of objects', () => {
      const csv = 'a,b\n1,2\n3,4';

      expect(convertCsvToArray(csv)).toEqual([
        { a: '1', b: '2' },
        { a: '3', b: '4' },
      ]);
    });

    it('converts a CSV string with different keys to an array of objects', () => {
      const csv = 'a,b,c\n1,2,\n3,,4';

      expect(convertCsvToArray(csv)).toEqual([
        { a: '1', b: '2', c: undefined },
        { a: '3', b: undefined, c: '4' },
      ]);
    });

    it('when a value is "null", it is converted to null', () => {
      const csv = 'a,b\nnull,2';

      expect(convertCsvToArray(csv)).toEqual([
        { a: null, b: '2' },
      ]);
    });

    it('when a value is empty, it is converted to undefined', () => {
      const csv = 'a,b\n,2\n,3';

      expect(convertCsvToArray(csv)).toEqual([
        { a: undefined, b: '2' },
        { a: undefined, b: '3' },
      ]);
    });

    it('when a value is wrapped in double quotes, the quotes are removed', () => {
      const csv = 'a,b\n"hello, world",2';

      expect(convertCsvToArray(csv)).toEqual([
        { a: 'hello, world', b: '2' },
      ]);
    });

    it('when a value contains an escaped double quote, the escape character is removed', () => {
      const csv = 'a,b\nhello \\"world\\",2';

      expect(convertCsvToArray(csv)).toEqual([
        { a: 'hello "world"', b: '2' },
      ]);
    });
  });
});
