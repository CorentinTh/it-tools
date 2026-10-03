import { md, pki } from 'node-forge';
import { describe, expect, it } from 'vitest';
import { decodeCertificatePem } from './x509-certificate-decoder.service';

const EC_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIBqjCCAVGgAwIBAgIUVgYjpd++yLMwyD15DLcDVQXwsscwCgYIKoZIzj0EAwIw
KzEXMBUGA1UEAwwOZWMuZXhhbXBsZS5jb20xEDAOBgNVBAoMB0VDIFRlc3QwHhcN
MjYwOTMwMTMzODI1WhcNMjcwOTMwMTMzODI1WjArMRcwFQYDVQQDDA5lYy5leGFt
cGxlLmNvbTEQMA4GA1UECgwHRUMgVGVzdDBZMBMGByqGSM49AgEGCCqGSM49AwEH
A0IABDLul3OTKmdoRTgVpAHhNCYl/cf0Kv0OtysMoyoXxazZ6l3RhMOFXuSSv7/Y
M4ryQ0NxdIPcfp3tdvz9gofPJZWjUzBRMB0GA1UdDgQWBBTqaYh03Xxut48jrjWu
SAwe84nD4TAfBgNVHSMEGDAWgBTqaYh03Xxut48jrjWuSAwe84nD4TAPBgNVHRMB
Af8EBTADAQH/MAoGCCqGSM49BAMCA0cAMEQCICWnMVnE7j/t2azIpgKwYc20+1Vo
gpauAYH3o8+v52jhAiAW7o36o7iEd5r8yuh6CR/qJYazHp3eo274Q537m4us7Q==
-----END CERTIFICATE-----`;

function rsaCertPem(options: { keyUsage?: boolean } = {}): string {
  const keys = pki.rsa.generateKeyPair(1024);
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01AB';
  cert.validity.notBefore = new Date('2026-01-01T00:00:00Z');
  cert.validity.notAfter = new Date('2027-01-01T00:00:00Z');
  const subject = [
    { shortName: 'CN', value: 'test.example.com' },
    { shortName: 'O', value: 'Test Org' },
    { shortName: 'C', value: 'DE' },
  ];
  cert.setSubject(subject);
  cert.setIssuer(subject);
  const extensions: object[] = [
    { name: 'basicConstraints', cA: true, pathLen: 1 },
    { name: 'subjectAltName', altNames: [{ type: 2, value: 'test.example.com' }, { type: 7, ip: '10.0.0.1' }] },
  ];
  if (options.keyUsage !== false) {
    extensions.push({ name: 'keyUsage', digitalSignature: true, keyEncipherment: true });
  }
  cert.setExtensions(extensions);
  cert.sign(keys.privateKey, md.sha256.create());
  return pki.certificateToPem(cert);
}

function findRow(decoded: ReturnType<typeof decodeCertificatePem>, section: string, label: string) {
  return decoded.sections
    .find(s => s.title === section)
    ?.rows.find(row => row.label.startsWith(label));
}

describe('x509-certificate-decoder: RSA certificates', () => {
  it('decodes the certificate overview section', () => {
    const decoded = decodeCertificatePem(rsaCertPem());

    expect(findRow(decoded, 'Certificate', 'Version')?.value).toBe('v3');
    expect(findRow(decoded, 'Certificate', 'Serial number')?.value).toBe('01:AB');
    expect(findRow(decoded, 'Certificate', 'Signature algorithm')?.value).toBe('sha256WithRSAEncryption');
    expect(findRow(decoded, 'Certificate', 'Not before')?.value).toContain('2026-01-01');
    expect(findRow(decoded, 'Certificate', 'Not after')?.value).toContain('2027-01-01');
  });

  it('decodes subject and issuer distinguished names', () => {
    const decoded = decodeCertificatePem(rsaCertPem());

    const subject = decoded.sections.find(s => s.title === 'Subject')?.rows;
    expect(subject?.[0]).toMatchObject({ label: expect.stringContaining('(CN)'), value: 'test.example.com' });
    expect(subject?.some(row => row.label.includes('(O)') && row.value === 'Test Org')).toBe(true);
    expect(subject?.some(row => row.label.includes('(C)') && row.value === 'DE')).toBe(true);

    const issuer = decoded.sections.find(s => s.title === 'Issuer')?.rows;
    expect(issuer?.[0]?.value).toBe('test.example.com');
  });

  it('decodes the RSA public key details', () => {
    const decoded = decodeCertificatePem(rsaCertPem());

    expect(findRow(decoded, 'Public key', 'Algorithm')?.value).toBe('RSA');
    expect(findRow(decoded, 'Public key', 'Key size')?.value).toBe('1024 bits');
    expect(findRow(decoded, 'Public key', 'Exponent')?.value).toBe('65537');
  });

  it('decodes basicConstraints, SAN and keyUsage extensions', () => {
    const decoded = decodeCertificatePem(rsaCertPem());

    // forge's setExtensions drops pathLen from the DER; openssl fixture covers it
    expect(findRow(decoded, 'Extensions', 'basicConstraints')?.value).toBe('CA: true');
    const san = findRow(decoded, 'Extensions', 'subjectAltName')?.value ?? '';
    expect(san).toContain('DNS: test.example.com');
    expect(san).toContain('IP: 10.0.0.1');
    expect(findRow(decoded, 'Extensions', 'keyUsage')?.value).toContain('digitalSignature');
    expect(findRow(decoded, 'Extensions', 'keyUsage')?.value).toContain('keyEncipherment');
  });

  it('computes both fingerprints as hex pairs', () => {
    const decoded = decodeCertificatePem(rsaCertPem());

    const sha256 = findRow(decoded, 'Fingerprints', 'SHA-256')?.value ?? '';
    expect(sha256).toMatch(/^([0-9A-F]{2}:){31}[0-9A-F]{2}$/);
    const sha1 = findRow(decoded, 'Fingerprints', 'SHA-1')?.value ?? '';
    expect(sha1).toMatch(/^([0-9A-F]{2}:){19}[0-9A-F]{2}$/);
  });
});

const CA_PATHLEN_PEM = `-----BEGIN CERTIFICATE-----
MIIBiTCCATCgAwIBAgIUHBPZrRX8pGjpag/D48ZCCL2n+rowCgYIKoZIzj0EAwIw
GTEXMBUGA1UEAwwOY2EuZXhhbXBsZS5jb20wHhcNMjYwOTMwMTQwMjQzWhcNMjgw
OTI5MTQwMjQzWjAZMRcwFQYDVQQDDA5jYS5leGFtcGxlLmNvbTBZMBMGByqGSM49
AgEGCCqGSM49AwEHA0IABDLul3OTKmdoRTgVpAHhNCYl/cf0Kv0OtysMoyoXxazZ
6l3RhMOFXuSSv7/YM4ryQ0NxdIPcfp3tdvz9gofPJZWjVjBUMB0GA1UdDgQWBBTq
aYh03Xxut48jrjWuSAwe84nD4TAfBgNVHSMEGDAWgBTqaYh03Xxut48jrjWuSAwe
84nD4TASBgNVHRMBAf8ECDAGAQH/AgEBMAoGCCqGSM49BAMCA0cAMEQCIAD1pF4R
oy3pyDv0IbID+fn3FmkbmWyb2pii6uEYyVtaAiB0lln06DKzc0bmww47Hf/ZfD/H
hiErXsIe25bNKf1Iwg==
-----END CERTIFICATE-----`;

describe('x509-certificate-decoder: EC certificates', () => {
  it('decodes a prime256v1 certificate that node-forge certificateFromPem rejects', () => {
    const decoded = decodeCertificatePem(EC_CERT_PEM);

    expect(findRow(decoded, 'Certificate', 'Signature algorithm')?.value).toBe('ecdsa-with-SHA256');
    expect(findRow(decoded, 'Public key', 'Algorithm')?.value).toBe('EC (id-ecPublicKey)');
    expect(findRow(decoded, 'Public key', 'Curve')?.value).toBe('prime256v1 (P-256)');
    expect(findRow(decoded, 'Public key', 'Key size')?.value).toBe('256 bits');
    expect(findRow(decoded, 'Extensions', 'basicConstraints')?.value).toBe('CA: true');
  });
});

describe('x509-certificate-decoder: critical extension with pathLen', () => {
  it('decodes critical marker and pathLen from an openssl-generated CA cert', () => {
    const decoded = decodeCertificatePem(CA_PATHLEN_PEM);
    const bc = decoded.sections
      .find(s2 => s2.title === 'Extensions')
      ?.rows.find(row => row.label.startsWith('basicConstraints'));
    expect(bc?.label).toBe('basicConstraints (critical)');
    expect(bc?.value).toBe('CA: true, pathLen: 1');
  });
});

describe('x509-certificate-decoder: error handling', () => {
  it('throws a helpful error for empty input', () => {
    expect(() => decodeCertificatePem('')).toThrow('Paste a PEM certificate');
  });

  it('throws when no CERTIFICATE block is present', () => {
    const keyPem = '-----BEGIN PRIVATE KEY-----\nAAAA\n-----END PRIVATE KEY-----';
    expect(() => decodeCertificatePem(keyPem)).toThrow('No CERTIFICATE block');
  });

  it('throws on garbage input', () => {
    expect(() => decodeCertificatePem('not a pem at all')).toThrow();
  });

  it('decodes the first certificate of a chain and ignores trailing blocks', () => {
    const chain = `${rsaCertPem()}\n${EC_CERT_PEM}`;
    const decoded = decodeCertificatePem(chain);
    expect(findRow(decoded, 'Public key', 'Algorithm')?.value).toBe('RSA');
  });
});
