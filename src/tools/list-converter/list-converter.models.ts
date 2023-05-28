import _ from 'lodash';
import type { ConvertOptions } from './list-converter.types';
import { byOrder } from '@/utils/array';

export { convert };

function whenever<T, R>(condition: boolean, fn: (value: T) => R) {
  return (value: T) =>
    condition ? fn(value) : value;
}

function convert(list: string, options: ConvertOptions): string {
  const lineBreak = options.keepLineBreaks ? '\n' : '';

  return _.chain(list)
    .thru(whenever(options.lowerCase, text => text.toLowerCase()))
    .split('\n')
    .thru(whenever(options.removeDuplicates, _.uniq))
    .thru(whenever(options.reverseList, _.reverse))
    .thru(whenever(!_.isNull(options.sortList), parts => parts.sort(byOrder({ order: options.sortList }))))
    .map(whenever(options.trimItems, _.trim))
    .without('')
    .map(p => options.itemPrefix + p + options.itemSuffix)
    .join(options.separator + lineBreak)
    .thru(text => [options.listPrefix, text, options.listSuffix].join(lineBreak))
    .value();
}
