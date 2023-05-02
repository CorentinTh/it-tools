import _ from 'lodash';
import type { ConvertOptions } from './list-converter.types';

export { convert };

function convert(list: string, options: ConvertOptions): string {
  if (options.lowerCase) {
    list = list.toLowerCase();
  }

  let parts: string[];
  parts = list.split('\n');

  if (options.removeDuplicates) {
    parts = _.uniq(parts);
  }

  if (options.reverseList) {
    parts = _.reverse(parts);
  }

  if (options.sortList) {
    parts = parts.sort((a, b) => (options.sortList === 'asc' ? a.localeCompare(b) : b.localeCompare(a)));
  }

  if (options.trimItems) {
    parts = _.map(parts, (p) => p.trim());
  }

  // Remove empty lines
  parts = _.without(parts, '');

  if (options.itemPrefix) {
    parts = _.map(parts, (p) => options.itemPrefix + p);
  }

  if (options.itemSuffix) {
    parts = _.map(parts, (p) => p + options.itemSuffix);
  }

  let str = '';
  if (options.listPrefix) {
    str += options.listPrefix + (options.keepLineBreaks ? '\n' : '');
  }

  if (options.keepLineBreaks) {
    _.forEach(parts, (p) => (str += p + (options.separator || '') + '\n'));
  } else {
    str += parts.join(options.separator);
  }
  if (options.listSuffix) {
    str += options.listSuffix;
  }
  return str;
}
