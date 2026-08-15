import type { ConvertOptions, SortOrder } from './list-converter.types';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const LIST_CONVERTER_LIVE_MAX_BYTES = 64 * 1024;
export const LIST_CONVERTER_MAX_INPUT_BYTES = 1024 * 1024;
export const LIST_CONVERTER_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const LIST_CONVERTER_OUTPUT_AMPLIFICATION = 4;
export const LIST_CONVERTER_OUTPUT_FLOOR_BYTES = 64 * 1024;
export const LIST_CONVERTER_MAX_OPTION_BYTES = 1024;
export const LIST_CONVERTER_TASK_TIMEOUT_MS = 8_000;

export interface ListConverterTask {
  options: ConvertOptions
  source: string
}

export const LIST_CONVERTER_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter a list and select valid conversion options.',
  'input-limit': `List input is limited to ${LIST_CONVERTER_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `List output is limited to ${LIST_CONVERTER_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes and bounded amplification.`,
  'processing': 'The list could not be converted.',
};

const OPTION_KEYS = [
  'itemPrefix',
  'itemSuffix',
  'keepLineBreaks',
  'listPrefix',
  'listSuffix',
  'lowerCase',
  'removeDuplicates',
  'reverseList',
  'separator',
  'sortList',
  'trimItems',
] as const;
const STRING_OPTION_KEYS = ['itemPrefix', 'itemSuffix', 'listPrefix', 'listSuffix', 'separator'] as const;
const BOOLEAN_OPTION_KEYS = ['keepLineBreaks', 'lowerCase', 'removeDuplicates', 'reverseList', 'trimItems'] as const;

function isSortOrder(value: unknown): value is SortOrder {
  return value === null || value === 'asc' || value === 'desc';
}

function isBoundedOptionString(value: unknown): value is string {
  return typeof value === 'string' && !exceedsUtf8ByteLimit(value, LIST_CONVERTER_MAX_OPTION_BYTES);
}

function parseOptions(value: unknown): ConvertOptions {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== [...OPTION_KEYS].sort().join(',')
    || STRING_OPTION_KEYS.some(key => !isBoundedOptionString(value[key]))
    || BOOLEAN_OPTION_KEYS.some(key => typeof value[key] !== 'boolean')
    || !isSortOrder(value.sortList)
  ) {
    throw new BoundedTextTaskError('validation', LIST_CONVERTER_ERROR_MESSAGES.validation);
  }
  return {
    itemPrefix: value.itemPrefix as string,
    itemSuffix: value.itemSuffix as string,
    keepLineBreaks: value.keepLineBreaks as boolean,
    listPrefix: value.listPrefix as string,
    listSuffix: value.listSuffix as string,
    lowerCase: value.lowerCase as boolean,
    removeDuplicates: value.removeDuplicates as boolean,
    reverseList: value.reverseList as boolean,
    separator: value.separator as string,
    sortList: value.sortList,
    trimItems: value.trimItems as boolean,
  };
}

export function parseListConverterTask(value: unknown): ListConverterTask {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'options,source'
    || typeof value.source !== 'string'
    || value.source === ''
  ) {
    throw new BoundedTextTaskError('validation', LIST_CONVERTER_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, LIST_CONVERTER_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', LIST_CONVERTER_ERROR_MESSAGES['input-limit']);
  }
  return { options: parseOptions(value.options), source: value.source };
}

export function getListConverterOutputLimit(inputBytes: number): number {
  if (!Number.isSafeInteger(inputBytes) || inputBytes < 0 || inputBytes > LIST_CONVERTER_MAX_INPUT_BYTES) {
    throw new RangeError('inputBytes must be within the List Converter input limit.');
  }
  return Math.min(
    LIST_CONVERTER_MAX_OUTPUT_BYTES,
    Math.max(LIST_CONVERTER_OUTPUT_FLOOR_BYTES, inputBytes * LIST_CONVERTER_OUTPUT_AMPLIFICATION),
  );
}
