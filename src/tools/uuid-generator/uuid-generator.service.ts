import { v1 as createUuidV1 } from 'uuid';
import type { Version1Options } from 'uuid';
import type { RandomValuesProvider } from '@/utils/secure-random';

const MAX_UUIDS_PER_MILLISECOND = 10_000;
const CLOCK_SEQUENCE_MASK = 0x3FFF;
const UUID_EPOCH_OFFSET_MS = 12_219_292_800_000n;
const ECMASCRIPT_DATE_LIMIT_MS = 8_640_000_000_000_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const webCryptoRandomValues: RandomValuesProvider = values => globalThis.crypto.getRandomValues(values);

type UuidV1Factory = (options: Version1Options) => string;

export interface GenerateUuidV1BatchOptions {
  count: number
  getRandomValues?: RandomValuesProvider
  now?: () => number
  uuidV1Factory?: UuidV1Factory
}

export type ModernIdentifierKind = 'uuid' | 'object-id' | 'snowflake';

export interface IdentifierInspection {
  kind: ModernIdentifierKind
  canonical: string
  details: Array<{ label: string; value: string }>
}

function validateCount(count: number): void {
  if (!Number.isSafeInteger(count) || count < 0 || count > MAX_UUIDS_PER_MILLISECOND) {
    throw new RangeError(`Count must be a safe integer between 0 and ${MAX_UUIDS_PER_MILLISECOND}`);
  }
}

function randomWords(count: number, getRandomValues: RandomValuesProvider): Uint32Array {
  const values = new Uint32Array(count * 4);
  getRandomValues(values);
  return values;
}

function randomByte(words: Uint32Array, byteIndex: number): number {
  const word = words[Math.floor(byteIndex / 4)];
  return (word >>> ((byteIndex % 4) * 8)) & 0xFF;
}

function formatUuidBytes(bytes: Uint8Array): string {
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function generateUuidV7Batch({
  count,
  getRandomValues = webCryptoRandomValues,
  now = Date.now,
}: Omit<GenerateUuidV1BatchOptions, 'uuidV1Factory'>): string[] {
  validateCount(count);
  if (count === 0) {
    return [];
  }
  const timestamp = now();
  if (!Number.isSafeInteger(timestamp) || timestamp < 0 || timestamp > 0xFFFF_FFFF_FFFF) {
    throw new RangeError('Timestamp must fit the UUID v7 48-bit Unix millisecond field.');
  }
  const random = randomWords(count, getRandomValues);
  return Array.from({ length: count }, (_, index) => {
    const bytes = new Uint8Array(16);
    let remaining = BigInt(timestamp);
    for (let byteIndex = 5; byteIndex >= 0; byteIndex -= 1) {
      bytes[byteIndex] = Number(remaining & 0xFFn);
      remaining >>= 8n;
    }
    for (let byteIndex = 6; byteIndex < 16; byteIndex += 1) {
      bytes[byteIndex] = randomByte(random, index * 16 + byteIndex);
    }
    bytes[6] = (bytes[6] & 0x0F) | 0x70;
    bytes[8] = (bytes[8] & 0x3F) | 0x80;
    return formatUuidBytes(bytes);
  });
}

export function generateUuidV6Batch({
  count,
  getRandomValues = webCryptoRandomValues,
  now = Date.now,
}: Omit<GenerateUuidV1BatchOptions, 'uuidV1Factory'>): string[] {
  validateCount(count);
  if (count === 0) {
    return [];
  }
  const milliseconds = now();
  if (!Number.isSafeInteger(milliseconds)) {
    throw new RangeError('Timestamp must be a safe integer.');
  }
  const random = randomWords(count, getRandomValues);
  return Array.from({ length: count }, (_, index) => {
    const timestamp = (BigInt(milliseconds) + UUID_EPOCH_OFFSET_MS) * 10_000n + BigInt(index);
    const high = timestamp >> 12n;
    const low = Number(timestamp & 0xFFFn);
    const bytes = new Uint8Array(16);
    for (let byteIndex = 5; byteIndex >= 0; byteIndex -= 1) {
      bytes[byteIndex] = Number((high >> BigInt((5 - byteIndex) * 8)) & 0xFFn);
    }
    bytes[6] = 0x60 | (low >>> 8);
    bytes[7] = low & 0xFF;
    for (let byteIndex = 8; byteIndex < 16; byteIndex += 1) {
      bytes[byteIndex] = randomByte(random, index * 16 + byteIndex);
    }
    bytes[8] = (bytes[8] & 0x3F) | 0x80;
    bytes[10] |= 0x01;
    return formatUuidBytes(bytes);
  });
}

export function normalizeUuid(value: string): string {
  const stripped = value.trim().replace(/^urn:uuid:/i, '').replace(/^\{(.+)\}$/, '$1').replace(/-/g, '').toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(stripped)) {
    throw new Error('Enter a UUID as 32 hexadecimal digits, with optional hyphens, braces, or urn:uuid prefix.');
  }
  return `${stripped.slice(0, 8)}-${stripped.slice(8, 12)}-${stripped.slice(12, 16)}-${stripped.slice(16, 20)}-${stripped.slice(20)}`;
}

