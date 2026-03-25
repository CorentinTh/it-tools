import forge from 'node-forge';

export interface DecodedCert {
  subject: string
  issuer: string
  validFrom: string
  validTo: string
  serialNumber: string
  fingerprint: string
  sans: string
}

export function decodeCert(pem: string): DecodedCert {
  const cert = forge.pki.certificateFromPem(pem);

  const getAttributes = (attributes: any[]) => {
    return attributes.map(a => `${a.shortName || a.name || a.type}=${a.value}`).join(', ');
  };

  const extensions = cert.extensions || [];
  const subjectAltNameExt = extensions.find((e: any) => e.name === 'subjectAltName');
  const sans = subjectAltNameExt ? subjectAltNameExt.altNames.map((n: any) => n.value).join(', ') : '';
  const fingerprint = forge.md.sha1.create().update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()).digest().toHex();

  return {
    subject: getAttributes(cert.subject.attributes),
    issuer: getAttributes(cert.issuer.attributes),
    validFrom: cert.validity.notBefore.toISOString(),
    validTo: cert.validity.notAfter.toISOString(),
    serialNumber: cert.serialNumber.toUpperCase().match(/.{1,2}/g)?.join(':') || cert.serialNumber,
    fingerprint: fingerprint.toUpperCase().match(/.{1,2}/g)?.join(':') || fingerprint,
    sans,
  };
}
