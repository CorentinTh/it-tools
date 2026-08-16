import { IPV6_BITS, IPV6_MAX_VALUE, compressIpv6, parseIpv6Address } from '../ipv6-calculator/ipv6-calculator.service';

export type NetworkSuiteOperation = 'cidr' | 'dhcp-option-43' | 'port' | 'ttl';
export type IpFamily = 4 | 6;

interface ExactAddress {
  bits: 32 | 128
  family: IpFamily
  value: bigint
}

interface ExactNetwork extends ExactAddress {
  prefix: number
  first: bigint
  last: bigint
}

const IPV4_BITS = 32;
const IPV4_MAX_VALUE = (1n << 32n) - 1n;
const MAX_DHCP_IPV4_ADDRESSES = 63;

function parseIpv4Address(source: string): bigint {
  const octets = source.trim().split('.');
  if (octets.length !== 4 || octets.some(value => !/^(?:0|[1-9]\d{0,2})$/u.test(value))) {
    throw new Error('Enter a canonical IPv4 address with four decimal octets.');
  }
  const values = octets.map(Number);
  if (values.some(value => value > 255)) {
    throw new Error('IPv4 octets must be between 0 and 255.');
  }
  return values.reduce((result, value) => (result << 8n) | BigInt(value), 0n);
}

function formatIpv4(value: bigint): string {
  if (value < 0n || value > IPV4_MAX_VALUE) {
    throw new RangeError('IPv4 values must fit in 32 bits.');
  }
  return [24n, 16n, 8n, 0n].map(shift => String(Number((value >> shift) & 0xFFn))).join('.');
}

function parseAddress(source: string): ExactAddress {
  if (source.includes(':')) {
    return { bits: IPV6_BITS, family: 6, value: parseIpv6Address(source) };
  }
  return { bits: IPV4_BITS, family: 4, value: parseIpv4Address(source) };
}

function maxForBits(bits: number): bigint {
  return bits === IPV4_BITS ? IPV4_MAX_VALUE : IPV6_MAX_VALUE;
}

function prefixMask(bits: number, prefix: number): bigint {
  const hostBits = bits - prefix;
  return hostBits === bits ? 0n : maxForBits(bits) ^ ((1n << BigInt(hostBits)) - 1n);
}

function parseNetwork(source: string): ExactNetwork {
  const parts = source.trim().split('/');
  if (parts.length !== 2 || !/^\d{1,3}$/u.test(parts[1])) {
    throw new Error('Enter an IPv4 or IPv6 CIDR, for example 192.0.2.0/24 or 2001:db8::/48.');
  }
  const address = parseAddress(parts[0]);
  const prefix = Number(parts[1]);
  if (prefix < 0 || prefix > address.bits) {
    throw new Error(`${address.family === 4 ? 'IPv4' : 'IPv6'} prefix length must be between 0 and ${address.bits}.`);
  }
  const first = address.value & prefixMask(address.bits, prefix);
  const hostBits = address.bits - prefix;
  return { ...address, prefix, first, last: first | (hostBits === 0 ? 0n : (1n << BigInt(hostBits)) - 1n) };
}

function formatAddress(value: bigint, family: IpFamily): string {
  return family === 4 ? formatIpv4(value) : compressIpv6(value);
}

function formatCidr(value: bigint, family: IpFamily, prefix: number): string {
  return `${formatAddress(value, family)}/${prefix}`;
}

function assertSameFamily(left: { family: IpFamily }, right: { family: IpFamily }): void {
  if (left.family !== right.family) {
    throw new Error('CIDR and address inputs must use the same IP family.');
  }
}

export function calculateCidrReport(cidrSource: string, membershipSource = '', exclusionSource = ''): string {
  const network = parseNetwork(cidrSource);
  const lines = [
    `Family: IPv${network.family}`,
    `Network: ${formatCidr(network.first, network.family, network.prefix)}`,
    `First address: ${formatAddress(network.first, network.family)}`,
    `Last address: ${formatAddress(network.last, network.family)}`,
    `Address count: ${(network.last - network.first + 1n).toLocaleString('en-US')}`,
    `Host bits: ${network.bits - network.prefix}`,
  ];

  if (membershipSource.trim()) {
    const member = parseAddress(membershipSource.trim());
    assertSameFamily(network, member);
    lines.push(`Membership: ${member.value >= network.first && member.value <= network.last ? 'inside' : 'outside'}`);
  }

  if (exclusionSource.trim()) {
    const exclusion = parseNetwork(exclusionSource);
    assertSameFamily(network, exclusion);
    if (exclusion.first < network.first || exclusion.last > network.last) {
      throw new Error('The excluded CIDR must be fully contained in the parent CIDR.');
    }
    const remaining: string[] = [];
    function visit(first: bigint, prefix: number): void {
      const size = 1n << BigInt(network.bits - prefix);
      const last = first + size - 1n;
      if (last < exclusion.first || first > exclusion.last) {
        remaining.push(formatCidr(first, network.family, prefix));
        return;
      }
      if (first === exclusion.first && last === exclusion.last) {
        return;
      }
      const half = size >> 1n;
      visit(first, prefix + 1);
      visit(first + half, prefix + 1);
    }
    visit(network.first, network.prefix);
    lines.push('', `Excluded: ${formatCidr(exclusion.first, exclusion.family, exclusion.prefix)}`, `Remaining CIDRs (${remaining.length}):`, ...remaining);
  }
  return lines.join('\n');
}

