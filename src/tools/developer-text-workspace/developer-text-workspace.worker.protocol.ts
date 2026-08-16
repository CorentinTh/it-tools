import type { DeveloperTextOperation, DeveloperTextTask } from './developer-text-workspace.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const DEVELOPER_TEXT_MAX_INPUT_BYTES = 1024 * 1024;
export const DEVELOPER_TEXT_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const DEVELOPER_TEXT_TIMEOUT_MS = 5_000;
export const DEVELOPER_TEXT_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter bounded text and valid options for the selected operation.',
  'input-limit': 'Text input is limited to 1 MiB of UTF-8 text.',
  'output-limit': 'Text output is limited to 2 MiB of UTF-8 text.',
  'processing': 'The text transformation failed. Check the selected mode and its inputs.',
};

function isOperation(value: unknown): value is DeveloperTextOperation {
  return value === 'stack-trace' || value === 'smart-replace' || value === 'folder-tree' || value === 'markdown-toc';
}

export function parseDeveloperTextTask(value: unknown): DeveloperTextTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'caseSensitive,find,operation,regex,replacement,source'
    || !isOperation(value.operation)
    || typeof value.source !== 'string'
    || !value.source.trim()
    || typeof value.find !== 'string'
    || typeof value.replacement !== 'string'
    || typeof value.regex !== 'boolean'
    || typeof value.caseSensitive !== 'boolean'
    || value.find.length > 256
    || value.replacement.length > 65_536
    || (value.operation === 'smart-replace' && !value.find)) {
    throw new BoundedTextTaskError('validation', DEVELOPER_TEXT_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, DEVELOPER_TEXT_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', DEVELOPER_TEXT_ERROR_MESSAGES['input-limit']);
  }
  return {
    operation: value.operation,
    source: value.source,
    find: value.find,
    replacement: value.replacement,
    regex: value.regex,
    caseSensitive: value.caseSensitive,
  };
}
