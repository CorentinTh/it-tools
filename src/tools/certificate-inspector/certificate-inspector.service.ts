export interface CertificateInspection {
  type: 'X.509 certificate' | 'PKCS#10 CSR' | 'SubjectPublicKeyInfo'
  subject?: string
  issuer?: string
  serialNumber?: string
  validFrom?: string
  validTo?: string
  publicKeyAlgorithm: string
  publicKeyDetails?: string
  signatureAlgorithm?: string
  sha256Fingerprint: string
}

interface DerNode {
  tag: number
  start: number
  contentStart: number
  end: number
  children: DerNode[]
}

const MAX_DER_BYTES = 1024 * 1024;
const MAX_DER_NODES = 20_000;
const MAX_DER_DEPTH = 32;
const OIDS: Record<string, string> = {
  '1.2.840.113549.1.1.1': 'RSA',
  '1.2.840.113549.1.1.5': 'SHA-1 with RSA',
  '1.2.840.113549.1.1.11': 'SHA-256 with RSA',
  '1.2.840.113549.1.1.12': 'SHA-384 with RSA',
  '1.2.840.113549.1.1.13': 'SHA-512 with RSA',
  '1.2.840.10045.2.1': 'EC',
  '1.2.840.10045.3.1.7': 'P-256',
  '1.3.132.0.34': 'P-384',
  '1.3.132.0.35': 'P-521',
  '1.2.840.10045.4.3.2': 'ECDSA with SHA-256',
  '1.2.840.10045.4.3.3': 'ECDSA with SHA-384',
  '1.3.101.112': 'Ed25519',
  '2.5.4.3': 'CN',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'ST',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '1.2.840.113549.1.9.1': 'emailAddress',
};

function readLength(bytes: Uint8Array, offset: number): { length: number; offset: number } {
  if (offset >= bytes.length) {
    throw new Error('DER length is truncated.');
  }
  const first = bytes[offset++];
  if ((first & 0x80) === 0) {
    return { length: first, offset };
  }
  const count = first & 0x7F;
  if (count === 0 || count > 4 || offset + count > bytes.length) {
    throw new Error('DER uses an unsupported or truncated length.');
  }
  let length = 0;
  for (let index = 0; index < count; index += 1) {
    length = length * 256 + bytes[offset++];
  }
  return { length, offset };
}

function readNode(bytes: Uint8Array, start: number, depth: number, state: { nodes: number }): DerNode {
  state.nodes += 1;
  if (depth > MAX_DER_DEPTH || state.nodes > MAX_DER_NODES) {
    throw new Error('DER structure exceeds the supported depth or node count.');
  }
  if (start >= bytes.length) {
    throw new Error('DER value is truncated.');
  }
  const tag = bytes[start];
  if ((tag & 0x1F) === 0x1F) {
    throw new Error('High-tag-number DER values are unsupported.');
  }
  const parsedLength = readLength(bytes, start + 1);
  const contentStart = parsedLength.offset;
  const end = contentStart + parsedLength.length;
  if (end > bytes.length) {
    throw new Error('DER value exceeds its input boundary.');
  }
  const children: DerNode[] = [];
  if ((tag & 0x20) !== 0) {
    let offset = contentStart;
    while (offset < end) {
      const child = readNode(bytes, offset, depth + 1, state);
      children.push(child);
      offset = child.end;
    }
    if (offset !== end) {
      throw new Error('DER child boundaries are invalid.');
    }
  }
  return { tag, start, contentStart, end, children };
}

function parseDer(bytes: Uint8Array): DerNode {
  if (bytes.length === 0 || bytes.length > MAX_DER_BYTES) {
    throw new Error('DER input must be between 1 byte and 1 MiB.');
  }
  const root = readNode(bytes, 0, 0, { nodes: 0 });
  if (root.end !== bytes.length) {
    throw new Error('DER input has trailing data.');
  }
  return root;
}

