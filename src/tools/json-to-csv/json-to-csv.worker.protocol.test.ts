import { describe, expect, it } from 'vitest';
import {
  JSON_TO_CSV_ERROR_MESSAGES,
  JSON_TO_CSV_MAX_INPUT_BYTES,
  JSON_TO_CSV_MAX_OUTPUT_BYTES,
  JSON_TO_CSV_OUTPUT_FLOOR_BYTES,
  getJsonToCsvOutputLimit,
  parseJsonToCsvTask,
} from './json-to-csv.worker.protocol';

describe('JSON-to-CSV worker protocol', () => {
  it('accepts only an exact non-empty bounded task', () => {
    expect(parseJsonToCsvTask({ source: '[{a:1}]' })).toEqual({ source: '[{a:1}]' });
    expect(() => parseJsonToCsvTask({ source: '[{a:1}]', secret: 'do-not-send' }))
      .toThrow(JSON_TO_CSV_ERROR_MESSAGES.validation);
    expect(() => parseJsonToCsvTask({ source: '' })).toThrow(JSON_TO_CSV_ERROR_MESSAGES.validation);
    expect(() => parseJsonToCsvTask({ source: 'x'.repeat(JSON_TO_CSV_MAX_INPUT_BYTES + 1) }))
      .toThrow(JSON_TO_CSV_ERROR_MESSAGES['input-limit']);
  });

  it('bounds small-output headroom, amplification, and the absolute ceiling', () => {
    expect(getJsonToCsvOutputLimit(1)).toBe(JSON_TO_CSV_OUTPUT_FLOOR_BYTES);
    expect(getJsonToCsvOutputLimit(100_000)).toBe(400_000);
    expect(getJsonToCsvOutputLimit(JSON_TO_CSV_MAX_INPUT_BYTES)).toBe(JSON_TO_CSV_MAX_OUTPUT_BYTES);
    expect(() => getJsonToCsvOutputLimit(JSON_TO_CSV_MAX_INPUT_BYTES + 1)).toThrow(RangeError);
  });
});
