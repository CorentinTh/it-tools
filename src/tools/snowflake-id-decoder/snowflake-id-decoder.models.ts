export interface SnowflakePlatform {
  key: string
  label: string
  epoch: number
}

/** Well-known Snowflake epochs. Twitter uses a custom 41-bit timestamp; the
 *  others use the standard 64-bit layout with a platform-specific epoch. */
export const SNOWFLAKE_PLATFORMS: SnowflakePlatform[] = [
  { key: 'twitter', label: 'Twitter / X', epoch: 1288834974657 },
  { key: 'discord', label: 'Discord', epoch: 1420070400000 },
  { key: 'instagram', label: 'Instagram', epoch: 1314220021721 },
  { key: 'mastodon', label: 'Mastodon', epoch: 0 },
  { key: 'custom', label: 'Custom epoch', epoch: 0 },
];

export interface SnowflakeDecoded {
  /** Millisecond Unix timestamp encoded in the id. */
  timestamp: number
  isoDate: string
  /** Datacenter / worker / sequence when the platform uses the standard layout. */
  workerId: number
  datacenterId: number
  sequence: number
}

function parseSnowflakeId(id: string): bigint {
  const trimmed = id.trim();
  if (!/^\d{1,20}$/.test(trimmed)) {
    throw new Error('A snowflake id is a positive integer');
  }
  return BigInt(trimmed);
}

/** Standard 64-bit Snowflake: 1 unused sign bit, 41-bit ms timestamp,
 *  5-bit datacenter, 5-bit worker, 12-bit sequence. */
export function decodeSnowflake(id: string, epoch: number): SnowflakeDecoded {
  const value = parseSnowflakeId(id);
  const timestamp = Number((value >> 22n) & 0x1FFFFFFFFFFFFn) + epoch;
  const datacenterId = Number((value >> 17n) & 0x1Fn);
  const workerId = Number((value >> 12n) & 0x1Fn);
  const sequence = Number(value & 0xFFFn);

  const date = new Date(timestamp);
  return {
    timestamp,
    isoDate: `${date.toISOString().replace('T', ' ').replace(/\..+/, '')} UTC`,
    workerId,
    datacenterId,
    sequence,
  };
}
