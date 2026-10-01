export interface Ipv6Info {
  /** Fully expanded lowercase form, e.g. 2001:0db8:0000:...:0000. */
  expanded: string
  /** RFC 5952 compressed form, e.g. 2001:db8::1. */
  compressed: string
  /** `prefix` as typed, normalized. */
  network: string
  prefix: number
  type: string
  scope: string
  totalAddresses: string
  firstAddress: string
  lastAddress: string
  mask: string
}

const IPV6_HEX_RE = /^[0-9a-fA-F]{1,4}$/;

/** Expand an address (without prefix) to the full 39-char lowercase form. */
export function expandIpv6(address: string): string {
  let value = address.trim().toLowerCase();
  if (value.includes('%')) {
    value = value.slice(0, value.indexOf('%')); // drop zone id
  }

  const parts = value.split('::');
  if (parts.length > 2) {
    throw new Error(`Invalid IPv6 address: ${address}`);
  }

  const head = parts[0] === '' ? [] : parts[0]!.split(':');
  const tail = parts.length === 2 ? (parts[1] === '' ? [] : parts[1]!.split(':')) : [];
  const missing = 8 - head.length - tail.length;
  if (parts.length === 1 && head.length !== 8) {
    throw new Error(`Invalid IPv6 address: ${address}`);
  }
  if (missing < 0) {
    throw new Error(`Invalid IPv6 address: ${address}`);
  }
  const groups = [...head, ...Array.from({ length: parts.length === 2 ? missing : 0 }, () => '0'), ...tail];
  if (groups.length !== 8 || !groups.every(group => IPV6_HEX_RE.test(group))) {
    throw new Error(`Invalid IPv6 address: ${address}`);
  }
  return groups.map(group => group.padStart(4, '0')).join(':');
}

/** RFC 5952 compression: longest :: run, leftmost on tie, drop leading zeros. */
export function compressIpv6(expanded: string): string {
  const groups = expanded.split(':');
  const best = { start: -1, length: 0 };
  let currentStart = -1;
  let currentLength = 0;
  groups.forEach((group, index) => {
    if (group === '0000') {
      if (currentStart === -1) {
        currentStart = index;
      }
      currentLength++;
      if (currentLength > best.length) {
        best.start = currentStart;
        best.length = currentLength;
      }
    }
    else {
      currentStart = -1;
      currentLength = 0;
    }
  });

  const trimmed = groups.map(group => group.replace(/^0+(?=.)/, ''));
  if (best.length < 2) {
    return trimmed.join(':');
  }
  const head = trimmed.slice(0, best.start).join(':');
  const tail = trimmed.slice(best.start + best.length).join(':');
  return `${head}::${tail}`;
}

function ipv6ToBigInt(expanded: string): bigint {
  return BigInt(`0x${expanded.replace(/:/g, '')}`);
}

function bigIntToIpv6(value: bigint): string {
  const hex = value.toString(16).padStart(32, '0');
  return (hex.match(/.{4}/g) ?? []).join(':');
}

function parseIpv6Cidr(input: string): { address: string; prefix: number } {
  const trimmed = input.trim();
  const [address, prefixRaw] = trimmed.split('/');
  const prefix = prefixRaw === undefined ? 128 : Number(prefixRaw);
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 128) {
    throw new Error(`Invalid prefix length: ${prefixRaw ?? ''}`);
  }
  return { address: expandIpv6(address ?? ''), prefix };
}

function describeType(expanded: string): { type: string; scope: string } {
  const value = ipv6ToBigInt(expanded);
  const first16 = Number(value >> 112n);

  if (value === 0n) {
    return { type: 'Unspecified', scope: 'this host' };
  }
  if (value === 1n) {
    return { type: 'Loopback', scope: 'this host' };
  }
  if (first16 === 0xFE80) {
    return { type: 'Link-local unicast (fe80::/10)', scope: 'link' };
  }
  if (first16 >= 0xFC00 && first16 <= 0xFDFF) {
    return { type: 'Unique local (ULA, fc00::/7)', scope: 'organization' };
  }
  if (first16 === 0xFFFF) {
    return { type: 'Multicast', scope: 'well-known' };
  }
  if (first16 >= 0xFF00 && first16 <= 0xFFFF) {
    return { type: 'Multicast (ff00::/8)', scope: 'assigned' };
  }
  if (first16 === 0x2002) {
    return { type: '6to4 (2002::/16)', scope: 'global' };
  }
  if (value >> 96n === 0x20010DB8n) {
    return { type: 'Documentation (2001:db8::/32)', scope: 'global' };
  }
  if (first16 >= 0x2000 && first16 <= 0x3FFF) {
    return { type: 'Global unicast (2000::/3)', scope: 'global' };
  }
  return { type: 'Reserved or other', scope: 'n/a' };
}

export function describeIpv6(cidr: string): Ipv6Info {
  const { address, prefix } = parseIpv6Cidr(cidr);
  const addressValue = ipv6ToBigInt(address);

  const hostBits = 128 - prefix;
  const networkValue = prefix === 0 ? 0n : (addressValue >> BigInt(hostBits)) << BigInt(hostBits);
  const total = hostBits >= 0 ? (1n << BigInt(hostBits)) : 0n;
  const firstValue = networkValue;
  const lastValue = networkValue + total - 1n;

  const maskHostBits = BigInt(hostBits);
  const maskValue = hostBits === 0 ? 0n : ((1n << (128n - maskHostBits)) - 1n) << maskHostBits;

  const { type, scope } = describeType(address);

  return {
    expanded: address,
    compressed: compressIpv6(address),
    network: `${compressIpv6(bigIntToIpv6(networkValue))}/${prefix}`,
    prefix,
    type,
    scope,
    totalAddresses: total.toString(),
    firstAddress: compressIpv6(bigIntToIpv6(firstValue)),
    lastAddress: compressIpv6(bigIntToIpv6(lastValue)),
    mask: compressIpv6(bigIntToIpv6(maskValue)),
  };
}
