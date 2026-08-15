import type { ConvertOptions } from './list-converter.types';
import { byOrder } from '@/utils/array';

export { convert };

export class ListOutputLimitError extends Error {
  override readonly name = 'ListOutputLimitError';
}

function convert(list: string, options: ConvertOptions, maxOutputBytes = Number.MAX_SAFE_INTEGER): string {
  if (!Number.isSafeInteger(maxOutputBytes) || maxOutputBytes < 0) {
    throw new RangeError('maxOutputBytes must be a non-negative safe integer.');
  }

  const lineBreak = options.keepLineBreaks ? '\n' : '';
  let parts = (options.lowerCase ? list.toLowerCase() : list).split('\n');

  if (options.removeDuplicates) {
    parts = [...new Set(parts)];
  }
  if (options.reverseList) {
    parts.reverse();
  }
  if (options.sortList !== null) {
    parts.sort(byOrder({ order: options.sortList }));
  }
  if (options.trimItems) {
    parts = parts.map(part => part.trim());
  }
  parts = parts.filter(part => part !== '');

  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let byteLength = 0;
  function append(value: string): void {
    byteLength += encoder.encode(value).byteLength;
    if (byteLength > maxOutputBytes) {
      throw new ListOutputLimitError('List output exceeds its byte limit.');
    }
    chunks.push(value);
  }

  append(options.listPrefix);
  append(lineBreak);
  parts.forEach((part, index) => {
    if (index > 0) {
      append(options.separator);
      append(lineBreak);
    }
    append(options.itemPrefix);
    append(part);
    append(options.itemSuffix);
  });
  append(lineBreak);
  append(options.listSuffix);

  return chunks.join('');
}
