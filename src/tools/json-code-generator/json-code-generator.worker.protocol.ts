import type { JsonCodeTask } from './json-code-generator.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const JSON_CODE_MAX_INPUT_BYTES = 1024 * 1024;
export const JSON_CODE_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const JSON_CODE_TIMEOUT_MS = 8_000;
export const JSON_CODE_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter a JSON example and select a supported output target.',
  'input-limit': 'JSON input is limited to 1 MiB of UTF-8 text.',
  'output-limit': 'Generated output is limited to 2 MiB of UTF-8 text.',
  'processing': 'The JSON example could not be analyzed or generated.',
};

export function parseJsonCodeTask(value: unknown): JsonCodeTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'comparison,rootName,source,target'
    || typeof value.source !== 'string' || !value.source.trim()
    || (value.target !== 'schema' && value.target !== 'typescript' && value.target !== 'stats' && value.target !== 'patch')
    || typeof value.comparison !== 'string'
    || (value.target === 'patch' && !value.comparison.trim())
    || typeof value.rootName !== 'string' || value.rootName.length > 128) {
    throw new BoundedTextTaskError('validation', JSON_CODE_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, JSON_CODE_MAX_INPUT_BYTES)
    || exceedsUtf8ByteLimit(value.comparison, JSON_CODE_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', JSON_CODE_ERROR_MESSAGES['input-limit']);
  }
  return { source: value.source, comparison: value.comparison, target: value.target, rootName: value.rootName };
}
