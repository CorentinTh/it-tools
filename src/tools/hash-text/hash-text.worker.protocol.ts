import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const HASH_TEXT_ALGORITHMS = [
  'MD5',
  'SHA1',
  'SHA224',
  'SHA256',
  'SHA384',
  'SHA512',
  'SHA3',
  'RIPEMD160',
] as const;
export const HASH_TEXT_ENCODINGS = ['Bin', 'Hex', 'Base64', 'Base64url'] as const;

export const HASH_TEXT_LIVE_MAX_BYTES = 16 * 1024;
export const HASH_TEXT_MAX_INPUT_BYTES = 1024 * 1024;
export const HASH_TEXT_MAX_OUTPUT_BYTES = 8 * 1024;
export const HASH_TEXT_TASK_TIMEOUT_MS = 5_000;

export type HashTextAlgorithm = typeof HASH_TEXT_ALGORITHMS[number];
export type HashTextEncoding = typeof HASH_TEXT_ENCODINGS[number];
export type HashTextDigests = Record<HashTextAlgorithm, string>;

export interface HashTextTask {
  encoding: HashTextEncoding
  source: string
}

export const HASH_TEXT_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Select a supported digest encoding.',
  'input-limit': `Text hashing input is limited to ${HASH_TEXT_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `Text hashing output is limited to ${HASH_TEXT_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'processing': 'The text could not be hashed.',
};

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

export function parseHashTextTask(value: unknown): HashTextTask {
  if (
    !isUnknownRecord(value)
    || !hasExactKeys(value, ['encoding', 'source'])
    || typeof value.source !== 'string'
    || typeof value.encoding !== 'string'
    || !HASH_TEXT_ENCODINGS.includes(value.encoding as HashTextEncoding)
  ) {
    throw new BoundedTextTaskError('validation', HASH_TEXT_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, HASH_TEXT_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', HASH_TEXT_ERROR_MESSAGES['input-limit']);
  }
  return { encoding: value.encoding as HashTextEncoding, source: value.source };
}

export function parseHashTextDigestPayload(value: string): HashTextDigests | undefined {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isUnknownRecord(parsed) || !hasExactKeys(parsed, HASH_TEXT_ALGORITHMS)) {
      return undefined;
    }
    const entries: [HashTextAlgorithm, string][] = [];
    for (const algorithm of HASH_TEXT_ALGORITHMS) {
      const digest = parsed[algorithm];
      if (typeof digest !== 'string' || digest.length === 0 || digest.length > 512) {
        return undefined;
      }
      entries.push([algorithm, digest]);
    }
    return Object.fromEntries(entries) as HashTextDigests;
  }
  catch {
    return undefined;
  }
}
