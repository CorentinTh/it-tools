import { asn1, md as forgeMd, pem as forgePem } from 'node-forge';

export interface CertificateRow {
  label: string
  value: string
  hint?: string
}

export interface CertificateSection {
  title: string
  rows: CertificateRow[]
}

export interface DecodedCertificate {
  sections: CertificateSection[]
}

/** Distinguished-name attribute OIDs (RFC 5280 / legacy PKCS#9). */
const DN_OIDS: Record<string, string> = {
  '2.5.4.3': 'CommonName (CN)',
  '2.5.4.6': 'Country (C)',
  '2.5.4.7': 'Locality (L)',
  '2.5.4.8': 'StateOrProvince (ST)',
  '2.5.4.9': 'Street',
  '2.5.4.10': 'Organization (O)',
  '2.5.4.11': 'OrganizationalUnit (OU)',
  '2.5.4.5': 'SerialNumber',
  '2.5.4.4': 'Surname (SN)',
  '2.5.4.42': 'GivenName (GN)',
  '2.5.4.12': 'Title',
  '2.5.4.13': 'Description',
  '2.5.4.17': 'PostalCode',
  '1.2.840.113549.1.9.1': 'Email',
  '0.9.2342.19200300.100.1.25': 'DomainComponent (DC)',
  '0.9.2342.19200300.100.1.1': 'UserID (UID)',
};

// Dotted strings below are ASN.1 object identifiers in dotted-arc notation,
// not network addresses (S1313 pattern-matches some of them as IPv4).
const SIGNATURE_ALGORITHM_OIDS: Record<string, string> = {
  '1.2.840.113549.1.1.4': 'md5WithRSAEncryption',
  '1.2.840.113549.1.1.5': 'sha1WithRSAEncryption',
  '1.2.840.113549.1.1.10': 'RSASSA-PSS',
  '1.2.840.113549.1.1.11': 'sha256WithRSAEncryption',
  '1.2.840.113549.1.1.12': 'sha384WithRSAEncryption',
  '1.2.840.113549.1.1.13': 'sha512WithRSAEncryption',
  '1.2.840.10045.4.1': 'ecdsa-with-SHA1',
  '1.2.840.10045.4.3.2': 'ecdsa-with-SHA256',
  '1.2.840.10045.4.3.3': 'ecdsa-with-SHA384',
  '1.2.840.10045.4.3.4': 'ecdsa-with-SHA512',
  '1.3.101.112': 'Ed25519',
  '1.3.101.113': 'Ed448',
};

const PUBLIC_KEY_ALGORITHM_OIDS: Record<string, string> = {
  '1.2.840.113549.1.1.1': 'RSA',
  '1.2.840.10045.2.1': 'EC (id-ecPublicKey)',
  '1.3.101.110': 'X25519',
  '1.3.101.111': 'X448',
  '1.3.101.112': 'Ed25519',
  '1.3.101.113': 'Ed448',
};

const CURVE_OIDS: Record<string, string> = {
  '1.2.840.10045.3.1.1': 'secp192r1 (P-192)',
  '1.2.840.10045.3.1.7': 'prime256v1 (P-256)',
  '1.3.132.0.10': 'secp256k1',
  '1.3.132.0.33': 'secp224r1 (P-224)',
  '1.3.132.0.34': 'secp384r1 (P-384)',
  '1.3.132.0.35': 'secp521r1 (P-521)',
};

const EXTENSION_OIDS: Record<string, string> = {
  '2.5.29.19': 'basicConstraints',
  '2.5.29.17': 'subjectAltName',
  '2.5.29.18': 'issuerAltName',
  '2.5.29.15': 'keyUsage',
  '2.5.29.14': 'subjectKeyIdentifier',
  '2.5.29.35': 'authorityKeyIdentifier',
  '2.5.29.31': 'cRLDistributionPoints',
  '2.5.29.37': 'extKeyUsage',
  '1.3.6.1.5.5.7.1.1': 'authorityInfoAccess',
  '1.3.6.1.4.1.11129.2.4.2': 'signedCertificateTimestampList',
};

const EXTENDED_KEY_USAGE_OIDS: Record<string, string> = {
  '1.3.6.1.5.5.7.3.1': 'serverAuth',
  '1.3.6.1.5.5.7.3.2': 'clientAuth',
  '1.3.6.1.5.5.7.3.3': 'codeSigning',
  '1.3.6.1.5.5.7.3.4': 'emailProtection',
  '1.3.6.1.5.5.7.3.8': 'timeStamping',
  '1.3.6.1.5.5.7.3.9': 'OCSPSigning',
};

