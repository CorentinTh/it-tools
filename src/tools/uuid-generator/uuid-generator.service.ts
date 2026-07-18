import { v1 as createUuidV1 } from 'uuid';
import type { V1Options } from 'uuid';
import type { RandomValuesProvider } from '@/utils/secure-random';

const MAX_UUIDS_PER_MILLISECOND = 10_000;
const CLOCK_SEQUENCE_MASK = 0x3FFF;

const webCryptoRandomValues: RandomValuesProvider = values => globalThis.crypto.getRandomValues(values);

type UuidV1Factory = (options: V1Options) => string;

export interface GenerateUuidV1BatchOptions {
  count: number
  getRandomValues?: RandomValuesProvider
  now?: () => number
  uuidV1Factory?: UuidV1Factory
}

/**
 * Generates a UUID v1 batch from one Web Crypto seed. UUID v1 embeds its
 * timestamp and is an identifier, not a secret or authentication token.
 */
export function generateUuidV1Batch({
  count,
  getRandomValues = webCryptoRandomValues,
  now = Date.now,
  uuidV1Factory = options => createUuidV1(options),
}: GenerateUuidV1BatchOptions): string[] {
  if (!Number.isSafeInteger(count) || count < 0 || count > MAX_UUIDS_PER_MILLISECOND) {
    throw new RangeError(`Count must be a safe integer between 0 and ${MAX_UUIDS_PER_MILLISECOND}`);
  }

  if (count === 0) {
    return [];
  }

  const seed = new Uint32Array(2);
  getRandomValues(seed);

  // RFC 4122 section 4.5: set the multicast bit when the node is random rather
  // than an IEEE 802 MAC address. The remaining node and clock-sequence bits
  // come from non-overlapping parts of the Web Crypto seed.
  const node = [
    (seed[0] >>> 24) | 0x01,
    (seed[0] >>> 16) & 0xFF,
    (seed[0] >>> 8) & 0xFF,
    seed[0] & 0xFF,
    seed[1] >>> 24,
    (seed[1] >>> 16) & 0xFF,
  ];
  const clockseq = seed[1] & CLOCK_SEQUENCE_MASK;
  const msecs = now();

  return Array.from({ length: count }, (_unused, nsecs) => uuidV1Factory({
    clockseq,
    msecs,
    node,
    nsecs,
  }));
}
