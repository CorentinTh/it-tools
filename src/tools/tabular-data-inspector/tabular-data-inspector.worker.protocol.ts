import type { TableDelimiter } from '../markdown-table-generator/markdown-table-generator.service';
import type { EmptyCellMode, TabularDataTask, TabularOutputFormat } from './tabular-data-inspector.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const TABULAR_MAX_INPUT_BYTES = 1024 * 1024;
export const TABULAR_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const TABULAR_TIMEOUT_MS = 8_000;
export const TABULAR_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter bounded CSV/TSV data and valid processing options.',
  'input-limit': 'Tabular input is limited to 1 MiB of UTF-8 text.',
  'output-limit': 'Tabular output is limited to 2 MiB of UTF-8 text.',
  'processing': 'Tabular processing failed. Check quoting, delimiter, row, column, cell, and output limits.',
};

function isDelimiter(value: unknown): value is TableDelimiter {
  return value === 'auto' || value === 'comma' || value === 'tab';
}
function isOutputFormat(value: unknown): value is TabularOutputFormat {
  return value === 'inspect' || value === 'json-strings' || value === 'json-inferred' || value === 'csv' || value === 'tsv';
}
function isEmptyCellMode(value: unknown): value is EmptyCellMode {
  return value === 'empty-string' || value === 'null';
}

export function parseTabularDataTask(value: unknown): TabularDataTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'delimiter,emptyCellMode,firstRowHeader,outputFormat,protectSpreadsheetFormulas,source,trimCells'
    || typeof value.source !== 'string'
    || !value.source.trim()
    || !isDelimiter(value.delimiter)
    || !isOutputFormat(value.outputFormat)
    || !isEmptyCellMode(value.emptyCellMode)
    || typeof value.firstRowHeader !== 'boolean'
    || typeof value.trimCells !== 'boolean'
    || typeof value.protectSpreadsheetFormulas !== 'boolean') {
    throw new BoundedTextTaskError('validation', TABULAR_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, TABULAR_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', TABULAR_ERROR_MESSAGES['input-limit']);
  }
  return value as unknown as TabularDataTask;
}
