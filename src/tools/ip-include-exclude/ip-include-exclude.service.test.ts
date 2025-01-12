import { describe, expect, it } from 'vitest';
import { substractCIDRs } from './ip-include-exclude.service';

describe('ip-include-exclude', () => {
  describe('substractCIDRs', () => {
    it('should return error on invalid values', () => {
      expect(substractCIDRs({ allowedRanges: '192.168.0.', disallowedRanges: '' })).to.deep.eq({ // NOSONAR
        allowedCIDRs: [],
        allowedSubnets: [],
        disallowedSubnets: [],
        error: 'Error: Invalid IP (range/subnetwork)',
      });
    });
    it('should return correct substractions and subnets', () => {
      expect(substractCIDRs({ allowedRanges: '192.168.3.0/24', disallowedRanges: '' })).to.deep.eq({ // NOSONAR
        allowedCIDRs: ['192.168.3.0/24'], // NOSONAR
        allowedSubnets: [{ cidr: '192.168.3.0/24', end: '192.168.3.255', start: '192.168.3.0' }], // NOSONAR
        disallowedSubnets: [],
        error: '',
      });
      expect(substractCIDRs({ allowedRanges: '192.168.2.0/24', disallowedRanges: '192.168.2.1' })).to.deep.eq({ // NOSONAR
        allowedCIDRs: ['192.168.2.0/32', // NOSONAR
          '192.168.2.2/31', // NOSONAR
          '192.168.2.4/30', // NOSONAR
          '192.168.2.8/29', // NOSONAR
          '192.168.2.16/28', // NOSONAR
          '192.168.2.32/27', // NOSONAR
          '192.168.2.64/26', // NOSONAR
          '192.168.2.128/25'], // NOSONAR
        allowedSubnets: [
          { cidr: '192.168.2.0/24', end: '192.168.2.255', start: '192.168.2.0' }, // NOSONAR
        ],
        disallowedSubnets: [
          { cidr: '192.168.2.1/32', end: '192.168.2.1', start: '192.168.2.1' }, // NOSONAR
        ],
        error: '',
      });
      expect(substractCIDRs({ allowedRanges: '192.168.12.0/24', disallowedRanges: '192.168.12.1-192.168.12.10, 192.168.12.34' })).to.deep.eq({ // NOSONAR
        allowedCIDRs: ['192.168.12.0/32', // NOSONAR
          '192.168.12.11/32', // NOSONAR
          '192.168.12.12/30', // NOSONAR
          '192.168.12.16/28', // NOSONAR
          '192.168.12.32/31', // NOSONAR
          '192.168.12.35/32', // NOSONAR
          '192.168.12.36/30', // NOSONAR
          '192.168.12.40/29', // NOSONAR
          '192.168.12.48/28', // NOSONAR
          '192.168.12.64/26', // NOSONAR
          '192.168.12.128/25'], // NOSONAR
        allowedSubnets: [{ cidr: '192.168.12.0/24', end: '192.168.12.255', start: '192.168.12.0' }], // NOSONAR
        disallowedSubnets: [
          { cidr: '192.168.12.1/32', end: '192.168.12.1', start: '192.168.12.1' }, // NOSONAR
          { cidr: '192.168.12.2/31', end: '192.168.12.3', start: '192.168.12.2' }, // NOSONAR
          { cidr: '192.168.12.4/30', end: '192.168.12.7', start: '192.168.12.4' }, // NOSONAR
          { cidr: '192.168.12.8/31', end: '192.168.12.9', start: '192.168.12.8' }, // NOSONAR
          { cidr: '192.168.12.10/32', end: '192.168.12.10', start: '192.168.12.10' }, // NOSONAR
          { cidr: '192.168.12.34/32', end: '192.168.12.34', start: '192.168.12.34' }, // NOSONAR
        ],
        error: '',
      });
    });
  });
});
