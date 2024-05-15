import type {
  Certificate,
  Fingerprint,
  Key,
  PrivateKey, Signature,
} from 'sshpk';
import type * as openpgp from 'openpgp';
import * as forge from 'node-forge';

export interface LabelValue {
  label: string
  value: string
  multiline?: boolean
}

function onErrorReturnErrorMessage(func: () => any) {
  try {
    return func();
  }
  catch (e: any) {
    return e.toString();
  }
}

function buf2Hex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

export function getPublicKeyLabelValues(publicKey: Key) {
  return [
    {
      label: 'Type:',
      value: 'Public Key',
    },
    {
      label: 'Key Type:',
      value: publicKey.type,
    },
    {
      label: 'Size:',
      value: publicKey.size,
    },
    {
      label: 'Comment:',
      value: publicKey.comment,
      multiline: true,
    },
    {
      label: 'Curve:',
      value: publicKey.curve ?? 'none',
    },
    {
      label: 'Fingerprint (sha256):',
      value: onErrorReturnErrorMessage(() => publicKey.fingerprint('sha256')),
      multiline: true,
    },
    {
      label: 'Fingerprint (sha512):',
      value: onErrorReturnErrorMessage(() => publicKey.fingerprint('sha512')),
      multiline: true,
    },
  ] as LabelValue[];
}

export function getPrivateKeyLabelValues(privateKey: PrivateKey) {
  return [
    {
      label: 'Type:',
      value: 'Private Key',
    },
    {
      label: 'Key Type:',
      value: privateKey.type,
    },
    {
      label: 'Size:',
      value: privateKey.size,
    },
    {
      label: 'Comment:',
      value: privateKey.comment,
      multiline: true,
    },
    {
      label: 'Curve:',
      value: privateKey.curve,
    },
    {
      label: 'Fingerprint (sha256):',
      value: onErrorReturnErrorMessage(() => privateKey.fingerprint('sha256')),
      multiline: true,
    },
    {
      label: 'Fingerprint (sha512):',
      value: onErrorReturnErrorMessage(() => privateKey.fingerprint('sha512')),
      multiline: true,
    },
  ] as LabelValue[];
}

export function getCertificateLabelValues(cert: Certificate) {
  return [
    {
      label: 'Type:',
      value: 'Certificate',
    },
    {
      label: 'Subjects:',
      value: cert.subjects?.map(s => s.toString()).join('\n'),
      multiline: true,
    },
    {
      label: 'Issuer:',
      value: cert.issuer.toString(),
      multiline: true,
    },
    {
      label: 'Subject Key:',
      value: onErrorReturnErrorMessage(() => cert.subjectKey?.toString('ssh')),
      multiline: true,
    },
    {
      label: 'Subject Key Type:',
      value: cert.subjectKey?.type,
    },
    {
      label: 'Subject Size:',
      value: cert.subjectKey?.size,
    },
    {
      label: 'Subject Comment:',
      value: cert.subjectKey?.comment,
      multiline: true,
    },
    {
      label: 'Subject Curve:',
      value: cert.subjectKey?.curve ?? 'none',
    },
    {
      label: 'Issuer Key:',
      value: onErrorReturnErrorMessage(() => cert.issuerKey?.toString('ssh')),
      multiline: true,
    },
    {
      label: 'Serial:',
      value: buf2Hex(cert.serial),
    },
    {
      label: 'Purposes:',
      value: cert.purposes?.join(', '),
    },
    {
      label: 'Extensions:',
      value: JSON.stringify(cert.getExtensions(), null, 2),
      multiline: true,
    },
    {
      label: 'Fingerprint (sha256):',
      value: onErrorReturnErrorMessage(() => cert.fingerprint('sha256')),
      multiline: true,
    },
    {
      label: 'Fingerprint (sha512):',
      value: onErrorReturnErrorMessage(() => cert.fingerprint('sha512')),
      multiline: true,
    },
    {
      label: 'Certificate (pem):',
      value: onErrorReturnErrorMessage(() => cert.toString('pem')),
      multiline: true,
    },
  ] as LabelValue[];
}

