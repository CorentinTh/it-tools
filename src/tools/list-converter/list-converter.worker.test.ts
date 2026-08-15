import { describe, expect, it } from 'vitest';
import { handleListConverterWorkerRequest } from './list-converter.worker';
import {
  LIST_CONVERTER_ERROR_MESSAGES,
  LIST_CONVERTER_MAX_INPUT_BYTES,
  LIST_CONVERTER_OUTPUT_FLOOR_BYTES,
  getListConverterOutputLimit,
  parseListConverterTask,
} from './list-converter.worker.protocol';
import type { ConvertOptions } from './list-converter.types';

const options: ConvertOptions = {
  itemPrefix: '"',
  itemSuffix: '"',
  keepLineBreaks: false,
  listPrefix: '[',
  listSuffix: ']',
  lowerCase: true,
  removeDuplicates: true,
  reverseList: false,
  separator: ', ',
  sortList: 'asc',
  trimItems: true,
};

describe('List Converter worker', () => {
  it('accepts only exact bounded tasks and options', () => {
    expect(parseListConverterTask({ options, source: 'B\na' })).toEqual({ options, source: 'B\na' });
    expect(() => parseListConverterTask({ options: { ...options, leaked: true }, source: 'a' }))
      .toThrow(LIST_CONVERTER_ERROR_MESSAGES.validation);
    expect(() => parseListConverterTask({ options, source: 'x'.repeat(LIST_CONVERTER_MAX_INPUT_BYTES + 1) }))
      .toThrow(LIST_CONVERTER_ERROR_MESSAGES['input-limit']);
    expect(getListConverterOutputLimit(1)).toBe(LIST_CONVERTER_OUTPUT_FLOOR_BYTES);
  });

  it('converts in the worker and returns exact byte metadata', () => {
    expect(handleListConverterWorkerRequest({ jobId: 8, task: { options, source: 'B\na\nB' } })).toEqual({
      jobId: 8,
      type: 'result',
      result: { byteLength: 10, value: '["a", "b"]' },
    });
  });

  it('rejects output amplification without echoing content', () => {
    const source = Array.from({ length: 10_000 }, (_, index) => `item-${index}`).join('\n');
    const amplified = { ...options, itemPrefix: 'x'.repeat(100), removeDuplicates: false, sortList: null };
    expect(handleListConverterWorkerRequest({ jobId: 9, task: { options: amplified, source } })).toEqual({
      jobId: 9,
      type: 'error',
      code: 'output-limit',
      message: LIST_CONVERTER_ERROR_MESSAGES['output-limit'],
    });
  });
});
