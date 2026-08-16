import { HMAC_ALGORITHMS, HMAC_KEY_ENCODINGS, HMAC_OUTPUT_ENCODINGS, type HmacTask } from './hmac-generator.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const HMAC_MAX_MESSAGE_BYTES = 1024 * 1024;
export const HMAC_MAX_KEY_INPUT_BYTES = 8 * 1024;
export const HMAC_MAX_OUTPUT_BYTES = 1024;
export const HMAC_TIMEOUT_MS = 5_000;
export const HMAC_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Select supported HMAC and encoding options.',
  'input-limit': 'HMAC input is limited to 1 MiB of message text and 8 KiB of encoded key text.',
  'output-limit': 'HMAC output exceeded its fixed bound.',
  'processing': 'The HMAC could not be computed. Check the selected key representation.',
};

export function parseHmacTask(value: unknown): HmacTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'algorithm,key,keyEncoding,message,outputEncoding'
    || typeof value.message !== 'string'
    || typeof value.key !== 'string'
    || !HMAC_ALGORITHMS.includes(value.algorithm as HmacTask['algorithm'])
    || !HMAC_KEY_ENCODINGS.includes(value.keyEncoding as HmacTask['keyEncoding'])
    || !HMAC_OUTPUT_ENCODINGS.includes(value.outputEncoding as HmacTask['outputEncoding'])) {
    throw new BoundedTextTaskError('validation', HMAC_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.message, HMAC_MAX_MESSAGE_BYTES)
    || exceedsUtf8ByteLimit(value.key, HMAC_MAX_KEY_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', HMAC_ERROR_MESSAGES['input-limit']);
  }
  return value as unknown as HmacTask;
}
