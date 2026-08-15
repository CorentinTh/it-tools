import { describe, expect, it } from 'vitest';
import { handleJsonToCsvWorkerRequest } from './json-to-csv.worker';
import {
  JSON_TO_CSV_ERROR_MESSAGES,
  JSON_TO_CSV_OUTPUT_FLOOR_BYTES,
} from './json-to-csv.worker.protocol';

describe('JSON-to-CSV worker', () => {
  it('parses JSON5 once and preserves CSV quoting semantics', () => {
    expect(handleJsonToCsvWorkerRequest({
      jobId: 7,
      task: { source: '[{name:\'Ada\', note:\'hello, "world"\', line:\'a\\nb\'}, {name:\'Lin\'}]' },
    })).toMatchObject({
      jobId: 7,
      type: 'result',
      result: { value: 'name,note,line\nAda,"hello, ""world""","a\nb"\nLin,,' },
    });
  });

  it.each(['{}', '[1, 2]', '{'])('returns a static processing error for invalid CSV input: %s', (source) => {
    expect(handleJsonToCsvWorkerRequest({ jobId: 3, task: { source } })).toEqual({
      jobId: 3,
      type: 'error',
      code: 'processing',
      message: JSON_TO_CSV_ERROR_MESSAGES.processing,
    });
  });

  it('stops pathological header-union amplification at the derived output bound', () => {
    const columns = Array.from({ length: 700 }, (_, index) => `"column_${index}":${index}`).join(',');
    const rows = Array.from({ length: 100 }, (_, index) => index === 0 ? `{${columns}}` : `{ "row": ${index} }`);
    const source = `[${rows.join(',')}]`;
    expect(new TextEncoder().encode(source).byteLength).toBeLessThan(JSON_TO_CSV_OUTPUT_FLOOR_BYTES);

    expect(handleJsonToCsvWorkerRequest({ jobId: 5, task: { source } })).toEqual({
      jobId: 5,
      type: 'error',
      code: 'output-limit',
      message: JSON_TO_CSV_ERROR_MESSAGES['output-limit'],
    });
  });
});
