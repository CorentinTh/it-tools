import { describe, expect, it } from 'vitest';
import {
  IPV6_MAX_VALUE,
  calculateIpv6,
  compressIpv6,
  expandIpv6,
  formatIpv6Count,
  isIpv6InCidr,
  parseIpv6Address,
  parseIpv6Cidr,
  splitIpv6Cidr,
} from './ipv6-calculator.service';

describe('IPv6 parsing and formatting', () => {
  it.each([
    ['::', '0000:0000:0000:0000:0000:0000:0000:0000'],
    ['::1', '0000:0000:0000:0000:0000:0000:0000:0001'],
    ['2001:db8::ff00:42:8329', '2001:0db8:0000:0000:0000:ff00:0042:8329'],
    ['::ffff:192.0.2.128', '0000:0000:0000:0000:0000:ffff:c000:0280'],
  ])('expands %s', (source, expanded) => {
    const value = parseIpv6Address(source);
    expect(expandIpv6(value)).toBe(expanded);
    expect(parseIpv6Address(expanded)).toBe(value);
  });

  it('uses RFC 5952 longest-run compression and first-run tie breaking', () => {
    expect(compressIpv6(parseIpv6Address('2001:0:0:1:0:0:0:1'))).toBe('2001:0:0:1::1');
    expect(compressIpv6(parseIpv6Address('2001:0:0:1:0:0:1:1'))).toBe('2001::1:0:0:1:1');
    expect(compressIpv6(0n)).toBe('::');
    expect(compressIpv6(IPV6_MAX_VALUE)).toBe('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');
  });

  it.each(['', '2001:db8:::', '2001::db8::1', '2001:db8::/64', '1:2:3:4:5:6:7', '::ffff:999.0.0.1'])('rejects malformed address %j', (source) => {
    expect(() => parseIpv6Address(source)).toThrow();
  });

  it('validates CIDR boundaries', () => {
    expect(parseIpv6Cidr('::/0')).toEqual({ address: 0n, prefix: 0 });
    expect(parseIpv6Cidr('ffff::1/128')).toEqual({ address: parseIpv6Address('ffff::1'), prefix: 128 });
    expect(() => parseIpv6Cidr('::/129')).toThrow(/between 0 and 128/);
    expect(() => parseIpv6Cidr('::')).toThrow(/prefix/);
  });
});

describe('IPv6 CIDR calculations', () => {
  it('calculates exact /64 boundaries and count', () => {
    expect(calculateIpv6('2001:db8:abcd:12::dead:beef/64')).toMatchObject({
      networkAddress: '2001:db8:abcd:12::',
      firstAddress: '2001:db8:abcd:12::',
      lastAddress: '2001:db8:abcd:12:ffff:ffff:ffff:ffff',
      addressCount: 18_446_744_073_709_551_616n,
      hostBits: 64,
    });
  });

  it('handles /0 and /128 without floating-point loss', () => {
    expect(calculateIpv6('ffff::1/0')).toMatchObject({
      networkAddress: '::',
      lastAddress: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      addressCount: 1n << 128n,
    });
    expect(calculateIpv6('2001:db8::1/128')).toMatchObject({
      networkAddress: '2001:db8::1',
      lastAddress: '2001:db8::1',
      addressCount: 1n,
    });
    expect(formatIpv6Count(1n << 128n)).toBe('340,282,366,920,938,463,463,374,607,431,768,211,456');
  });

  it('tests membership on network boundaries', () => {
    expect(isIpv6InCidr('2001:db8:1:ffff:ffff:ffff:ffff:ffff', '2001:db8::/47')).toBe(true);
    expect(isIpv6InCidr('2001:db8:2::', '2001:db8::/47')).toBe(false);
  });

  it('splits networks with an exact bounded preview', () => {
    const split = splitIpv6Cidr('2001:db8::/48', 52);
    expect(split.totalSubnets).toBe(16n);
    expect(split.preview).toHaveLength(16);
    expect(split.preview[0]).toBe('2001:db8::/52');
    expect(split.preview[15]).toBe('2001:db8:0:f000::/52');
    expect(split.truncated).toBe(false);

    const huge = splitIpv6Cidr('::/0', 128);
    expect(huge.totalSubnets).toBe(1n << 128n);
    expect(huge.preview).toHaveLength(256);
    expect(huge.truncated).toBe(true);
    expect(() => splitIpv6Cidr('2001:db8::/64', 63)).toThrow(/between 64 and 128/);
  });
});
