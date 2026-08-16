import { describe, expect, it } from 'vitest';
import { lookupGeoIpCsv, parseIpAddress } from './offline-geoip-inspector.service';

describe('offline GeoIP service', () => {
  it('parses exact IPv4 and IPv6 values without floating point math', () => {
    expect(parseIpAddress('1.1.1.1')).toMatchObject({ canonical: '1.1.1.1', family: 4, value: 16_843_009n });
    expect(parseIpAddress('2001:0db8::1')).toMatchObject({ canonical: '2001:db8::1', family: 6 });
    expect(() => parseIpAddress('01.1.1.1')).toThrow(/canonical IPv4/);
    expect(() => parseIpAddress('2001:::1')).toThrow();
  });

  it('finds IPv4 ranges with bounded binary search', () => {
    const csv = '1.0.0.0,1.0.0.255,AU\n1.0.1.0,1.0.3.255,CN\n8.8.8.0,8.8.8.255,US\n';
    expect(lookupGeoIpCsv(csv, parseIpAddress('8.8.8.8'))).toMatchObject({
      countryCode: 'US',
      rangeStart: '8.8.8.0',
      rangeEnd: '8.8.8.255',
    });
    expect(lookupGeoIpCsv(csv, parseIpAddress('7.7.7.7'))).toBeNull();
  });

  it('finds IPv6 ranges with BigInt ordering', () => {
    const csv = '2001:200::,2001:200:ffff:ffff:ffff:ffff:ffff:ffff,JP\n2606:4700::,2606:4700:ffff:ffff:ffff:ffff:ffff:ffff,US\n';
    expect(lookupGeoIpCsv(csv, parseIpAddress('2606:4700:4700::1111'))).toMatchObject({
      countryCode: 'US',
      family: 6,
    });
  });
});
