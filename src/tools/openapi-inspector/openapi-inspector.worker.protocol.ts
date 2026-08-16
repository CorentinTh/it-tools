import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const OPENAPI_MAX_INPUT_BYTES = 1024 * 1024;
export const OPENAPI_MAX_OUTPUT_BYTES = 1024 * 1024;
export const OPENAPI_TIMEOUT_MS = 8_000;

export interface OpenApiInspectionTask { source: string }

export const OPENAPI_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'input-limit': `OpenAPI input is limited to ${OPENAPI_MAX_INPUT_BYTES.toLocaleString('en-US')} UTF-8 bytes.`,
  'output-limit': `OpenAPI report is limited to ${OPENAPI_MAX_OUTPUT_BYTES.toLocaleString('en-US')} UTF-8 bytes.`,
  'processing': 'The OpenAPI document could not be inspected. Check its syntax, structure, references, and limits.',
  'validation': 'Enter a local OpenAPI 3.0 or 3.1 JSON/YAML document.',
};

export function parseOpenApiTask(value: unknown): OpenApiInspectionTask {
  if (!isUnknownRecord(value) || Object.keys(value).join(',') !== 'source' || typeof value.source !== 'string' || value.source.trim() === '') {
    throw new BoundedTextTaskError('validation', OPENAPI_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, OPENAPI_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', OPENAPI_ERROR_MESSAGES['input-limit']);
  }
  return { source: value.source };
}
