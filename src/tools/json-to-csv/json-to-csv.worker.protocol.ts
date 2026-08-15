import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const JSON_TO_CSV_LIVE_MAX_BYTES = 64 * 1024;
export const JSON_TO_CSV_MAX_INPUT_BYTES = 1024 * 1024;
export const JSON_TO_CSV_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const JSON_TO_CSV_OUTPUT_AMPLIFICATION = 4;
export const JSON_TO_CSV_OUTPUT_FLOOR_BYTES = 64 * 1024;
export const JSON_TO_CSV_TASK_TIMEOUT_MS = 8_000;

export interface JsonToCsvTask {
  source: string
}

export const JSON_TO_CSV_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter a JSON5 array of objects to convert.',
  'input-limit': `JSON-to-CSV input is limited to ${JSON_TO_CSV_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `CSV output is limited to ${JSON_TO_CSV_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes and bounded amplification.`,
  'processing': 'The JSON document could not be converted. Check that it is an array of objects.',
};

export function parseJsonToCsvTask(value: unknown): JsonToCsvTask {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'source'
    || typeof value.source !== 'string'
    || value.source.trim() === ''
  ) {
    throw new BoundedTextTaskError('validation', JSON_TO_CSV_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, JSON_TO_CSV_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', JSON_TO_CSV_ERROR_MESSAGES['input-limit']);
  }
  return { source: value.source };
}

export function getJsonToCsvOutputLimit(inputBytes: number): number {
  if (!Number.isSafeInteger(inputBytes) || inputBytes < 0 || inputBytes > JSON_TO_CSV_MAX_INPUT_BYTES) {
    throw new RangeError('inputBytes must be within the JSON-to-CSV input limit.');
  }
  return Math.min(
    JSON_TO_CSV_MAX_OUTPUT_BYTES,
    Math.max(JSON_TO_CSV_OUTPUT_FLOOR_BYTES, inputBytes * JSON_TO_CSV_OUTPUT_AMPLIFICATION),
  );
}