function uuidTimestamp(canonical: string, version: number): string | undefined {
  const compact = canonical.replace(/-/g, '');
  let milliseconds: bigint | undefined;
  if (version === 7) {
    milliseconds = BigInt(`0x${compact.slice(0, 12)}`);
  }
  else if (version === 6) {
    const timestamp = (BigInt(`0x${compact.slice(0, 12)}`) << 12n) | BigInt(`0x${compact.slice(13, 16)}`);
    milliseconds = timestamp / 10_000n - UUID_EPOCH_OFFSET_MS;
  }
  else if (version === 1) {
    const timestamp = (BigInt(`0x${compact.slice(13, 16)}`) << 48n)
      | (BigInt(`0x${compact.slice(8, 12)}`) << 32n)
      | BigInt(`0x${compact.slice(0, 8)}`);
    milliseconds = timestamp / 10_000n - UUID_EPOCH_OFFSET_MS;
  }
  if (milliseconds === undefined) {
    return undefined;
  }
  const numeric = Number(milliseconds);
  return Number.isSafeInteger(numeric) ? new Date(numeric).toISOString() : undefined;
}

export function inspectUuid(value: string): IdentifierInspection {
  const canonical = normalizeUuid(value);
  if (!UUID_PATTERN.test(canonical)) {
    throw new Error('The UUID is invalid.');
  }
  const compact = canonical.replace(/-/g, '');
  const version = Number.parseInt(compact[12], 16);
  const variantBits = Number.parseInt(compact[16], 16);
  const variant = (variantBits & 0x8) === 0
    ? 'NCS'
    : (variantBits & 0xC) === 0x8
        ? 'RFC 4122 / RFC 9562'
        : (variantBits & 0xE) === 0xC ? 'Microsoft' : 'Future';
  const details = [
    { label: 'Version', value: String(version) },
    { label: 'Variant', value: variant },
  ];
  const timestamp = uuidTimestamp(canonical, version);
  if (timestamp) {
    details.push({ label: 'Embedded timestamp', value: timestamp });
  }
  return { kind: 'uuid', canonical, details };
}

export function inspectObjectId(value: string): IdentifierInspection {
  const canonical = value.trim().toLowerCase();
  if (!/^[0-9a-f]{24}$/.test(canonical)) {
    throw new Error('A Mongo ObjectID must contain exactly 24 hexadecimal digits.');
  }
  const seconds = Number.parseInt(canonical.slice(0, 8), 16);
  return {
    kind: 'object-id',
    canonical,
    details: [
      { label: 'Timestamp', value: new Date(seconds * 1_000).toISOString() },
      { label: 'Process/random bytes', value: canonical.slice(8, 18) },
      { label: 'Counter', value: String(Number.parseInt(canonical.slice(18), 16)) },
    ],
  };
}

export function inspectSnowflake(value: string, epochMilliseconds: string): IdentifierInspection {
  if (!/^\d+$/.test(value.trim()) || !/^-?\d+$/.test(epochMilliseconds.trim())) {
    throw new Error('Snowflake ID and epoch must be base-10 integers.');
  }
  const identifier = BigInt(value.trim());
  const epoch = BigInt(epochMilliseconds.trim());
  if (identifier < 0n || identifier > 0x7FFF_FFFF_FFFF_FFFFn) {
    throw new Error('Snowflake ID must fit a non-negative signed 64-bit integer.');
  }
  const timestamp = (identifier >> 22n) + epoch;
  const numericTimestamp = Number(timestamp);
  if (!Number.isSafeInteger(numericTimestamp) || Math.abs(numericTimestamp) > ECMASCRIPT_DATE_LIMIT_MS) {
    throw new TypeError('Decoded timestamp is outside the JavaScript date range.');
  }
  return {
    kind: 'snowflake',
    canonical: identifier.toString(),
    details: [
      { label: 'Timestamp', value: new Date(numericTimestamp).toISOString() },
      { label: 'Worker ID', value: String((identifier >> 17n) & 0x1Fn) },
      { label: 'Process ID', value: String((identifier >> 12n) & 0x1Fn) },
      { label: 'Sequence', value: String(identifier & 0xFFFn) },
    ],
  };
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
  validateCount(count);

  if (count === 0) {
    return [];
  }

  const seed = new Uint32Array(2);
  getRandomValues(seed);

  // RFC 4122 section 4.5: set the multicast bit when the node is random rather
  // than an IEEE 802 MAC address. The remaining node and clock-sequence bits
  // come from non-overlapping parts of the Web Crypto seed.
  const node = new Uint8Array([
    (seed[0] >>> 24) | 0x01,
    (seed[0] >>> 16) & 0xFF,
    (seed[0] >>> 8) & 0xFF,
    seed[0] & 0xFF,
    seed[1] >>> 24,
    (seed[1] >>> 16) & 0xFF,
  ]);
  const clockseq = seed[1] & CLOCK_SEQUENCE_MASK;
  const msecs = now();

  return Array.from({ length: count }, (_unused, nsecs) => uuidV1Factory({
    clockseq,
    msecs,
    node,
    nsecs,
  }));
}