export async function getPGPPublicKeyLabelValuesAsync(pgpPublicKey: openpgp.Key) {
  return [
    {
      label: 'Type:',
      value: 'PGP Public Key',
    },
    {
      label: 'Creation Time:',
      value: pgpPublicKey.getCreationTime().toString(),
    },
    {
      label: 'Expiration Time:',
      value: (await pgpPublicKey.getExpirationTime())?.toString() || '',
    },
    {
      label: 'Algorithm Info:',
      value: JSON.stringify(pgpPublicKey.getAlgorithmInfo()),
    },
    {
      label: 'Fingerprint:',
      value: pgpPublicKey.getFingerprint(),
    },
    {
      label: 'User ID(s):',
      value: pgpPublicKey.getUserIDs().join(', '),
    },
    {
      label: 'Key ID(s):',
      value: pgpPublicKey.getKeyIDs().map(k => k.toHex()).join(' ; '),
    },
  ] as LabelValue[];
}

export async function getPGPPrivateKeyLabelValuesAsync(pgpPrivateKey: openpgp.Key) {
  return [
    {
      label: 'Type:',
      value: 'PGP Private Key',
    },
    {
      label: 'Creation Time:',
      value: pgpPrivateKey.getCreationTime().toString(),
    },
    {
      label: 'Expiration Time:',
      value: (await pgpPrivateKey.getExpirationTime())?.toString() || '',
    },
    {
      label: 'Algorithm Info:',
      value: JSON.stringify(pgpPrivateKey.getAlgorithmInfo()),
    },
    {
      label: 'Fingerprint:',
      value: pgpPrivateKey.getFingerprint(),
    },
    {
      label: 'User ID(s):',
      value: pgpPrivateKey.getUserIDs().join(', '),
    },
    {
      label: 'Key ID(s):',
      value: pgpPrivateKey.getKeyIDs().map(k => k.toHex()).join(' ; '),
    },
  ] as LabelValue[];
}

export function getCSRLabelValues(csr: forge.pki.Certificate) {
  return [
    {
      label: 'Type:',
      value: 'Certificate Signing Request',
    },
    {
      label: 'Subject:',
      value: csr.subject?.attributes?.map(a => JSON.stringify(a, null, 2)).join('\n'),
      multiline: true,
    },
    {
      label: 'Issuer:',
      value: csr.issuer?.toString(),
      multiline: true,
    },
    {
      label: 'Validity:',
      value: JSON.stringify(csr.validity, null, 2),
    },
    {
      label: 'Signature:',
      value: csr.signature,
    },
    {
      label: 'Signature Oid:',
      value: csr.signatureOid?.toString(),
    },
    {
      label: 'Signature parameters:',
      value: JSON.stringify(csr.signatureParameters, null, 2),
    },
    {
      label: 'Signing info:',
      value: JSON.stringify(csr.siginfo, null, 2),
    },
    {
      label: 'Serial:',
      value: csr.serialNumber?.toString(),
    },
    {
      label: 'Extensions:',
      value: JSON.stringify(csr.extensions, null, 2),
      multiline: true,
    },
    {
      label: 'Public Key:',
      value: onErrorReturnErrorMessage(() => forge.pki.publicKeyToPem(csr.publicKey)),
      multiline: true,
    },
    {
      label: 'Public Key Fingerprint:',
      value: onErrorReturnErrorMessage(() => forge.pki.getPublicKeyFingerprint(csr.publicKey)?.toHex()),
      multiline: true,
    },
  ] as LabelValue[];
}

export function getFingerprintLabelValues(fingerprint: Fingerprint) {
  return [
    {
      label: 'Type:',
      value: 'Fingerprint',
    },
    {
      label: 'Fingerprint (hex):',
      value: fingerprint.toString('hex'),
    },
    {
      label: 'Fingerprint (base64):',
      value: fingerprint.toString('base64'),
    },
  ] as LabelValue[];
}

export function getSignatureLabelValues(signature: Signature) {
  return [
    {
      label: 'Type:',
      value: 'Signature',
    },
    {
      label: 'Fingerprint (asn1):',
      value: signature.toString('asn1'),
    },
    {
      label: 'Fingerprint (ssh):',
      value: signature.toString('ssh'),
    },
  ] as LabelValue[];
}
