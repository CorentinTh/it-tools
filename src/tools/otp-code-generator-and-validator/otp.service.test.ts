import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  base32toHex,
  buildKeyUri,
  generateHOTP,
  generateSecret,
  generateTOTP,
  hexToBytes,
  verifyHOTP,
  verifyTOTP,
} from './otp.service';
import type { RandomValuesProvider } from '@/utils/secure-random';

function sequenceRandomValues(sequence: number[]): RandomValuesProvider {
  let offset = 0;

  return (values) => {
    for (let index = 0; index < values.length; index++) {
      values[index] = sequence[offset % sequence.length];
      offset++;
    }

    return values;
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('otp functions', () => {
  describe('hexToBytes', () => {
    it('convert an hexstring to a byte array', () => {
      expect(hexToBytes('1')).to.eql([1]);
      expect(hexToBytes('ffffff')).to.eql([255, 255, 255]);
      expect(hexToBytes('000000000')).to.eql([0, 0, 0, 0, 0]);
      expect(hexToBytes('a3218bcef89')).to.eql([163, 33, 139, 206, 248, 9]);
      expect(hexToBytes('063679ca')).toEqual([6, 54, 121, 202]);
      expect(hexToBytes('0102030405060708090a0b0c0d0e0f')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });
  });
  describe('base32toHex', () => {
    it('convert a base32 to hex string', () => {
      expect(base32toHex('ABCDEF')).to.eql('00443205');
      expect(base32toHex('7777')).to.eql('ffff0f');
      expect(base32toHex('JBSWY3DPEHPK3PXP')).to.eql('48656c6c6f21deadbeef');
    });

    it('case does not matter', () => {
      expect(base32toHex('ABC')).to.eql(base32toHex('abc'));
    });

    it('rejects empty and malformed Base32 instead of silently decoding it', () => {
      expect(() => base32toHex('')).toThrow('non-empty RFC 4648 Base32');
      expect(() => base32toHex('ABC0')).toThrow('non-empty RFC 4648 Base32');
      expect(() => base32toHex('A'.repeat(513))).toThrow('must not exceed 512');
    });
  });

  describe('generateHOTP', () => {
    it('generates HOTP codes for a given counter', () => {
      const key = 'JBSWY3DPEHPK3PXP';
      const hotpCodes = ['282760', '996554', '602287', '143627', '960129'];

      for (const [counter, code] of hotpCodes.entries()) {
        expect(generateHOTP({ key, counter })).to.eql(code);
      }
    });

    it('matches the RFC 4226 Appendix D vectors and accepts exact 64-bit counters', () => {
      const key = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
      const expected = ['755224', '287082', '359152', '969429', '338314', '254676', '287922', '162583', '399871', '520489'];
      expect(expected.map((_, counter) => generateHOTP({ key, counter: BigInt(counter) }))).toEqual(expected);
      expect(generateHOTP({ key, counter: (1n << 64n) - 1n })).toMatch(/^\d{6}$/u);
      expect(() => generateHOTP({ key, counter: 1n << 64n })).toThrow('2^64 - 1');
    });
  });

  describe('verifyHOTP', () => {
    it('validate hotp for a given secret', () => {
      const key = 'JBSWY3DPEHPK3PXP';
      const hotpCodes = ['282760', '996554', '602287', '143627', '960129'];

      for (const [counter, token] of hotpCodes.entries()) {
        expect(verifyHOTP({ token, key, counter, window: 0 })).to.eql(true);
      }

      expect(verifyHOTP({ token: 'INVALID', key })).to.eql(false);
    });

    it('does not validate hotp out of sync', () => {
      const key = 'JBSWY3DPEHPK3PXP';
      const token = '282760';

      expect(verifyHOTP({ token, key, counter: 5, window: 2 })).to.eql(false);
      expect(verifyHOTP({ token, key, counter: 5, window: 5 })).to.eql(true);
    });
  });

  describe('generateTOTP', () => {
    it('generates TOTP codes', () => {
      const key = 'JBSWY3DPEHPK3PXP';

      const codes = [
        { token: '282760', now: 0 },
        { token: '341128', now: 1465324707000 },
        { token: '089029', now: 1365324707000 },
      ];

      for (const { token, now } of codes) {
        expect(generateTOTP({ key, now })).to.eql(token);
      }
    });
  });

  describe('verifyTOTP', () => {
    it('verify TOTP in sync codes against a key', () => {
      const key = 'JBSWY3DPEHPK3PXP';

      const codes = [
        { token: '282760', now: 0 },
        { token: '341128', now: 1465324707000 },
        { token: '089029', now: 1365324707000 },
      ];

      for (const { token, now } of codes) {
        expect(verifyTOTP({ key, token, now })).to.eql(true);
      }
    });

    it('does not validate totp out of sync', () => {
      const key = 'JBSWY3DPEHPK3PXP';
      const token = '635183';
      const now = 1661266455000;

      expect(verifyTOTP({ key, token, now, window: 2 })).to.eql(true);
      expect(verifyTOTP({ key, token, now, window: 1 })).to.eql(false);
    });
  });

  describe('buildKeyUri', () => {
    it('build a key uri string', () => {
      expect(buildKeyUri({ secret: 'JBSWY3DPEHPK3PXP' })).to.eql(
        'otpauth://totp/IT-Tools:demo-user?issuer=IT-Tools&secret=JBSWY3DPEHPK3PXP&algorithm=SHA1&digits=6&period=30',
      );

      expect(buildKeyUri({ secret: 'JBSWY3DPEHPK3PXP', type: 'hotp', counter: 42n })).to.eql(
        'otpauth://hotp/IT-Tools:demo-user?issuer=IT-Tools&secret=JBSWY3DPEHPK3PXP&algorithm=SHA1&digits=6&counter=42',
      );

      expect(
        buildKeyUri({
          secret: 'JBSWY3DPEHPK3PXP',
          app: 'app-name',
          account: 'account',
          algorithm: 'algo',
          digits: 7,
          period: 10,
        }),
      ).to.eql(
        'otpauth://totp/app-name:account?issuer=app-name&secret=JBSWY3DPEHPK3PXP&algorithm=algo&digits=7&period=10',
      );
    });
  });

  describe('generateSecret', () => {
    it('generates deterministic base32 secrets with the complete alphabet', () => {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      const getRandomValues = sequenceRandomValues(Array.from({ length: alphabet.length }, (_, index) => index));

      const secrets = generateSecret({ getRandomValues }) + generateSecret({ getRandomValues });

      expect(secrets).toBe(alphabet);
    });

    it('does not use Math.random', () => {
      const mathRandom = vi.spyOn(Math, 'random').mockImplementation(() => {
        throw new Error('Math.random must not be used for OTP secrets');
      });

      expect(generateSecret()).toMatch(/^[A-Z2-7]{16}$/);
      expect(mathRandom).not.toHaveBeenCalled();
    });
  });
});
