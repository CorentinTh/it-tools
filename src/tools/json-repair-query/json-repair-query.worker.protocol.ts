import { type JsonWorkspaceTask } from './json-repair-query.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const JSON_WORKSPACE_MAX_INPUT_BYTES = 1024 * 1024;
export const JSON_WORKSPACE_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const JSON_WORKSPACE_TIMEOUT_MS = 8_000;
export const JSON_WORKSPACE_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter JSON and select Repair or a safe JSONPath query.',
  'input-limit': 'JSON input is limited to 1 MiB of UTF-8 text.',
  'output-limit': 'JSON output is limited to 2 MiB of UTF-8 text.',
  'processing': 'JSON could not be repaired or queried. Check the document and supported query syntax.',
};

export function parseJsonWorkspaceTask(value: unknown): JsonWorkspaceTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'operation,query,source'
    || (value.operation !== 'repair' && value.operation !== 'query' && value.operation !== 'unescape')
    || typeof value.source !== 'string'
    || value.source.trim() === ''
    || typeof value.query !== 'string'
    || value.query.length > 2_000
    || (value.operation === 'query' && !value.query.trim())) {
    throw new BoundedTextTaskError('validation', JSON_WORKSPACE_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, JSON_WORKSPACE_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', JSON_WORKSPACE_ERROR_MESSAGES['input-limit']);
  }
  return { operation: value.operation, query: value.query, source: value.source };
}
