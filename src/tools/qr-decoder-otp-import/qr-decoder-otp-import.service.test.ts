import { describe, expect, it } from 'vitest';
import { parseOtpAuthUri } from './qr-decoder-otp-import.service';

describe('otpauth URI parser', () => {
  it('parses a normalized TOTP provisioning URI', () => {
    expect(parseOtpAuthUri('otpauth://totp/Example:alice%40example.com?secret=jbsw%20y3dp%20ehpk3pxp&issuer=Example&algorithm=sha256&digits=8&period=45')).toEqual({
      kind: 'totp',
      account: 'alice@example.com',
      issuer: 'Example',
      secret: 'JBSWY3DPEHPK3PXP',
      algorithm: 'SHA256',
      digits: 8,
      period: 45,
    });
  });

  it('parses HOTP with a safe counter', () => {
    expect(parseOtpAuthUri('otpauth://hotp/Build?secret=JBSWY3DPEHPK3PXP&counter=42')).toMatchObject({
      kind: 'hotp', account: 'Build', counter: 42, algorithm: 'SHA1', digits: 6,
    });
  });

  it('reports an issuer mismatch without silently changing either identity', () => {
    expect(parseOtpAuthUri('otpauth://totp/LabelIssuer:alice?secret=JBSWY3DPEHPK3PXP&issuer=QueryIssuer')).toMatchObject({
      issuer: 'QueryIssuer',
      warning: 'The issuer query parameter differs from the issuer in the account label.',
    });
  });

  it.each([
    'https://example.com/',
    'otpauth://totp/account',
    'otpauth://totp/account?secret=NOT-BASE32',
    'otpauth://totp/account?secret=JBSWY3DPEHPK3PXP&digits=7',
    'otpauth://totp/account?secret=JBSWY3DPEHPK3PXP&period=0',
    'otpauth://hotp/account?secret=JBSWY3DPEHPK3PXP&counter=-1',
    'otpauth://totp:443/account?secret=JBSWY3DPEHPK3PXP',
    'otpauth://totp@evil.example/account?secret=JBSWY3DPEHPK3PXP',
  ])('rejects malformed or unsupported provisioning data: %s', (value) => {
    expect(() => parseOtpAuthUri(value)).toThrow();
  });

  it('bounds payload and decoded label sizes', () => {
    expect(() => parseOtpAuthUri('x'.repeat(4_097))).toThrow('4,096');
    expect(() => parseOtpAuthUri(`otpauth://totp/${'a'.repeat(513)}?secret=JBSWY3DPEHPK3PXP`)).toThrow('512');
  });
});