const GENERAL_NAME_TYPES: Record<number, { label: string; decode: (value: string) => string }> = {
  1: { label: 'Email', decode: value => value },
  2: { label: 'DNS', decode: value => value },
  6: { label: 'URI', decode: value => value },
  7: { label: 'IP', decode: value => Array.from(value, ch => ch.charCodeAt(0)).join('.') },
  4: { label: 'DirName', decode: () => '(directory name)' },
  8: { label: 'RID', decode: () => '(registered id)' },
};

/** forge types .value as string | Asn1[]; narrow to the constructed shape. */
function asChildren(value: unknown): asn1.Asn1[] {
  return (value ?? []) as unknown as asn1.Asn1[];
}

function isUniversal(node: asn1.Asn1, tag: number): boolean {
  return node.tagClass === asn1.Class.UNIVERSAL && node.type === tag;
}

function primitiveValue(node: asn1.Asn1 | undefined): string {
  return typeof node?.value === 'string' ? node.value : '';
}

/** forge may swap a BIT STRING's .value for a composed [asn1] array when its
 *  content parses as ASN.1; the raw bytes always live in bitStringContents. */
function bitStringValue(node: asn1.Asn1 | undefined): string {
  // bitStringContents exists at runtime but is missing from forge's type defs
  const raw = (node as unknown as { bitStringContents?: string } | undefined)?.bitStringContents
    ?? primitiveValue(node);
  return raw.slice(1); // drop the leading unused-bits octet
}

/** forge's fromDer keeps OBJECT IDENTIFIER values as raw DER bytes; expand
 *  them to dotted notation (first byte = 40·x+y, rest base-128). */
function decodeOid(node: asn1.Asn1 | undefined): string {
  const bytes = primitiveValue(node);
  if (!bytes) {
    return '';
  }
  const parts: number[] = [];
  const first = bytes.charCodeAt(0);
  parts.push(Math.floor(first / 40), first % 40);
  let pending = 0;
  for (const ch of bytes.slice(1)) {
    pending = (pending << 7) | (ch.charCodeAt(0) & 0x7F);
    if ((ch.charCodeAt(0) & 0x80) === 0) {
      parts.push(pending);
      pending = 0;
    }
  }
  return parts.join('.');
}

function hex(bytes: string, separator = ':'): string {
  return Array.from(bytes, ch => ch.charCodeAt(0).toString(16).padStart(2, '0')).join(separator).toUpperCase();
}

function toIso(date: Date): string {
  return `${date.toISOString().replace('T', ' ').replace(/\..+/, '')} UTC`;
}

function parseTime(node: asn1.Asn1): Date {
  const raw = primitiveValue(node);
  // UTCTime YYMMDDHHMMSSZ or GeneralizedTime YYYYMMDDHHMMSSZ
  const utcTime = raw.length === 13;
  const year = utcTime
    ? (Number(raw.slice(0, 2)) < 50 ? `20${raw.slice(0, 2)}` : `19${raw.slice(0, 2)}`)
    : raw.slice(0, 4);
  const rest = utcTime ? raw.slice(2) : raw.slice(4);
  return new Date(`${year}-${rest.slice(0, 2)}-${rest.slice(2, 4)}T${rest.slice(4, 6)}:${rest.slice(6, 8)}:${rest.slice(8, 10) || '00'}Z`);
}

function walkDn(nameNode: asn1.Asn1 | undefined): CertificateRow[] {
  const rows: CertificateRow[] = [];
  const rdns = (nameNode?.value ?? []) as unknown as asn1.Asn1[];
  for (const rdnSet of rdns) {
    for (const attr of (rdnSet.value ?? []) as unknown as asn1.Asn1[]) {
      const [oidNode, valueNode] = (attr.value ?? []) as asn1.Asn1[];
      const oid = decodeOid(oidNode);
      rows.push({ label: DN_OIDS[oid] ?? oid, value: primitiveValue(valueNode) });
    }
  }
  return rows;
}

function describeAlgorithmIdentifier(node: asn1.Asn1 | undefined, table: Record<string, string>): { oid: string; name: string } {
  const oid = decodeOid(node?.value?.[0] as asn1.Asn1 | undefined);
  return { oid, name: table[oid] ?? oid };
}

