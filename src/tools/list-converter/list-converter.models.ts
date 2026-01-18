import _ from 'lodash';
import type { ConversionDirection, ConvertOptions } from './list-converter.types';
import { byOrder } from '@/utils/array';

export { convert };

const defaultDirection: ConversionDirection = 'column-to-list';

function whenever<T, R>(condition: boolean, fn: (value: T) => R) {
  return (value: T) =>
    condition ? fn(value) : value;
}

function stripAffixes(value: string, prefix: string, suffix: string) {
  let result = value;

  if (prefix && result.startsWith(prefix)) {
    result = result.slice(prefix.length);
  }

  if (suffix && result.endsWith(suffix)) {
    result = result.slice(0, Math.max(0, result.length - suffix.length));
  }

  return result;
}

function normalizeAffix(value: string, options: ConvertOptions) {
  return options.lowerCase ? value.toLowerCase() : value;
}

function stripListAffixes(text: string, options: ConvertOptions) {
  let result = text;
  const listPrefix = normalizeAffix(options.listPrefix, options);
  const listSuffix = normalizeAffix(options.listSuffix, options);

  if (listPrefix) {
    const prefixPattern = new RegExp(`^\\s*${_.escapeRegExp(listPrefix)}`);
    result = result.replace(prefixPattern, '');
  }

  if (listSuffix) {
    const suffixPattern = new RegExp(`${_.escapeRegExp(listSuffix)}\\s*$`);
    result = result.replace(suffixPattern, '');
  }

  return result;
}

function stripItemAffixes(value: string, options: ConvertOptions) {
  const itemPrefix = normalizeAffix(options.itemPrefix, options);
  const itemSuffix = normalizeAffix(options.itemSuffix, options);

  return stripAffixes(value, itemPrefix, itemSuffix);
}

function splitInput(text: string, options: ConvertOptions): string[] {
  const direction = options.direction ?? defaultDirection;

  if (direction === 'list-to-column') {
    const separator = options.separator;

    if (separator) {
      const escapedSeparator = _.escapeRegExp(separator);
      const separatorPattern = new RegExp(`${escapedSeparator}|\\r?\\n`);

      return text.split(separatorPattern);
    }

    return text.split(/\r?\n/);
  }

  return text.split(/\r?\n/);
}

function convert(list: string, options: ConvertOptions): string {
  const direction = options.direction ?? defaultDirection;
  const lineBreak = options.keepLineBreaks ? '\n' : '';
  const joiner = direction === 'list-to-column' ? '\n' : options.separator + lineBreak;

  const transformed = _.chain(list)
    .thru(whenever(options.lowerCase, text => text.toLowerCase()))
    .thru(text => (direction === 'list-to-column' ? stripListAffixes(text, options) : text))
    .thru(text => splitInput(text, options))
    .thru(whenever(options.removeDuplicates, _.uniq))
    .thru(whenever(options.reverseList, _.reverse))
    .thru(whenever(!_.isNull(options.sortList), parts => parts.sort(byOrder({ order: options.sortList }))))
    .map(whenever(options.trimItems, _.trim))
    .map((item) => {
      if (direction === 'list-to-column') {
        let stripped = stripItemAffixes(item, options);
        if (options.trimItems) {
          stripped = _.trim(stripped);
        }
        return stripped;
      }

      return options.itemPrefix + item + options.itemSuffix;
    })
    .thru(items => (direction === 'list-to-column' ? items.filter(item => item !== '') : _.without(items, '')))
    .join(joiner)
    .value();

  if (direction === 'list-to-column') {
    return transformed;
  }

  return [options.listPrefix, transformed, options.listSuffix].join(lineBreak);
}
