import { describe, expect, it } from 'vitest';
import { TABULAR_ERROR_MESSAGES, TABULAR_MAX_INPUT_BYTES, parseTabularDataTask } from './tabular-data-inspector.worker.protocol';

const valid = { source: 'a,b\n1,2', delimiter: 'auto', firstRowHeader: true, trimCells: false, outputFormat: 'inspect', emptyCellMode: 'empty-string', protectSpreadsheetFormulas: true };

describe('tabular worker protocol', () => {
  it('accepts only exact bounded task envelopes', () => {
    expect(parseTabularDataTask(valid)).toEqual(valid);
    expect(() => parseTabularDataTask({ ...valid, extra: true })).toThrow(TABULAR_ERROR_MESSAGES.validation);
    expect(() => parseTabularDataTask({ ...valid, source: 'x'.repeat(TABULAR_MAX_INPUT_BYTES + 1) })).toThrow(TABULAR_ERROR_MESSAGES['input-limit']);
  });
});
