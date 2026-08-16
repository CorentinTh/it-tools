import { describe, expect, it } from 'vitest';
import { calculateCidrReport, calculateTtl, encodeDhcpOption43, inspectPort } from './network-calculation-suite.service';

describe('network calculation suite', () => {
  it('uses exact IPv4 range, membership, and CIDR exclusion calculations', () => {
    const report = calculateCidrReport('192.0.2.17/28', '192.0.2.31', '192.0.2.24/30');
    expect(report).toContain('Network: 192.0.2.16/28');
    expect(report).toContain('Last address: 192.0.2.31');
    expect(report).toContain('Membership: inside');
    expect(report).toContain('192.0.2.16/29');
    expect(report).toContain('192.0.2.28/30');
  });

  it('uses the shared 128-bit model for IPv6 membership and exclusion', () => {
    const report = calculateCidrReport('2001:db8::1/126', '2001:db8::3', '2001:db8::2/127');
    expect(report).toContain('Network: 2001:db8::/126');
    expect(report).toContain('Address count: 4');
    expect(report).toContain('Membership: inside');
    expect(report).toContain('2001:db8::/127');
  });

  it('rejects mixed address families and exclusions outside the parent', () => {
    expect(() => calculateCidrReport('192.0.2.0/24', '2001:db8::1')).toThrow('same IP family');
    expect(() => calculateCidrReport('192.0.2.0/24', '', '192.0.3.0/24')).toThrow('fully contained');
  });

  it('encodes bounded DHCP Option 43 suboption bytes', () => {
    expect(encodeDhcpOption43('192.0.2.1, 198.51.100.2', '241')).toContain('Hex: f108c0000201c6336402');
  });

  it('classifies ports without implying a live listener and formats TTL exactly', () => {
    expect(inspectPort('443', 'udp')).toContain('HTTP/3');
    expect(inspectPort('50000', 'tcp')).toContain('Dynamic / private');
    expect(calculateTtl('90061')).toContain('1 day, 1 hour, 1 minute, 1 second');
  });
});
