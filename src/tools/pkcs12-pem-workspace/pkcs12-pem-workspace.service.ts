import { CertBag, Certificate, ContentInfo, PFX, SafeContents } from 'pkijs';
import { inspectPem } from '../certificate-inspector/certificate-inspector.service';
import { isUnknownRecord } from '@/utils/worker-protocol';

const CERT_BAG_ID = '1.2.840.113549.1.12.10.1.3';
const KEY_BAG_IDS = new Set(['1.2.840.113549.1.12.10.1.1', '1.2.840.113549.1.12.10.1.2']);
const MAX_BAGS = 128;
const MAX_PEM_BLOCKS = 64;
const ALLOWED_PEM_LABELS = new Set(['CERTIFICATE', 'CERTIFICATE REQUEST', 'NEW CERTIFICATE REQUEST', 'PUBLIC KEY']);

function passwordToBuffer(password: string) {
  const bytes = new Uint8Array(password.length);
  for (let index = 0; index < password.length; index += 1) {
    bytes[index] = password.charCodeAt(index);
  }
  return bytes.buffer;
}

function bytesToPem(label: string, bytes: Uint8Array) {
  let binary = '';
  const chunkSize = 32_768;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  const body = btoa(binary).match(/.{1,64}/gu)?.join('\n') ?? '';
  return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`;
}

function normalizePemBlocks(source: string) {
  const expression = /-----BEGIN ([A-Z0-9 ]+)-----\s*([A-Za-z0-9+/=\s]+?)\s*-----END \1-----/gu;
  const blocks: Array<{ label: string; pem: string }> = [];
  const remainder = source.replace(expression, '').trim();
  expression.lastIndex = 0;
  let match = expression.exec(source);
  while (match !== null) {
    const label = match[1];
    if (!ALLOWED_PEM_LABELS.has(label)) {
      throw new TypeError(`PEM label ${label} is not accepted; private and encrypted key blocks are intentionally excluded.`);
    }
    const base64 = match[2].replace(/\s/gu, '');
    if (!base64 || base64.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(base64)) {
      throw new TypeError(`PEM ${label} body is not canonical Base64.`);
    }
    blocks.push({ label, pem: `-----BEGIN ${label}-----\n${base64.match(/.{1,64}/gu)?.join('\n') ?? ''}\n-----END ${label}-----` });
    if (blocks.length > MAX_PEM_BLOCKS) {
      throw new RangeError(`PEM workspace is limited to ${MAX_PEM_BLOCKS} blocks.`);
    }
    match = expression.exec(source);
  }
  if (blocks.length === 0 || remainder !== '') {
    throw new TypeError('Enter only complete supported PEM blocks without extra content.');
  }
  return blocks;
}

export async function inspectPemWorkspace(source: string) {
  const blocks = normalizePemBlocks(source);
  const inspected = [];
  for (const block of blocks) {
    inspected.push({ label: block.label, ...(await inspectPem(block.pem)) });
  }
  return JSON.stringify({
    format: 'PEM workspace',
    blockCount: blocks.length,
    privateMaterialExported: false,
    blocks: inspected,
    normalizedPemBundle: blocks.map(block => block.pem).join('\n'),
  }, null, 2);
}

export async function inspectPkcs12(bytes: Uint8Array, password: string) {
  const passwordBuffer = passwordToBuffer(password);
  let pfx: PFX;
  try {
    pfx = PFX.fromBER(bytes);
    await pfx.parseInternalValues({ checkIntegrity: true, password: passwordBuffer });
  }
  catch {
    throw new TypeError('PKCS#12 structure, integrity, or password validation failed.');
  }
  const authenticatedSafe = pfx.parsedValue?.authenticatedSafe;
  if (!authenticatedSafe) {
    throw new TypeError('PKCS#12 authenticated safe is missing.');
  }
  if (authenticatedSafe.safeContents.length > 32) {
    throw new RangeError('PKCS#12 contains too many safe-content sections.');
  }
  const safeContentParameters = authenticatedSafe.safeContents.map((content) => {
    if (content.contentType === ContentInfo.DATA) {
      return {};
    }
    if (content.contentType === ContentInfo.ENCRYPTED_DATA) {
      return { password: passwordBuffer };
    }
    throw new TypeError('Public-key-encrypted or unknown PKCS#12 safe contents are not supported.');
  });
  try {
    await authenticatedSafe.parseInternalValues({ safeContents: safeContentParameters });
  }
  catch {
    throw new TypeError('PKCS#12 safe contents could not be decrypted with the supplied password and browser algorithms.');
  }

  const parsedValue: unknown = authenticatedSafe.parsedValue;
  if (!isUnknownRecord(parsedValue) || !Array.isArray(parsedValue.safeContents)) {
    throw new TypeError('PKCS#12 safe contents returned an invalid structure.');
  }
  const certificates = [];
  let privateKeyBagCount = 0;
  let otherBagCount = 0;
  let bagCount = 0;
  for (const rawSafeContent of parsedValue.safeContents) {
    if (!isUnknownRecord(rawSafeContent) || !(rawSafeContent.value instanceof SafeContents)) {
      throw new TypeError('PKCS#12 safe-content inventory is invalid.');
    }
    for (const bag of rawSafeContent.value.safeBags) {
      bagCount += 1;
      if (bagCount > MAX_BAGS) {
        throw new RangeError(`PKCS#12 workspace is limited to ${MAX_BAGS} bags.`);
      }
      if (KEY_BAG_IDS.has(bag.bagId)) {
        privateKeyBagCount += 1;
        continue;
      }
      if (bag.bagId !== CERT_BAG_ID || !(bag.bagValue instanceof CertBag) || !(bag.bagValue.parsedValue instanceof Certificate)) {
        otherBagCount += 1;
        continue;
      }
      const certificateBytes = new Uint8Array(bag.bagValue.parsedValue.toSchema().toBER(false));
      const pem = bytesToPem('CERTIFICATE', certificateBytes);
      certificates.push({ pem, ...(await inspectPem(pem)) });
      if (certificates.length > MAX_PEM_BLOCKS) {
        throw new RangeError(`PKCS#12 workspace is limited to ${MAX_PEM_BLOCKS} certificates.`);
      }
    }
  }
  return JSON.stringify({
    format: 'PKCS#12',
    integrityChecked: true,
    bagCount,
    certificateCount: certificates.length,
    privateKeyBagCount,
    otherBagCount,
    privateMaterialExported: false,
    certificates,
    certificatePemBundle: certificates.map(certificate => certificate.pem).join('\n'),
  }, null, 2);
}