export function encodeDhcpOption43(source: string, suboptionSource: string): string {
  const suboption = Number(suboptionSource);
  if (!/^\d{1,3}$/u.test(suboptionSource.trim()) || suboption < 0 || suboption > 255) {
    throw new Error('The DHCP suboption code must be a whole number from 0 to 255.');
  }
  const addresses = source.split(/[\s,;]+/u).filter(Boolean);
  if (addresses.length === 0 || addresses.length > MAX_DHCP_IPV4_ADDRESSES) {
    throw new Error(`Enter 1–${MAX_DHCP_IPV4_ADDRESSES} IPv4 addresses.`);
  }
  const payload = addresses.flatMap((address) => {
    const value = parseIpv4Address(address);
    return [24n, 16n, 8n, 0n].map(shift => Number((value >> shift) & 0xFFn));
  });
  const bytes = [suboption, payload.length, ...payload];
  const hex = bytes.map(value => value.toString(16).padStart(2, '0'));
  return [
    `Suboption: ${suboption}`,
    `Payload length: ${payload.length} bytes`,
    `Addresses: ${addresses.join(', ')}`,
    `Hex: ${hex.join('')}`,
    `Colon hex: ${hex.join(':')}`,
    '',
    'This is an RFC-style suboption TLV payload. Confirm the vendor-specific Option 43 envelope and suboption code required by your DHCP server and device.',
  ].join('\n');
}

const KNOWN_PORTS: Record<string, Partial<Record<'tcp' | 'udp', string>>> = {
  20: { tcp: 'FTP data' },
  21: { tcp: 'FTP control' },
  22: { tcp: 'SSH' },
  25: { tcp: 'SMTP' },
  53: { tcp: 'DNS', udp: 'DNS' },
  67: { udp: 'DHCP server' },
  68: { udp: 'DHCP client' },
  80: { tcp: 'HTTP' },
  123: { udp: 'NTP' },
  443: { tcp: 'HTTPS', udp: 'HTTP/3 (commonly)' },
  465: { tcp: 'Message submission over TLS' },
  587: { tcp: 'Message submission' },
  993: { tcp: 'IMAPS' },
  3306: { tcp: 'MySQL' },
  5432: { tcp: 'PostgreSQL' },
  6379: { tcp: 'Redis' },
  8080: { tcp: 'Common alternate HTTP' },
};

export function inspectPort(portSource: string, protocol: 'tcp' | 'udp'): string {
  const port = Number(portSource);
  if (!/^\d{1,5}$/u.test(portSource.trim()) || port < 0 || port > 65_535) {
    throw new Error('Port must be a whole number from 0 to 65535.');
  }
  const range = port <= 1023 ? 'System / well-known range' : port <= 49_151 ? 'User / registered range' : 'Dynamic / private range';
  const service = KNOWN_PORTS[String(port)]?.[protocol] ?? 'No compact built-in service label';
  return [`Port: ${port}/${protocol}`, `Range: ${range}`, `Common use: ${service}`, '', 'A common-use label is informational and does not prove which process is listening.'].join('\n');
}

export function calculateTtl(ttlSource: string): string {
  const seconds = Number(ttlSource);
  if (!/^\d+$/u.test(ttlSource.trim()) || !Number.isSafeInteger(seconds) || seconds < 0 || seconds > 2_147_483_647) {
    throw new Error('TTL must be a whole number from 0 to 2147483647 seconds.');
  }
  let remainder = seconds;
  const units: Array<[string, number]> = [['day', 86_400], ['hour', 3_600], ['minute', 60], ['second', 1]];
  const human = units.flatMap(([name, size]) => {
    const amount = Math.floor(remainder / size);
    remainder %= size;
    return amount > 0 || (name === 'second' && seconds === 0) ? [`${amount} ${name}${amount === 1 ? '' : 's'}`] : [];
  }).join(', ');
  return [
    `TTL: ${seconds.toLocaleString('en-US')} seconds`,
    `Duration: ${human}`,
    `Minutes: ${(seconds / 60).toLocaleString('en-US', { maximumFractionDigits: 3 })}`,
    `Hours: ${(seconds / 3600).toLocaleString('en-US', { maximumFractionDigits: 3 })}`,
    `Days: ${(seconds / 86400).toLocaleString('en-US', { maximumFractionDigits: 3 })}`,
    '',
    'DNS caches may cap, floor, or otherwise override an authoritative TTL.',
  ].join('\n');
}
