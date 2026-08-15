import { type RsaKeyPair, type RsaKeySize, parseRsaKeySize } from './rsa-key-pair-generator.worker.protocol';

export interface RsaGenerationDependencies {
  generateKey?: (bits: RsaKeySize) => Promise<CryptoKeyPair>
  exportKey?: (format: 'spki' | 'pkcs8', key: CryptoKey) => Promise<ArrayBuffer>
}

function isCryptoKeyPair(value: CryptoKey | CryptoKeyPair): value is CryptoKeyPair {
  return 'publicKey' in value && 'privateKey' in value;
}

export function createRsaAlgorithm(bits: RsaKeySize): RsaHashedKeyGenParams {
  return {
    name: 'RSA-OAEP',
    modulusLength: bits,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: 'SHA-256',
  };
}

async function generateCryptoKeyPair(bits: RsaKeySize): Promise<CryptoKeyPair> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is unavailable.');
  }

  const key = await globalThis.crypto.subtle.generateKey(
    createRsaAlgorithm(bits),
    true,
    ['encrypt', 'decrypt'],
  );
  if (!isCryptoKeyPair(key)) {
    throw new Error('Web Crypto returned a single key instead of an RSA key pair.');
  }

  return key;
}

async function exportCryptoKey(format: 'spki' | 'pkcs8', key: CryptoKey): Promise<ArrayBuffer> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is unavailable.');
  }

  return globalThis.crypto.subtle.exportKey(format, key);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 32_768;
  let binary = '';

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return globalThis.btoa(binary);
}

function derToPem(label: 'PUBLIC KEY' | 'PRIVATE KEY', buffer: ArrayBuffer): string {
  const base64 = arrayBufferToBase64(buffer);
  const lines = base64.match(/.{1,64}/g) ?? [];

  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----\n`;
}

export async function generateKeyPair(
  bitsInput: unknown,
  dependencies: RsaGenerationDependencies = {},
): Promise<RsaKeyPair> {
  const bits = parseRsaKeySize(bitsInput);
  const generateKey = dependencies.generateKey ?? generateCryptoKeyPair;
  const exportKey = dependencies.exportKey ?? exportCryptoKey;
  const keyPair = await generateKey(bits);
  const [publicKey, privateKey] = await Promise.all([
    exportKey('spki', keyPair.publicKey),
    exportKey('pkcs8', keyPair.privateKey),
  ]);

  return {
    bits,
    publicKeyPem: derToPem('PUBLIC KEY', publicKey),
    privateKeyPem: derToPem('PRIVATE KEY', privateKey),
  };
}
