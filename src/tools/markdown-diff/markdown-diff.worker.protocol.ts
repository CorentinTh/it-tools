import type { MarkdownDiffGranularity, MarkdownDiffTask } from './markdown-diff.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const MARKDOWN_DIFF_MAX_SIDE_BYTES = 256 * 1024;
export const MARKDOWN_DIFF_MAX_OUTPUT_BYTES = 1024 * 1024;
export const MARKDOWN_DIFF_TIMEOUT_MS = 5_000;

export const MARKDOWN_DIFF_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter two Markdown documents and a valid comparison granularity.',
  'input-limit': 'Each Markdown document is limited to 256 KiB of UTF-8 text.',
  'output-limit': 'The Markdown diff report is limited to 1 MiB of UTF-8 text.',
  'processing': 'Markdown comparison exceeded its line, token, or alignment-work limit.',
};

function isGranularity(value: unknown): value is MarkdownDiffGranularity {
  return value === 'line' || value === 'word';
}

export function parseMarkdownDiffTask(value: unknown): MarkdownDiffTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'granularity,left,right'
    || typeof value.left !== 'string'
    || typeof value.right !== 'string'
    || (!value.left && !value.right)
    || !isGranularity(value.granularity)) {
    throw new BoundedTextTaskError('validation', MARKDOWN_DIFF_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.left, MARKDOWN_DIFF_MAX_SIDE_BYTES)
    || exceedsUtf8ByteLimit(value.right, MARKDOWN_DIFF_MAX_SIDE_BYTES)) {
    throw new BoundedTextTaskError('input-limit', MARKDOWN_DIFF_ERROR_MESSAGES['input-limit']);
  }
  return value as unknown as MarkdownDiffTask;
}