function content(bytes: Uint8Array, node: DerNode): Uint8Array {
  return bytes.subarray(node.contentStart, node.end);
}

function decodeOid(bytes: Uint8Array, node: DerNode): string {
  if (node.tag !== 0x06) {
    throw new Error('Expected an ASN.1 object identifier.');
  }
  const value = content(bytes, node);
  if (value.length === 0) {
    throw new Error('ASN.1 object identifier is empty.');
  }
  const parts = [Math.min(2, Math.floor(value[0] / 40)), value[0] < 80 ? value[0] % 40 : value[0] - 80];
  let current = 0;
  for (let index = 1; index < value.length; index += 1) {
    current = current * 128 + (value[index] & 0x7F);
    if ((value[index] & 0x80) === 0) {
      parts.push(current);
      current = 0;
    }
  }
  if ((value[value.length - 1] & 0x80) !== 0) {
    throw new Error('ASN.1 object identifier is truncated.');
  }
  return parts.join('.');
}

function oidName(oid: string): string {
  return OIDS[oid] ?? oid;
}

function decodeString(bytes: Uint8Array, node: DerNode): string {
  const value = content(bytes, node);
  if (node.tag === 0x1E) {
    if (value.length % 2 !== 0) {
      throw new Error('BMPString has an odd byte length.');
    }
    return Array.from({ length: value.length / 2 }, (_, index) => String.fromCharCode(value[index * 2] * 256 + value[index * 2 + 1])).join('');
  }
  return new TextDecoder(node.tag === 0x0C ? 'utf-8' : 'latin1', { fatal: false }).decode(value);
}

function decodeName(bytes: Uint8Array, node: DerNode): string {
  const attributes: string[] = [];
  for (const set of node.children) {
    for (const sequence of set.children) {
      if (sequence.children.length < 2) {
        continue;
      }
      const oid = decodeOid(bytes, sequence.children[0]);
      attributes.push(`${oidName(oid)}=${decodeString(bytes, sequence.children[1])}`);
    }
  }
  return attributes.join(', ');
}

function decodeTime(bytes: Uint8Array, node: DerNode): string {
  const value = new TextDecoder('ascii').decode(content(bytes, node));
  const match = node.tag === 0x17
    ? value.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/)
    : value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/);
  if (!match) {
    throw new Error('Certificate time uses an unsupported format.');
  }
  const year = node.tag === 0x17 ? (Number(match[1]) >= 50 ? 1900 : 2000) + Number(match[1]) : Number(match[1]);
  const shift = node.tag === 0x17 ? 0 : 0;
  const monthIndex = 2 + shift;
  return new Date(Date.UTC(year, Number(match[monthIndex]) - 1, Number(match[monthIndex + 1]), Number(match[monthIndex + 2]), Number(match[monthIndex + 3]), Number(match[monthIndex + 4] ?? 0))).toISOString();
}

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function algorithm(bytes: Uint8Array, node: DerNode): string {
  const oidNode = node.children[0];
  return oidNode ? oidName(decodeOid(bytes, oidNode)) : 'Unknown';
}

function publicKeyInfo(bytes: Uint8Array, node: DerNode): { algorithm: string; details?: string } {
  if (node.tag !== 0x30 || node.children.length < 2) {
    throw new Error('SubjectPublicKeyInfo is invalid.');
  }
  const algorithmNode = node.children[0];
  const algorithmOid = decodeOid(bytes, algorithmNode.children[0]);
  const name = oidName(algorithmOid);
  if (algorithmOid === '1.2.840.113549.1.1.1') {
    const bitString = content(bytes, node.children[1]);
    if (bitString[0] !== 0) {
      throw new Error('RSA public key bit string is invalid.');
    }
    const rsaBytes = bitString.subarray(1);
    const rsa = parseDer(rsaBytes);
    const modulus = content(rsaBytes, rsa.children[0]);
    const leading = modulus[0] === 0 ? 1 : 0;
    const first = modulus[leading] ?? 0;
    const bits = (modulus.length - leading - 1) * 8 + (first === 0 ? 0 : 32 - Math.clz32(first));
    return { algorithm: name, details: `${bits}-bit modulus` };
  }
  if (algorithmOid === '1.2.840.10045.2.1' && algorithmNode.children[1]) {
    return {
      algorithm: name,
      details: algorithmNode.children[1].tag === 0x06
        ? oidName(decodeOid(bytes, algorithmNode.children[1]))
        : 'Explicit EC parameters',
    };
  }
  return { algorithm: name };
}

