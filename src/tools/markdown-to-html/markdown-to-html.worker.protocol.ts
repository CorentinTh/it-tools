import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const MARKDOWN_LIVE_MAX_BYTES = 64 * 1024;
export const MARKDOWN_MAX_INPUT_BYTES = 1024 * 1024;
export const MARKDOWN_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const MARKDOWN_TASK_TIMEOUT_MS = 8_000;

export interface MarkdownRenderTask {
  source: string
}

export const MARKDOWN_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter Markdown to render.',
  'input-limit': `Markdown rendering is limited to ${MARKDOWN_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `Rendered HTML is limited to ${MARKDOWN_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'processing': 'The Markdown document could not be rendered.',
};

export function parseMarkdownRenderTask(value: unknown): MarkdownRenderTask {
  if (!isUnknownRecord(value) || Object.keys(value).join(',') !== 'source' || typeof value.source !== 'string' || value.source === '') {
    throw new BoundedTextTaskError('validation', MARKDOWN_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, MARKDOWN_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', MARKDOWN_ERROR_MESSAGES['input-limit']);
  }
  return { source: value.source };
}
