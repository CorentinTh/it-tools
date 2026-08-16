import type { ListComparisonMode, ListComparisonTask } from './list-comparison.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const LIST_COMPARISON_MAX_SIDE_BYTES = 1024 * 1024;
export const LIST_COMPARISON_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const LIST_COMPARISON_TIMEOUT_MS = 6_000;
export const LIST_COMPARISON_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter two lists and valid comparison options.',
  'input-limit': 'Each list is limited to 1 MiB of UTF-8 text.',
  'output-limit': 'The comparison report is limited to 2 MiB of UTF-8 text.',
  'processing': 'List comparison failed. Check the line counts and ordered-alignment limit.',
};

function isMode(value: unknown): value is ListComparisonMode {
  return value === 'set' || value === 'multiset' || value === 'ordered';
}

export function parseListComparisonTask(value: unknown): ListComparisonTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'ignoreCase,ignoreEmpty,left,mode,right,trimItems'
    || typeof value.left !== 'string'
    || typeof value.right !== 'string'
    || (!value.left && !value.right)
    || !isMode(value.mode)
    || typeof value.trimItems !== 'boolean'
    || typeof value.ignoreCase !== 'boolean'
    || typeof value.ignoreEmpty !== 'boolean') {
    throw new BoundedTextTaskError('validation', LIST_COMPARISON_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.left, LIST_COMPARISON_MAX_SIDE_BYTES)
    || exceedsUtf8ByteLimit(value.right, LIST_COMPARISON_MAX_SIDE_BYTES)) {
    throw new BoundedTextTaskError('input-limit', LIST_COMPARISON_ERROR_MESSAGES['input-limit']);
  }
  return value as unknown as ListComparisonTask;
}
