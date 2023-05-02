import { expect, describe, it } from 'vitest';
import { convert } from './list-converter.models';
import type { ConvertOptions } from './list-converter.types';

describe('list-converter', () => {
  describe('convert', () => {
    it('should convert a given list', () => {
      const options = {
        separator: ', ',
        trimItems: true,
        removeDuplicates: true,
        itemPrefix: '"',
        itemSuffix: '"',
      } as ConvertOptions;
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
      const options = {
        separator: ', ',
        trimItems: true,
      } as ConvertOptions;
      expect(convert('', options)).toEqual('');
    });

    it('should keep line breaks', () => {
      const options = {
        separator: '',
        trimItems: true,
        itemPrefix: '<li>',
        itemSuffix: '</li>',
        listPrefix: '<ul>',
        listSuffix: '</ul>',
        keepLineBreaks: true,
      } as ConvertOptions;
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
  });
});
