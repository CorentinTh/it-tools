export const IPV6_BITS = 128;
export const MAX_IPV6_SUBNET_PREVIEW = 256;
export const IPV6_MAX_VALUE = (1n << 128n) - 1n;

export interface ParsedIpv6Cidr {
  address: bigint
  prefix: number
}

export interface Ipv6Calculation {
  inputAddress: string
  expandedAddress: string
  compressedAddress: string
  prefix: number
  networkAddress: string
  firstAddress: string
  lastAddress: string
  addressCount: bigint
  hostBits: number
}

export interface Ipv6SubnetSplit {
  newPrefix: number
  totalSubnets: bigint
  preview: string[]
  truncated: boolean
}

function parseIpv4Tail(value: string): [number, number] {
  const octets = value.split('.');
  if (octets.length !== 4 || octets.some(octet => !/^\d{1,3}$/.test(octet))) {
    throw new Error('The embedded IPv4 address is invalid.');
  }
  const parsed = octets.map(Number);
  if (parsed.some(octet => octet > 255)) {
    throw new Error('Embedded IPv4 octets must be between 0 and 255.');
  }
  return [parsed[0] * 256 + parsed[1], parsed[2] * 256 + parsed[3]];
}

function replaceIpv4Tail(value: string): string {
  if (!value.includes('.')) {
    return value;
  }
  const lastColon = value.lastIndexOf(':');
  if (lastColon < 0) {
    throw new Error('An IPv6 address must contain hexadecimal groups.');
  }
  const [high, low] = parseIpv4Tail(value.slice(lastColon + 1));
  return `${value.slice(0, lastColon)}:${high.toString(16)}:${low.toString(16)}`;
}

export function parseIpv6Address(source: string): bigint {
  const trimmed = source.trim();
  if (trimmed === '' || trimmed.includes('%') || trimmed.includes('/')) {
    throw new Error('Enter an IPv6 address without a zone identifier or prefix.');
  }
  const value = replaceIpv4Tail(trimmed.toLowerCase());
  const compressionParts = value.split('::');
  if (compressionParts.length > 2) {
    throw new Error('An IPv6 address may contain only one :: compression marker.');
  }

  const left = compressionParts[0] === '' ? [] : compressionParts[0].split(':');
  const right = compressionParts.length === 1 || compressionParts[1] === '' ? [] : compressionParts[1].split(':');
  if ([...left, ...right].some(group => !/^[0-9a-f]{1,4}$/.test(group))) {
    throw new Error('IPv6 groups must contain one to four hexadecimal digits.');
  }

  const missingGroups = IPV6_BITS / 16 - left.length - right.length;
  if (compressionParts.length === 1 && missingGroups !== 0) {
    throw new Error('An uncompressed IPv6 address must contain exactly eight groups.');
  }
  if (compressionParts.length === 2 && missingGroups < 1) {
    throw new Error('The :: marker must replace at least one IPv6 group.');
  }

  const groups = [...left, ...Array.from({ length: missingGroups }, () => '0'), ...right];
  if (groups.length !== 8) {
    throw new Error('An IPv6 address must contain exactly 128 bits.');
  }
  return groups.reduce((result, group) => (result << 16n) | BigInt(`0x${group}`), 0n);
}

export function parseIpv6Cidr(source: string): ParsedIpv6Cidr {
  const parts = source.trim().split('/');
  if (parts.length !== 2 || !/^\d{1,3}$/.test(parts[1])) {
    throw new Error('Enter an IPv6 address with a prefix, for example 2001:db8::/48.');
  }
  const prefix = Number(parts[1]);
  if (prefix < 0 || prefix > IPV6_BITS) {
    throw new Error('IPv6 prefix length must be between 0 and 128.');
  }
  return { address: parseIpv6Address(parts[0]), prefix };
}

export function expandIpv6(value: bigint): string {
  if (value < 0n || value > IPV6_MAX_VALUE) {
    throw new RangeError('IPv6 values must fit in 128 bits.');
  }
  return Array.from({ length: 8 }, (_unused, index) => {
    const shift = BigInt((7 - index) * 16);
    return Number((value >> shift) & 0xFFFFn).toString(16).padStart(4, '0');
  }).join(':');
}

export function compressIpv6(value: bigint): string {
  const groups = expandIpv6(value).split(':').map(group => group.replace(/^0+(?=[0-9a-f])/, ''));
  let bestStart = -1;
  let bestLength = 0;
  for (let index = 0; index < groups.length;) {
    if (groups[index] !== '0') {
      index++;
      continue;
    }
    let end = index;
    while (end < groups.length && groups[end] === '0') {
      end++;
    }
    const length = end - index;
    if (length >= 2 && length > bestLength) {
      bestStart = index;
      bestLength = length;
    }
    index = end;
  }
  if (bestStart < 0) {
    return groups.join(':');
  }
  return `${groups.slice(0, bestStart).join(':')}::${groups.slice(bestStart + bestLength).join(':')}`;
}

export function calculateIpv6(source: string): Ipv6Calculation {
  const { address, prefix } = parseIpv6Cidr(source);
  const hostBits = IPV6_BITS - prefix;
  const hostMask = hostBits === 0 ? 0n : (1n << BigInt(hostBits)) - 1n;
  const network = address & (IPV6_MAX_VALUE ^ hostMask);
  const last = network | hostMask;
  return {
    inputAddress: source.trim().split('/')[0],
    expandedAddress: expandIpv6(address),
    compressedAddress: compressIpv6(address),
    prefix,
    networkAddress: compressIpv6(network),
    firstAddress: compressIpv6(network),
    lastAddress: compressIpv6(last),
    addressCount: 1n << BigInt(hostBits),
    hostBits,
  };
}

export function isIpv6InCidr(addressSource: string, cidrSource: string): boolean {
  const address = parseIpv6Address(addressSource);
  const { address: cidrAddress, prefix } = parseIpv6Cidr(cidrSource);
  const hostBits = IPV6_BITS - prefix;
  const mask = hostBits === IPV6_BITS ? 0n : IPV6_MAX_VALUE ^ ((1n << BigInt(hostBits)) - 1n);
  return (address & mask) === (cidrAddress & mask);
}

export function splitIpv6Cidr(source: string, newPrefix: number): Ipv6SubnetSplit {
  const calculation = calculateIpv6(source);
  if (!Number.isSafeInteger(newPrefix) || newPrefix < calculation.prefix || newPrefix > IPV6_BITS) {
    throw new Error(`New prefix must be a whole number between ${calculation.prefix} and ${IPV6_BITS}.`);
  }
  const totalSubnets = 1n << BigInt(newPrefix - calculation.prefix);
  const previewCount = Number(totalSubnets > BigInt(MAX_IPV6_SUBNET_PREVIEW)
    ? BigInt(MAX_IPV6_SUBNET_PREVIEW)
    : totalSubnets);
  const base = parseIpv6Address(calculation.networkAddress);
  const subnetSize = 1n << BigInt(IPV6_BITS - newPrefix);
  const preview = Array.from({ length: previewCount }, (_unused, index) => (
    `${compressIpv6(base + BigInt(index) * subnetSize)}/${newPrefix}`
  ));
  return {
    newPrefix,
    totalSubnets,
    preview,
    truncated: totalSubnets > BigInt(previewCount),
  };
}

export function formatIpv6Count(value: bigint): string {
  return value.toLocaleString('en-US');
}
