import { describe, expect, it } from 'vitest';
import { compressIpv6, describeIpv6, expandIpv6 } from './ipv6-subnet-calculator.models';

describe('ipv6-subnet-calculator: expansion', () => {
  it('expands compressed forms', () => {
    expect(expandIpv6('2001:db8::1')).toBe('2001:0db8:0000:0000:0000:0000:0000:0001');
    expect(expandIpv6('::1')).toBe('0000:0000:0000:0000:0000:0000:0000:0001');
    expect(expandIpv6('::')).toBe('0000:0000:0000:0000:0000:0000:0000:0000');
    expect(expandIpv6('fe80::1%eth0')).toBe('fe80:0000:0000:0000:0000:0000:0000:0001');
  });

  it('passes already-expanded addresses through', () => {
    expect(expandIpv6('2001:0DB8:0:0:0:0:0:1')).toBe('2001:0db8:0000:0000:0000:0000:0000:0001');
  });

  it('rejects malformed addresses', () => {
    expect(() => expandIpv6('2001::db8::1')).toThrow('Invalid IPv6');
    expect(() => expandIpv6('12345::')).toThrow('Invalid IPv6');
    expect(() => expandIpv6('2001:db8:0:0:0:0:0')).toThrow('Invalid IPv6');
  });
});

describe('ipv6-subnet-calculator: compression', () => {
  it('compresses the longest zero run once', () => {
    expect(compressIpv6('2001:0db8:0000:0000:0000:0000:0000:0001')).toBe('2001:db8::1');
    expect(compressIpv6('0000:0000:0000:0000:0000:0000:0000:0001')).toBe('::1');
    // leftmost of two equal runs
    // the trailing 4-zero run is the longest, so it is compressed
    expect(compressIpv6('0000:0000:0001:0002:0000:0000:0000:0000')).toBe('0:0:1:2::');
    // a single zero group is not compressed
    expect(compressIpv6('2001:0db8:0000:000a:000b:000c:000d:000e')).toBe('2001:db8:0:a:b:c:d:e');
  });
});

describe('ipv6-subnet-calculator: subnet math', () => {
  it('computes network bounds for a /48', () => {
    const info = describeIpv6('2001:db8:1234:5678::1/48');
    expect(info.network).toBe('2001:db8:1234::/48');
    expect(info.firstAddress).toBe('2001:db8:1234::');
    expect(info.lastAddress).toBe('2001:db8:1234:ffff:ffff:ffff:ffff:ffff');
    expect(info.totalAddresses).toBe((2n ** 80n).toString());
    expect(info.mask).toBe('ffff:ffff:ffff::');
  });

  it('handles the host address itself at /128', () => {
    const info = describeIpv6('::1/128');
    expect(info.network).toBe('::1/128');
    expect(info.firstAddress).toBe('::1');
    expect(info.lastAddress).toBe('::1');
    expect(info.totalAddresses).toBe('1');
  });

  it('handles the whole space at /0', () => {
    const info = describeIpv6('2001:db8::1/0');
    expect(info.network).toBe('::/0');
    expect(info.firstAddress).toBe('::');
    expect(info.lastAddress).toBe('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');
    expect(info.totalAddresses).toBe((2n ** 128n).toString());
  });

  it('classifies common address types', () => {
    expect(describeIpv6('2001:db8::1/64').type).toContain('Documentation');
    expect(describeIpv6('fe80::1/64').type).toContain('Link-local');
    expect(describeIpv6('::1/128').type).toBe('Loopback');
    expect(describeIpv6('ff02::1/64').type).toContain('Multicast');
    expect(describeIpv6('fd00::1/64').type).toContain('Unique local');
  });

  it('rejects invalid prefixes', () => {
    expect(() => describeIpv6('2001:db8::1/129')).toThrow('Invalid prefix');
    expect(() => describeIpv6('2001:db8::1/-1')).toThrow('Invalid prefix');
  });
});
