import { describe, expect, it } from 'vitest';
import { convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';

describe('list-converter', () => {
  describe('convert', () => {
    it('should convert a given list', () => {
      const options: ConvertOptions = {
        itemsSeparator: ', ',
        trimItems: true,
        removeDuplicates: true,
        itemPrefix: '"',
        itemSuffix: '"',
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
        itemsSeparator: ', ',
        trimItems: true,
        removeDuplicates: true,
      };
      expect(convert('', options)).toEqual('');
    });

    it('should keep line breaks', () => {
      const options: ConvertOptions = {
        trimItems: true,
        itemPrefix: '<li>',
        itemSuffix: '</li>',
        listPrefix: '<ul>',
        listSuffix: '</ul>',
        keepLineBreaks: true,
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

    it('should remove prefix and suffix', () => {
      const options: ConvertOptions = {
        trimItems: true,
        removeItemPrefix: '<li>',
        removeItemSuffix: '</li>',
        keepLineBreaks: true,
      };
      const input = `
<li>1</li>
<li>2</li>
<li>3</li>
        `;
      const expected = `1
2
3`;
      expect(convert(input, options)).toEqual(expected);
    });

    it('should split by separator', () => {
      const options: ConvertOptions = {
        trimItems: true,
        keepLineBreaks: true,
        splitBySeparator: ',',
      };
      const input = '1,2,3';
      const expected = `1
2
3`;
      expect(convert(input, options)).toEqual(expected);
    });

    it('should sort by asc-num', () => {
      const options: ConvertOptions = {
        trimItems: true,
        keepLineBreaks: true,
        sortList: 'asc-num',
      };
      const input = `3
20
1`;
      const expected = `1
3
20`;
      expect(convert(input, options)).toEqual(expected);
    });
    it('should sort by desc', () => {
      const options: ConvertOptions = {
        trimItems: true,
        keepLineBreaks: true,
        sortList: 'desc',
      };
      const input = `1
20
3`;
      const expected = `3
20
1`;
      expect(convert(input, options)).toEqual(expected);
    });
  });
});
