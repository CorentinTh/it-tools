import { describe, expect, it } from 'vitest';
import { inspectPem } from './certificate-inspector.service';

const CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIICUjCCAfgCCQDPXs/QZt/e6zAKBggqhkjOPQQDAjA3MQswCQYDVQQGEwJVUzER
MA8GA1UECgwISVQgVG9vbHMxFTATBgNVBAMMDGV4YW1wbGUudGVzdDAeFw0yNjA4
MTYwMDQ1MzFaFw0yNjA4MTcwMDQ1MzFaMDcxCzAJBgNVBAYTAlVTMREwDwYDVQQK
DAhJVCBUb29sczEVMBMGA1UEAwwMZXhhbXBsZS50ZXN0MIIBSzCCAQMGByqGSM49
AgEwgfcCAQEwLAYHKoZIzj0BAQIhAP////8AAAABAAAAAAAAAAAAAAAA////////
////////MFsEIP////8AAAABAAAAAAAAAAAAAAAA///////////////8BCBaxjXY
qjqT57PrvVV2mIa8ZR0GsMxTsPY7zjw+J9JgSwMVAMSdNgiG5wSTamZ44ROdJreB
n36QBEEEaxfR8uEsQkf4vOblY6RA8ncDfYEt6zOg9KE5RdiYwpZP40Li/hp/m47n
60p8D54WK84zV2sxXs7LtkBoN79R9QIhAP////8AAAAA//////////+85vqtpxee
hPO5ysL8YyVRAgEBA0IABIT5r4kXJ2f5G4esIh0ixx3QO0oBtZTufq6FA7tt4JwS
vCZzzr2/92XZXkUJYgckBqnHFqW6E+6kZOoY8x18Q4kwCgYIKoZIzj0EAwIDSAAw
RQIgSr6ZNsT59XKt9uUHgGGNPOfveNNuUdxdUMG6syKygOsCIQDb30FvRcBdxOZ7
vDMmkyNP/OROYiKgoCzOjc0GodYeKg==
-----END CERTIFICATE-----`;

describe('certificate inspector', () => {
  it('extracts X.509 identity, validity, public-key, signature, and fingerprint fields', async () => {
    const result = await inspectPem(CERTIFICATE);
    expect(result).toMatchObject({
      type: 'X.509 certificate',
      subject: 'C=US, O=IT Tools, CN=example.test',
      issuer: 'C=US, O=IT Tools, CN=example.test',
      validFrom: '2026-08-16T00:45:31.000Z',
      validTo: '2026-08-17T00:45:31.000Z',
      publicKeyAlgorithm: 'EC',
      signatureAlgorithm: 'ECDSA with SHA-256',
    });
    expect(result.sha256Fingerprint).toMatch(/^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/);
  });

  it('rejects private keys and malformed DER', async () => {
    await expect(inspectPem('-----BEGIN PRIVATE KEY-----\nAQID\n-----END PRIVATE KEY-----')).rejects.toThrow('private keys');
    await expect(inspectPem('-----BEGIN PUBLIC KEY-----\nAQID\n-----END PUBLIC KEY-----')).rejects.toThrow('DER');
  });
});

export { CERTIFICATE };
