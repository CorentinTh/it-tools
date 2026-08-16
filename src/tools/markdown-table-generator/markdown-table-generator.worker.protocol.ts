import type { MarkdownTableTask, TableDelimiter } from './markdown-table-generator.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const MARKDOWN_TABLE_MAX_INPUT_BYTES = 512 * 1024;
export const MARKDOWN_TABLE_MAX_OUTPUT_BYTES = 1024 * 1024;
export const MARKDOWN_TABLE_TIMEOUT_MS = 5_000;
export const MARKDOWN_TABLE_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter bounded CSV/TSV data and valid table options.',
  'input-limit': 'Table input is limited to 512 KiB of UTF-8 text.',
  'output-limit': 'Markdown output is limited to 1 MiB of UTF-8 text.',
  'processing': 'Table generation failed. Check quoting, delimiter, dimensions, and alignment options.',
};

function isDelimiter(value: unknown): value is TableDelimiter {
  return value === 'auto' || value === 'comma' || value === 'tab';
}

export function parseMarkdownTableTask(value: unknown): MarkdownTableTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'alignmentPattern,delimiter,firstRowHeader,source,trimCells'
    || typeof value.source !== 'string'
    || !value.source.trim()
    || !isDelimiter(value.delimiter)
    || typeof value.firstRowHeader !== 'boolean'
    || typeof value.trimCells !== 'boolean'
    || typeof value.alignmentPattern !== 'string'
    || value.alignmentPattern.length > 1024) {
    throw new BoundedTextTaskError('validation', MARKDOWN_TABLE_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, MARKDOWN_TABLE_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', MARKDOWN_TABLE_ERROR_MESSAGES['input-limit']);
  }
  return value as unknown as MarkdownTableTask;
}