function describePublicKey(spkiNode: asn1.Asn1 | undefined): CertificateRow[] {
  const rows: CertificateRow[] = [];
  const [algorithmNode, keyNode] = (spkiNode?.value ?? []) as asn1.Asn1[];
  const { oid: algOid, name: algName } = describeAlgorithmIdentifier(algorithmNode, PUBLIC_KEY_ALGORITHM_OIDS);
  rows.push({ label: 'Algorithm', value: algName, hint: algOid });

  const keyBytes = bitStringValue(keyNode);
  const algParams = (algorithmNode?.value ?? [])[1] as asn1.Asn1 | undefined;

  if (algOid === '1.2.840.113549.1.1.1') {
    try {
      const rsa = asn1.fromDer(keyBytes);
      const [modulus, exponent] = asChildren(rsa.value);
      const modBytes = primitiveValue(modulus);
      const leadingZero = modBytes.charCodeAt(0) === 0 ? 1 : 0;
      rows.push({ label: 'Key size', value: `${(modBytes.length - leadingZero) * 8} bits` });
      const expBytes = primitiveValue(exponent);
      const exponentValue = Array.from(expBytes, ch => ch.charCodeAt(0)).reduce((acc, byte) => acc * 256 + byte, 0);
      rows.push({ label: 'Exponent', value: exponentValue.toString() });
    }
    catch {
      rows.push({ label: 'Key size', value: 'unparseable modulus' });
    }
    return rows;
  }

  if (algOid === '1.2.840.10045.2.1') {
    const curveOid = decodeOid(algParams);
    rows.push({ label: 'Curve', value: CURVE_OIDS[curveOid] ?? curveOid, hint: curveOid });
    rows.push({ label: 'Key size', value: `${keyBytes.charCodeAt(0) === 4 ? ((keyBytes.length - 1) / 2) * 8 : keyBytes.length * 8} bits` });
    rows.push({ label: 'Public key', value: hex(keyBytes) });
    return rows;
  }

  rows.push({ label: 'Key size', value: `${keyBytes.length * 8} bits` });
  rows.push({ label: 'Public key', value: hex(keyBytes) });
  return rows;
}

function describeExtension(extension: asn1.Asn1): CertificateRow {
  const children = (extension.value ?? []) as asn1.Asn1[];
  const [oidNode] = children;
  // critical BOOLEAN is optional and only present between OID and value
  const criticalNode = isUniversal(children[1], asn1.Type.BOOLEAN) ? children[1] : undefined;
  const valueNode = criticalNode ? children[2] : children[1];
  const oid = decodeOid(oidNode);
  const name = EXTENSION_OIDS[oid] ?? oid;
  const critical = criticalNode !== undefined && primitiveValue(criticalNode).charCodeAt(0) !== 0;
  const raw = primitiveValue(valueNode);
  const label = critical ? `${name} (critical)` : name;

  try {
    if (oid === '2.5.29.19') {
      const bc = asn1.fromDer(raw);
      const bcChildren = asChildren(bc.value);
      const isCa = bcChildren[0] ? primitiveValue(bcChildren[0]).charCodeAt(0) !== 0 : false;
      const pathLenNode = bcChildren[1];
      const pathLen = pathLenNode ? Array.from(primitiveValue(pathLenNode), ch => ch.charCodeAt(0)).reduce((acc, b) => acc * 256 + b, 0) : undefined;
      return { label, value: `CA: ${isCa}${pathLen !== undefined ? `, pathLen: ${pathLen}` : ''}` };
    }
    if (oid === '2.5.29.17' || oid === '2.5.29.18') {
      const names = asn1.fromDer(raw);
      const parts = asChildren(names.value).map((generalName) => {
        const meta = GENERAL_NAME_TYPES[generalName.type];
        return meta ? `${meta.label}: ${meta.decode(primitiveValue(generalName))}` : `type${generalName.type}`;
      });
      return { label, value: parts.join(', ') || '(empty)' };
    }
    if (oid === '2.5.29.15') {
      const bytes = bitStringValue(asn1.fromDer(raw));
      const byte0 = bytes.charCodeAt(0) ?? 0;
      const flags = ['digitalSignature', 'nonRepudiation', 'keyEncipherment', 'dataEncipherment', 'keyAgreement', 'keyCertSign', 'cRLSign', 'encipherOnly'];
      const active = flags.filter((_, index) => byte0 & (0b1000_0000 >> index));
      return { label, value: active.join(', ') || '(none)' };
    }
    if (oid === '2.5.29.37') {
      const usages = asn1.fromDer(raw);
      const parts = asChildren(usages.value).map(node => EXTENDED_KEY_USAGE_OIDS[decodeOid(node)] ?? decodeOid(node));
      return { label, value: parts.join(', ') };
    }
    if (oid === '2.5.29.14' || oid === '2.5.29.35') {
      const first = asChildren(asn1.fromDer(raw).value)[0];
      const value = isUniversal(first, asn1.Type.OCTETSTRING) ? primitiveValue(first) : raw;
      return { label, value: hex(value) };
    }
  }
  catch {
    // fall through to hex display
  }
  return { label, value: hex(raw) };
}

