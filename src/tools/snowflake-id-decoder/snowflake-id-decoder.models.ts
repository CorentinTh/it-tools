export interface SnowflakeFieldSpec {
  label: string
  bits: number
}

export interface SnowflakeLayout {
  /** Human-readable bit budget, shown under the results. */
  label: string
  timestampBits: number
  /** Middle fields in MSB→LSB order (between timestamp and sequence). */
  fields: SnowflakeFieldSpec[]
  sequenceBits: number
}

const STANDARD_64_BIT: SnowflakeLayout = {
  label: '41-bit timestamp / 5-bit datacenter / 5-bit worker / 12-bit sequence',
  timestampBits: 42,
  fields: [
    { label: 'Datacenter id', bits: 5 },
    { label: 'Worker id', bits: 5 },
  ],
  sequenceBits: 12,
};

export interface SnowflakePlatform {
  key: string
  label: string
  epoch: number
  layout: SnowflakeLayout
}

/** Well-known Snowflake variants. Twitter uses a custom 41-bit timestamp;
 *  Discord shares the Twitter bit layout but names the middle fields
 *  worker/process; Instagram shards with a 13-bit logical shard and a
 *  10-bit sequence; Mastodon only packs 48 bits of ms timestamp plus a
 *  16-bit sequence. */
export const SNOWFLAKE_PLATFORMS: SnowflakePlatform[] = [
  {
    key: 'twitter',
    label: 'Twitter / X',
    epoch: 1288834974657,
    layout: STANDARD_64_BIT,
  },
  {
    key: 'discord',
    label: 'Discord',
    epoch: 1420070400000,
    layout: {
      label: '42-bit timestamp / 5-bit worker / 5-bit process / 12-bit sequence',
      timestampBits: 42,
      fields: [
        { label: 'Worker id', bits: 5 },
        { label: 'Process id', bits: 5 },
      ],
      sequenceBits: 12,
    },
  },
  {
    key: 'instagram',
    label: 'Instagram',
    epoch: 1314220021721,
    layout: {
      label: '41-bit timestamp / 13-bit shard / 10-bit sequence',
      timestampBits: 41,
      fields: [
        { label: 'Shard id', bits: 13 },
      ],
      sequenceBits: 10,
    },
  },
  {
    key: 'mastodon',
    label: 'Mastodon',
    epoch: 0,
    layout: {
      label: '48-bit timestamp / 16-bit sequence',
      timestampBits: 48,
      fields: [],
      sequenceBits: 16,
    },
  },
  {
    key: 'custom',
    label: 'Custom epoch',
    epoch: 0,
    layout: STANDARD_64_BIT,
  },
];

export interface SnowflakeField {
  label: string
  value: number
}

export interface SnowflakeDecoded {
  /** Millisecond Unix timestamp encoded in the id. */
  timestamp: number
  isoDate: string
  layoutLabel: string
  fields: SnowflakeField[]
  sequence: number
}

function parseSnowflakeId(id: string): bigint {
  const trimmed = id.trim();
  if (!/^\d{1,20}$/.test(trimmed)) {
    throw new Error('A snowflake id is a positive integer');
  }
  return BigInt(trimmed);
}

export function decodeSnowflake(id: string, platform: SnowflakePlatform, epoch: number): SnowflakeDecoded {
  const value = parseSnowflakeId(id);
  const { layout } = platform;

  const middleBits = layout.fields.reduce((sum, field) => sum + field.bits, 0);
  const timestampShift = BigInt(layout.sequenceBits + middleBits);
  const timestampMask = (1n << BigInt(layout.timestampBits)) - 1n;
  const timestamp = Number((value >> timestampShift) & timestampMask) + epoch;

  let cursor = timestampShift;
  const fields = layout.fields.map((field) => {
    cursor -= BigInt(field.bits);
    const mask = (1n << BigInt(field.bits)) - 1n;
    return { label: field.label, value: Number((value >> cursor) & mask) };
  });

  const sequenceMask = (1n << BigInt(layout.sequenceBits)) - 1n;
  const sequence = Number(value & sequenceMask);

  const date = new Date(timestamp);
  return {
    timestamp,
    isoDate: `${date.toISOString().replace('T', ' ').replace(/\..+/, '')} UTC`,
    layoutLabel: layout.label,
    fields,
    sequence,
  };
}
