import { describe, expect, it } from 'vitest';
import { ipv4ToInt, isValidIpv4 } from './ipv4-address-converter.service';

describe('ipv4-address-converter', () => {
  describe('ipv4ToInt', () => {
    it('should convert an IPv4 address to an integer', () => {
      expect(ipv4ToInt({ ip: '192.168.0.1' })).toBe(3232235521);
      expect(ipv4ToInt({ ip: '10.0.0.1' })).toBe(167772161);
      expect(ipv4ToInt({ ip: '255.255.255.255' })).toBe(4294967295);
    });
  });

  describe('isValidIpv4', () => {
    it('should return true for a valid IP address', () => {
      expect(isValidIpv4({ ip: '192.168.0.1' })).to.equal(true);
      expect(isValidIpv4({ ip: '10.0.0.1' })).to.equal(true);
    });

    it('should return false for an invalid IP address', () => {
      expect(isValidIpv4({ ip: '256.168.0.1' })).to.equal(false);
      expect(isValidIpv4({ ip: '192.168.0' })).to.equal(false);
      expect(isValidIpv4({ ip: '192.168.0.1.2' })).to.equal(false);
      expect(isValidIpv4({ ip: '192.168.0.1.' })).to.equal(false);
      expect(isValidIpv4({ ip: '.192.168.0.1' })).to.equal(false);
      expect(isValidIpv4({ ip: '192.168.0.a' })).to.equal(false);
    });

    it('should return false for crap as input', () => {
      expect(isValidIpv4({ ip: '' })).to.equal(false);
      expect(isValidIpv4({ ip: ' ' })).to.equal(false);
      expect(isValidIpv4({ ip: 'foo' })).to.equal(false);
      expect(isValidIpv4({ ip: '-1' })).to.equal(false);
      expect(isValidIpv4({ ip: '0' })).to.equal(false);
    });
  });
});
