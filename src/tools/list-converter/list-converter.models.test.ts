import { describe, expect, it } from 'vitest';
import { ListOutputLimitError, convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';

describe('list-converter', () => {
  describe('convert', () => {
    it('should convert a given list', () => {
      const options: ConvertOptions = {
        separator: ', ',
        trimItems: true,
        removeDuplicates: true,
        itemPrefix: '"',
        itemSuffix: '"',
        listPrefix: '',
        listSuffix: '',
        reverseList: false,
        sortList: null,
        lowerCase: false,
        keepLineBreaks: false,
      };
      const input = `
        1
        2
        
        3
        3
        4
        `;
      expect(convert(input, options)).toEqual('"1", "2", "3", "4"');
    });

    it('should return an empty value for an empty input', () => {
      const options: ConvertOptions = {
        separator: ', ',
        trimItems: true,
        removeDuplicates: true,
        itemPrefix: '',
        itemSuffix: '',
        listPrefix: '',
        listSuffix: '',
        reverseList: false,
        sortList: null,
        lowerCase: false,
        keepLineBreaks: false,
      };
      expect(convert('', options)).toEqual('');
    });

    it('should keep line breaks', () => {
      const options: ConvertOptions = {
        separator: '',
        trimItems: true,
        itemPrefix: '<li>',
        itemSuffix: '</li>',
        listPrefix: '<ul>',
        listSuffix: '</ul>',
        keepLineBreaks: true,
        lowerCase: false,
        removeDuplicates: false,
        reverseList: false,
        sortList: null,
      };
      const input = `
        1
        2
        3
        `;
      const expected = `<ul>
<li>1</li>
<li>2</li>
<li>3</li>
</ul>`;
      expect(convert(input, options)).toEqual(expected);
    });

    it('preserves the original operation order around deduplication and trimming', () => {
      const options: ConvertOptions = {
        separator: '|',
        trimItems: true,
        removeDuplicates: true,
        itemPrefix: '',
        itemSuffix: '',
        listPrefix: '',
        listSuffix: '',
        reverseList: false,
        sortList: null,
        lowerCase: false,
        keepLineBreaks: false,
      };
      expect(convert(' value\nvalue ', options)).toBe('value|value');
    });

    it('stops before affixes can amplify output beyond its byte budget', () => {
      const options: ConvertOptions = {
        separator: ',',
        trimItems: true,
        removeDuplicates: false,
        itemPrefix: '🙂',
        itemSuffix: '🙂',
        listPrefix: '',
        listSuffix: '',
        reverseList: false,
        sortList: null,
        lowerCase: false,
        keepLineBreaks: false,
      };
      expect(() => convert('a\nb', options, 10)).toThrow(ListOutputLimitError);
    });
  });
});
