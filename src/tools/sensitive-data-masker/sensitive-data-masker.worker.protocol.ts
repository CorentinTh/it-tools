import { SANITIZER_MODES, type SanitizerOptions } from './sensitive-data-masker.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const SANITIZER_LIVE_MAX_BYTES = 64 * 1024;
export const SANITIZER_MAX_INPUT_BYTES = 4 * 1024 * 1024;
export const SANITIZER_MAX_OUTPUT_BYTES = 6 * 1024 * 1024;
export const SANITIZER_TASK_TIMEOUT_MS = 10_000;

export const SANITIZER_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter valid text, JSON, or HAR content and select a supported mode.',
  'input-limit': `Sanitizer input is limited to ${SANITIZER_MAX_INPUT_BYTES.toLocaleString('en-US')} UTF-8 bytes.`,
  'output-limit': `Sanitized output is limited to ${SANITIZER_MAX_OUTPUT_BYTES.toLocaleString('en-US')} UTF-8 bytes.`,
  'processing': 'The content could not be sanitized. Check the selected format and document structure.',
};

export function parseSanitizerTask(value: unknown): SanitizerOptions {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'maskEmails,maskIpAddresses,mode,source'
    || typeof value.source !== 'string'
    || value.source.trim() === ''
    || typeof value.mode !== 'string'
    || !SANITIZER_MODES.includes(value.mode as SanitizerOptions['mode'])
    || typeof value.maskEmails !== 'boolean'
    || typeof value.maskIpAddresses !== 'boolean'
  ) {
    throw new BoundedTextTaskError('validation', SANITIZER_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, SANITIZER_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', SANITIZER_ERROR_MESSAGES['input-limit']);
  }
  return {
    source: value.source,
    mode: value.mode as SanitizerOptions['mode'],
    maskEmails: value.maskEmails,
    maskIpAddresses: value.maskIpAddresses,
  };
}
