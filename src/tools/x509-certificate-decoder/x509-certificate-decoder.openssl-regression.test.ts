import { describe, expect, it } from 'vitest';
import { decodeCertificatePem } from './x509-certificate-decoder.service';

// Regression corpus generated with OpenSSL 3.5 (`openssl req -x509`), then
// every asserted value cross-checked against `openssl x509 -text`. These
// pin the decoder to OpenSSL's canonical rendering of the tricky shapes:
// IPv6 SANs, multi-byte named bits (decipherOnly), bare SKI key ids,
// context-tagged AKI key ids, and an extension OID with a multi-byte first
// sub-identifier (1.2.999.1 → 0x88 0x67).

const RSA_IPV6_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIDnDCCAoSgAwIBAgIUYQ5gUMphhz1LUtSnI4XJxAnGzTcwDQYJKoZIhvcNAQEL
BQAwSTELMAkGA1UEBhMCQ04xEDAOBgNVBAgMB0JlaWppbmcxDTALBgNVBAoMBFRl
c3QxGTAXBgNVBAMMEHRlc3QuZXhhbXBsZS5jb20wHhcNMjYxMDAzMDgzMjMzWhcN
MjYxMTAyMDgzMjMzWjBJMQswCQYDVQQGEwJDTjEQMA4GA1UECAwHQmVpamluZzEN
MAsGA1UECgwEVGVzdDEZMBcGA1UEAwwQdGVzdC5leGFtcGxlLmNvbTCCASIwDQYJ
KoZIhvcNAQEBBQADggEPADCCAQoCggEBAMnND40VnXTg3ZvBrfJOPh4WGmV718Cb
URSFKnK1yDITpAc4HsJjcTntl92Xsb0ov1Nc20/L7ePz2qN4QbFqmhzZbmNhdmIF
IXlldpFsFHRjSJ3kbwsApWtozDVi3iAYseJ2GfFZ4rUfOIoRbCkHWR6KNwpJrJT4
IWktnE0fK7tIMRc4O+d6ksVg54tLi+r6BSZAurdWLy9Bq3zWwYUrZUvG2TBJ1HIi
CRDC7PSyCV/o/C9eGtJr0EGDq7Exl/kfW+QYwqFMXXrfjhSWBwEZfiegUPr9/7DD
ZMdPTmdOwrV8OmkhSdXSM5tAoRwlSako/Rirf52o02Jm7U2phlHxQP0CAwEAAaN8
MHowDwYDVR0TAQH/BAUwAwEB/zA3BgNVHREEMDAuhxAgAQ24AAAAAAAAAAAAAAAB
hwTAqAEBgg1hLmV4YW1wbGUuY29tgQVhQGIuYzAPBgNVHQ8BAf8EBQMDB6CAMB0G
A1UdDgQWBBSMRZA0vuzo5oiW4uxRGmP62SZcsTANBgkqhkiG9w0BAQsFAAOCAQEA
QerYkO13fxKoqpLitIKKdm5jDCOXfEMJbH2CwKUIhJbxsslCW32p0IXRmvudwPSO
yFwD3fIy7vPrPxiLOvrvs1uEMEYhNKeE0yVhk2DjQxHAJpQRDCHYj4vZSPkrx6ze
JpjEaJ9TniIlxKS4ggubyOkVM51o47rqevsmUccFgT6Umu2AMmgSP4WvUgbncYrK
SKodoq9fZp1e2eVy7CeN7A6rpbYHAgktoYMBvtRSnZVJo+CcqcNl4xc97gtXeKQI
vt8bIDLVFsV0CHuVIi/LzhcZvZ8khTniu4YELpzqYjfLkib8XADtWdeWGTwOPz8a
Y1eZ1r6V6qU4MQpkyc1EdQ==
-----END CERTIFICATE-----`;

const ED25519_CUSTOM_OID_CERT_PEM = `-----BEGIN CERTIFICATE-----
MIIB1jCCAVygAwIBAgIUGd2IUBuv1j/C7zeNuXkPo96XpjQwCgYIKoZIzj0EAwIw
MDELMAkGA1UEBhMCQ04xDzANBgNVBAoMBlRlc3RDQTEQMA4GA1UEAwwHUm9vdCBD
QTAeFw0yNjEwMDMxMDQ0MDhaFw0yNjExMDIxMDQ0MDhaMB4xHDAaBgNVBAMME2Vk
MjU1MTkuZXhhbXBsZS5jb20wKjAFBgMrZXADIQAU+Pxvo65PrtplGQ2m7ro0w+Nl
8LT+55hSlOUnchBPTaOBlDCBkTAJBgNVHRMEAjAAMAsGA1UdDwQEAwIHgDAZBgNV
HREEEjAQgg5lZS5leGFtcGxlLmNvbTAcBgQqh2cBBBQMEm11bHRpYnl0ZS1vaWQt
dGVzdDAdBgNVHQ4EFgQUFP9MR1+AykhnKRueeH/chyvm8DswHwYDVR0jBBgwFoAU
5mzqfASzZNXN4M6pjkcrzP8dfRgwCgYIKoZIzj0EAwIDaAAwZQIxALE9DbikX0km
UVBx2tc3QM7kM2TdIDhOCQ5a0cARDcfXmpQKoPFw31fVoHvbPaDFGAIwBH8Ixj3N
hG5ERArF3f+YnESSA8SOR0QDJxrAx/dP702H7Imct3LFSJiYB5DYkzWS
-----END CERTIFICATE-----`;

function rowsOf(pem: string, title: string): Map<string, string> {
  const decoded = decodeCertificatePem(pem);
  const section = decoded.sections.find(s => s.title === title);
  expect(section, `section ${title}`).toBeDefined();
  return new Map(section!.rows.map(row => [row.label, row.value]));
}

describe('x509 decoder vs OpenSSL corpus (regression)', () => {
  it('renders IPv6 SANs in RFC 5952 text form and keeps IPv4 dotted', () => {
    const san = rowsOf(RSA_IPV6_CERT_PEM, 'Extensions').get('subjectAltName') ?? '';
    expect(san).toContain('IP: 2001:db8::1');
    expect(san).toContain('IP: 192.168.1.1');
    expect(san).toContain('DNS: a.example.com');
    expect(san).toContain('Email: a@b.c');
    expect(san).not.toContain('32.1.13.184');
  });

  it('decodes named bits beyond the first byte (decipherOnly)', () => {
    const ku = rowsOf(RSA_IPV6_CERT_PEM, 'Extensions').get('keyUsage (critical)') ?? '';
    expect(ku).toContain('digitalSignature');
    expect(ku).toContain('keyEncipherment');
    expect(ku).toContain('decipherOnly');
  });

  it('prints the bare SKI key id without the DER wrapper', () => {
    const ski = rowsOf(RSA_IPV6_CERT_PEM, 'Extensions').get('subjectKeyIdentifier') ?? '';
    expect(ski).toBe('8C:45:90:34:BE:EC:E8:E6:88:96:E2:EC:51:1A:63:FA:D9:26:5C:B1');
  });

  it('prints the AKI key id from the context-tagged child', () => {
    const aki = rowsOf(ED25519_CUSTOM_OID_CERT_PEM, 'Extensions').get('authorityKeyIdentifier') ?? '';
    expect(aki).toBe('E6:6C:EA:7C:04:B3:64:D5:CD:E0:CE:A9:8E:47:2B:CC:FF:1D:7D:18');
  });

  it('decodes extension OIDs with multi-byte first sub-identifiers', () => {
    const extensions = rowsOf(ED25519_CUSTOM_OID_CERT_PEM, 'Extensions');
    // 1.2.999.1 encodes its first sub-identifier as two base-128 bytes;
    // the old first-byte shortcut decoded it as 3.39.77.1.
    expect(extensions.has('1.2.999.1')).toBe(true);
    expect(extensions.has('3.39.77.1')).toBe(false);
  });

  it('identifies the Ed25519 public key without a curve row', () => {
    const key = rowsOf(ED25519_CUSTOM_OID_CERT_PEM, 'Public key');
    expect(key.get('Algorithm')).toBe('Ed25519');
    expect(key.get('Key size')).toBe('256 bits');
  });

  it('keeps the signature algorithm names for ECDSA issuer chains', () => {
    const cert = rowsOf(ED25519_CUSTOM_OID_CERT_PEM, 'Certificate');
    expect(cert.get('Signature algorithm')).toBe('ecdsa-with-SHA256');
  });
});
