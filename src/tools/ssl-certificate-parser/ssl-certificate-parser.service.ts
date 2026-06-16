import forge from 'node-forge';

const { pki } = forge;

export interface CertificateInfo {
  subject: { key: string; value: string }[]
  issuer: { key: string; value: string }[]
  serialNumber: string
  validFrom: string
  validTo: string
  isExpired: boolean
  daysUntilExpiry: number
  version: number
  signatureAlgorithm: string
  thumbprint: string
  subjectAltNames: string[]
  keyUsage: string[]
  basicConstraints: string
  publicKeyAlgorithm: string
  publicKeySize: string
}

const fieldLabels: Record<string, string> = {
  commonName: 'Common Name (CN)',
  organizationName: 'Organization (O)',
  organizationalUnitName: 'Organizational Unit (OU)',
  countryName: 'Country (C)',
  stateOrProvinceName: 'State/Province (ST)',
  localityName: 'Locality (L)',
  emailAddress: 'Email',
};

function formatDN(attrs: pki.CertificateField[]) {
  return attrs.map((attr) => {
    const label = (attr.name && fieldLabels[attr.name]) || attr.shortName || attr.name || attr.type || 'Unknown';
    return { key: label, value: String(attr.value) };
  });
}

function getSubjectAltNames(cert: pki.Certificate): string[] {
  const ext = cert.getExtension('subjectAltName') as { altNames?: { type: number; value: string }[] } | null;
  if (!ext?.altNames) {
    return [];
  }
  return ext.altNames.map(an => an.value);
}

function getKeyUsage(cert: pki.Certificate): string[] {
  const ext = cert.getExtension('keyUsage') as Record<string, boolean> | null;
  if (!ext) {
    return [];
  }
  const usages = [
    'digitalSignature', 'nonRepudiation', 'keyEncipherment', 'dataEncipherment',
    'keyAgreement', 'keyCertSign', 'cRLSign', 'encipherOnly', 'decipherOnly',
  ];
  return usages.filter(u => ext[u]);
}

function getBasicConstraints(cert: pki.Certificate): string {
  const ext = cert.getExtension('basicConstraints') as { cA?: boolean; pathLenConstraint?: number } | null;
  if (!ext) {
    return 'Not present';
  }
  const ca = ext.cA ? 'CA: TRUE' : 'CA: FALSE';
  const pathLen = ext.pathLenConstraint !== undefined ? `, Path Length: ${ext.pathLenConstraint}` : '';
  return `${ca}${pathLen}`;
}

export function parseCertificate(pem: string): CertificateInfo {
  const cert = pki.certificateFromPem(pem);

  const now = new Date();
  const validTo = cert.validity.notAfter;
  const isExpired = now > validTo;
  const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const md = pki.getPublicKeyFingerprint(cert.publicKey, {
    md: forge.md.sha256.create(),
    encoding: 'hex',
    delimiter: ':',
  });

  const pubKey = cert.publicKey as pki.rsa.PublicKey;
  let publicKeyAlgorithm = 'RSA';
  let publicKeySize = '';
  if ('n' in pubKey && pubKey.n) {
    publicKeySize = `${pubKey.n.bitLength()} bits`;
  }

  return {
    subject: formatDN(cert.subject.attributes),
    issuer: formatDN(cert.issuer.attributes),
    serialNumber: cert.serialNumber,
    validFrom: cert.validity.notBefore.toISOString(),
    validTo: cert.validity.notAfter.toISOString(),
    isExpired,
    daysUntilExpiry,
    version: cert.version + 1,
    signatureAlgorithm: (pki as any).oids[cert.siginfo.algorithmOid] || cert.siginfo.algorithmOid,
    thumbprint: String(md),
    subjectAltNames: getSubjectAltNames(cert),
    keyUsage: getKeyUsage(cert),
    basicConstraints: getBasicConstraints(cert),
    publicKeyAlgorithm,
    publicKeySize,
  };
}
