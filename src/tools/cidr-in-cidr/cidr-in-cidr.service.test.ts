import { describe, expect, it } from 'vitest';
import { cidrInCidr } from './cidr-in-cidr.service';

describe('cidr-in-cidr', () => {
  describe('cidrInCidr', () => {
    it('should return correct inclusion', () => {
      expect(cidrInCidr({ baseRange: '192.168.0.0/16', ipOrRangeToTest: '192.168.0.1' }).isIncluded).toBe(true); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.1.0/24', ipOrRangeToTest: '192.168.0.10' }).isIncluded).toBe(false); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.1.*', ipOrRangeToTest: '192.168.0.10' }).isIncluded).toBe(false); // NOSONAR

      expect(cidrInCidr({ baseRange: '192.168.0.0/24', ipOrRangeToTest: '192.168.0.0/28' }).isIncluded).toBe(true); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.20.0/24', ipOrRangeToTest: '192.168.1.0/28' }).isIncluded).toBe(false); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.20.*', ipOrRangeToTest: '192.168.1.0/28' }).isIncluded).toBe(false); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.0.*', ipOrRangeToTest: '192.168.0.0/28' }).isIncluded).toBe(true); // NOSONAR

      expect(cidrInCidr({ baseRange: '192.168.20.1-192.168.20.15', ipOrRangeToTest: '192.168.20.12' }).isIncluded).toBe(true); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.20.1-192.168.20.15', ipOrRangeToTest: '192.168.20.20' }).isIncluded).toBe(false); // NOSONAR

      expect(cidrInCidr({ baseRange: '192.168.20.1-192.168.20.15', ipOrRangeToTest: '192.168.20.9-192.168.20.12' }).isIncluded).toBe(true); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.20.1-192.168.20.15', ipOrRangeToTest: '192.168.20.9-192.168.20.20' }).isIncluded).toBe(false); // NOSONAR

      expect(cidrInCidr({ baseRange: '192.168.20.0-192.168.20.255', ipOrRangeToTest: '192.168.20.0/28' }).isIncluded).toBe(true); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.20.0-192.168.20.255', ipOrRangeToTest: '192.168.1.0/28' }).isIncluded).toBe(false); // NOSONAR
      expect(cidrInCidr({ baseRange: '192.168.0.0-192.168.1.255', ipOrRangeToTest: '192.168.1.0/28' }).isIncluded).toBe(true); // NOSONAR
    });
    it('should return correct subnet', () => {
      expect(cidrInCidr({ baseRange: '192.168.0.0/16', ipOrRangeToTest: '192.168.0.1' }).baseSubnets).to.deep.eq([ // NOSONAR
        {
          cidr: '192.168.0.0/16', // NOSONAR
          end: '192.168.255.255', // NOSONAR
          start: '192.168.0.0', // NOSONAR
        },
      ]);
      expect(cidrInCidr({ baseRange: '192.168.20.1-192.168.20.3', ipOrRangeToTest: '192.168.1.0/28' }).baseSubnets).to.deep.eq([ // NOSONAR
        {
          cidr: '192.168.20.1/32', // NOSONAR
          end: '192.168.20.1', // NOSONAR
          start: '192.168.20.1', // NOSONAR
        },
        {
          cidr: '192.168.20.2/31', // NOSONAR
          end: '192.168.20.3', // NOSONAR
          start: '192.168.20.2', // NOSONAR
        },
      ]);
    });
  });
});
