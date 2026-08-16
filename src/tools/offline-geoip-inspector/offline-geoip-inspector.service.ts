import { compressIpv6, parseIpv6Address } from '../ipv6-calculator/ipv6-calculator.service';

export type IpFamily = 4 | 6;

export interface ParsedIpAddress {
  canonical: string
  family: IpFamily
  value: bigint
}

export interface GeoIpLookupResult {
  address: string
  countryCode: string
  family: IpFamily
  rangeEnd: string
  rangeStart: string
}

function parseIpv4Address(source: string) {
  const octets = source.split('.');
  if (octets.length !== 4 || octets.some(octet => !/^(?:0|[1-9]\d{0,2})$/.test(octet))) {
    throw new Error('Enter a canonical IPv4 address or an IPv6 address without a CIDR prefix.');
  }
  const values = octets.map(Number);
  if (values.some(octet => octet > 255)) {
    throw new Error('IPv4 octets must be between 0 and 255.');
  }
  return {
    canonical: values.join('.'),
    value: values.reduce((result, octet) => result * 256n + BigInt(octet), 0n),
  };
}

export function parseIpAddress(source: string): ParsedIpAddress {
  const trimmed = source.trim();
  if (trimmed === '' || trimmed.length > 64) {
    throw new Error('Enter an IP address of at most 64 characters.');
  }

  if (trimmed.includes(':')) {
    const value = parseIpv6Address(trimmed);
    return { canonical: compressIpv6(value), family: 6, value };
  }

  const ipv4 = parseIpv4Address(trimmed);
  return { ...ipv4, family: 4 };
}

function parseRangeAddress(source: string, family: IpFamily) {
  return family === 4 ? parseIpv4Address(source).value : parseIpv6Address(source);
}

export function lookupGeoIpCsv(
  csv: string,
  address: ParsedIpAddress,
): GeoIpLookupResult | null {
  const lines = csv.trimEnd().split('\n');
  let low = 0;
  let high = lines.length - 1;

  while (low <= high) {
    const middle = low + Math.floor((high - low) / 2);
    const fields = lines[middle].split(',');
    if (fields.length !== 3 || !/^[A-Z]{2}$/.test(fields[2])) {
      throw new Error('The bundled GeoIP dataset has an invalid row.');
    }
    const start = parseRangeAddress(fields[0], address.family);
    const end = parseRangeAddress(fields[1], address.family);

    if (address.value < start) {
      high = middle - 1;
    }
    else if (address.value > end) {
      low = middle + 1;
    }
    else {
      return {
        address: address.canonical,
        countryCode: fields[2],
        family: address.family,
        rangeEnd: fields[1],
        rangeStart: fields[0],
      };
    }
  }

  return null;
}
