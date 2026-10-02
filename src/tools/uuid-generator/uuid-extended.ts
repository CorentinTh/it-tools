const GREGORIAN_OFFSET_100NS = 122192928000000000n; // 100ns ticks from 1582-10-15 to 1970-01-01

/** Encode a 128-bit BigInt into the standard 8-4-4-4-12 hex layout. */
export { formatUuid };

function formatUuid(value: bigint): string {
  const hex = value.toString(16).padStart(32, '0');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function randomBits(bits: number): bigint {
  const bytes = Math.ceil(bits / 8);
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  let result = 0n;
  for (const byte of array) {
    result = (result << 8n) | BigInt(byte);
  }
  return result & ((1n << BigInt(bits)) - 1n);
}

/** UUIDv6 (RFC 9562): the UUIDv1 60-bit Gregorian timestamp reordered most-
 *  significant first so lexicographic order equals creation order, plus a
 *  random clock sequence and node.
 *
 *  Layout: time_high(32) time_mid(16) ver(4) time_low(12) var(2) clk(14) node(48). */
export function generateUuidV6(now: number = Date.now()): string {
  const ticks = (BigInt(now) * 10000n) + GREGORIAN_OFFSET_100NS;
  const timeHigh = (ticks >> 28n) & 0xFFFFFFFFn;
  const timeMid = (ticks >> 12n) & 0xFFFFn;
  const timeLow = ticks & 0xFFFn;
  const clockSeq = randomBits(14);

  const value = (timeHigh << 96n)
    | (timeMid << 80n)
    | (0b0110n << 76n)
    | (timeLow << 64n)
    | (0b10n << 62n)
    | (clockSeq << 48n)
    | randomBits(48);

  return formatUuid(value);
}

/** UUIDv7 (RFC 9562): 48-bit Unix millisecond timestamp prefix followed by
 *  random bits, giving sortable-by-creation-time unique ids.
 *
 *  Layout: unix_ts_ms(48) ver(4) rand_a(12) var(2) rand_b(62). */
export function generateUuidV7(now: number = Date.now()): string {
  const value = ((BigInt(now) & 0xFFFFFFFFFFFFn) << 80n)
    | (0b0111n << 76n)
    | (randomBits(12) << 64n)
    | (0b10n << 62n)
    | randomBits(62);

  return formatUuid(value);
}
