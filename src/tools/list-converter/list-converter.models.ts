import _ from 'lodash';
import type { ConvertOptions } from './list-converter.types';
import { byOrder } from '@/utils/array';

export { convert };

function whenever<T, R>(condition: boolean | undefined, fn: (value: T) => R) {
  return (value: T) =>
    condition ? fn(value) : value;
}

function convert(list: string, options: ConvertOptions): string {
  const lineBreak = options.keepLineBreaks ? '\n' : '';

  const splitSep = options.splitBySeparator ? `${options.splitBySeparator}|` : '';
  const splitRegExp = new RegExp(`(?:${splitSep}\\n)`, 'g');
  return _.chain(list)
    .thru(whenever(options.lowerCase, text => text.toLowerCase()))
    .split(splitRegExp)
    .thru(whenever(options.removeDuplicates, _.uniq))
    .thru(whenever(options.reverseList, _.reverse))
    .map(whenever(options.trimItems, _.trim))
    .thru(whenever(!!options.sortList, parts => parts.sort(byOrder({ order: options.sortList }))))
    .without('')
    .map(p => options.removeItemPrefix ? p.replace(new RegExp(`^${options.removeItemPrefix}`, 'g'), '') : p)
    .map(p => options.removeItemSuffix ? p.replace(new RegExp(`${options.removeItemSuffix}$`, 'g'), '') : p)
    .map(p => (options.itemPrefix || '') + p + (options.itemSuffix || ''))
    .join((options.itemsSeparator || '') + lineBreak)
    .thru(text => [options.listPrefix, text, options.listSuffix].filter(l => l).join(lineBreak))
    .value();
}