function pemToDer(source: string): { label: string; bytes: Uint8Array } {
  const match = source.trim().match(/^-----BEGIN ([A-Z0-9 ]+)-----\s*([A-Za-z0-9+/=\s]+?)\s*-----END \1-----$/);
  if (!match) {
    throw new Error('Enter one PEM certificate, CSR, or public key block.');
  }
  if (!['CERTIFICATE', 'CERTIFICATE REQUEST', 'NEW CERTIFICATE REQUEST', 'PUBLIC KEY'].includes(match[1])) {
    throw new Error('Only certificates, CSRs, and public keys are accepted; private keys are intentionally rejected.');
  }
  const binary = atob(match[2].replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
  if (bytes.length > MAX_DER_BYTES) {
    throw new Error('PEM payload is limited to 1 MiB.');
  }
  return { label: match[1], bytes };
}

async function fingerprint(bytes: Uint8Array): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
  return hex(digest).match(/.{2}/g)?.join(':').toUpperCase() ?? '';
}

export async function inspectPem(source: string): Promise<CertificateInspection> {
  const pem = pemToDer(source);
  const root = parseDer(pem.bytes);
  const sha256Fingerprint = await fingerprint(pem.bytes);
  if (pem.label === 'PUBLIC KEY') {
    const key = publicKeyInfo(pem.bytes, root);
    return { type: 'SubjectPublicKeyInfo', publicKeyAlgorithm: key.algorithm, publicKeyDetails: key.details, sha256Fingerprint };
  }
  if (root.tag !== 0x30 || root.children.length < 3) {
    throw new Error('Certificate or CSR root structure is invalid.');
  }
  if (pem.label.includes('CERTIFICATE REQUEST')) {
    const request = root.children[0];
    if (request.children.length < 3) {
      throw new Error('CSR request-info structure is invalid.');
    }
    const key = publicKeyInfo(pem.bytes, request.children[2]);
    return {
      type: 'PKCS#10 CSR',
      subject: decodeName(pem.bytes, request.children[1]),
      publicKeyAlgorithm: key.algorithm,
      publicKeyDetails: key.details,
      signatureAlgorithm: algorithm(pem.bytes, root.children[1]),
      sha256Fingerprint,
    };
  }
  const tbs = root.children[0];
  const offset = tbs.children[0]?.tag === 0xA0 ? 1 : 0;
  if (tbs.children.length < offset + 6) {
    throw new Error('Certificate TBSCertificate structure is invalid.');
  }
  const validity = tbs.children[offset + 3];
  const key = publicKeyInfo(pem.bytes, tbs.children[offset + 5]);
  return {
    type: 'X.509 certificate',
    serialNumber: hex(content(pem.bytes, tbs.children[offset])).toUpperCase(),
    issuer: decodeName(pem.bytes, tbs.children[offset + 2]),
    validFrom: decodeTime(pem.bytes, validity.children[0]),
    validTo: decodeTime(pem.bytes, validity.children[1]),
    subject: decodeName(pem.bytes, tbs.children[offset + 4]),
    publicKeyAlgorithm: key.algorithm,
    publicKeyDetails: key.details,
    signatureAlgorithm: algorithm(pem.bytes, root.children[1]),
    sha256Fingerprint,
  };
}