function fingerprintHex(der: string, algorithm: 'sha1' | 'sha256'): string {
  const digest = forgeMd.algorithms[algorithm].create();
  digest.update(der);
  const hexDigest = digest.digest().toHex();
  return hexDigest.match(/.{2}/g)!.join(':').toUpperCase();
}

export function decodeCertificatePem(pem: string): DecodedCertificate {
  const trimmed = pem.trim();
  if (!trimmed) {
    throw new Error('Paste a PEM certificate to decode');
  }

  const messages = forgePem.decode(trimmed);
  const certificateMessage = messages.find(message => message.type === 'CERTIFICATE');
  if (!certificateMessage) {
    throw new Error('No CERTIFICATE block found (this tool decodes certificates, not keys)');
  }

  const root = asn1.fromDer(certificateMessage.body);
  if (root.type !== asn1.Type.SEQUENCE || !(Array.isArray(root.value)) || root.value.length < 3) {
    throw new Error('Input is not a valid X.509 certificate');
  }

  const [tbsNode, outerSignatureNode] = asChildren(root.value);
  if (tbsNode.type !== asn1.Type.SEQUENCE) {
    throw new Error('Input is not a valid X.509 certificate');
  }

  let cursor = 0;
  let versionRow: CertificateRow = { label: 'Version', value: '1 (implicit)' };
  const versionNode = asChildren(tbsNode.value)[0];
  if (versionNode && versionNode.tagClass === asn1.Class.CONTEXT_SPECIFIC && versionNode.type === 0) {
    const versionValue = versionNode.value?.[0] ? primitiveValue(asChildren(versionNode.value)[0]).charCodeAt(0) : 0;
    versionRow = { label: 'Version', value: `v${(versionValue ?? 0) + 1}` };
    cursor = 1;
  }

  const tbsChildren = asChildren(tbsNode.value);
  const serialNode = tbsChildren[cursor];
  const tbsSignatureNode = tbsChildren[cursor + 1];
  const issuerNode = tbsChildren[cursor + 2];
  const validityNode = tbsChildren[cursor + 3];
  const subjectNode = tbsChildren[cursor + 4];
  const spkiNode = tbsChildren[cursor + 5];
  const extensionsWrapper = asChildren(tbsNode.value).find(
    node => node.tagClass === asn1.Class.CONTEXT_SPECIFIC && node.type === 3,
  );

  const tbsSignature = describeAlgorithmIdentifier(tbsSignatureNode, SIGNATURE_ALGORITHM_OIDS);
  const outerSignature = describeAlgorithmIdentifier(outerSignatureNode, SIGNATURE_ALGORITHM_OIDS);
  const serialBytes = primitiveValue(serialNode as asn1.Asn1 | undefined);
  const [notBeforeNode, notAfterNode] = asChildren(validityNode?.value);
  const notBefore = parseTime(notBeforeNode);
  const notAfter = parseTime(notAfterNode);

  const extensionRows: CertificateRow[] = asChildren(asChildren(extensionsWrapper?.value)[0]?.value)
    .map(extension => describeExtension(extension));

  const sections: CertificateSection[] = [
    {
      title: 'Certificate',
      rows: [
        versionRow,
        { label: 'Serial number', value: hex(serialBytes) },
        { label: 'Signature algorithm', value: tbsSignature.name, hint: tbsSignature.oid },
        { label: 'Not before', value: toIso(notBefore) },
        { label: 'Not after', value: toIso(notAfter) },
        { label: 'Signature consistency', value: outerSignature.name === tbsSignature.name ? 'outer matches TBS' : `outer: ${outerSignature.name}` },
      ],
    },
    { title: 'Subject', rows: walkDn(subjectNode as asn1.Asn1 | undefined) },
    { title: 'Issuer', rows: walkDn(issuerNode as asn1.Asn1 | undefined) },
    { title: 'Public key', rows: describePublicKey(spkiNode as asn1.Asn1 | undefined) },
    { title: 'Extensions', rows: extensionRows.length > 0 ? extensionRows : [{ label: '(none)', value: '' }] },
    {
      title: 'Fingerprints',
      rows: [
        { label: 'SHA-256', value: fingerprintHex(certificateMessage.body, 'sha256') },
        { label: 'SHA-1', value: fingerprintHex(certificateMessage.body, 'sha1') },
      ],
    },
  ];

  return { sections };
}
