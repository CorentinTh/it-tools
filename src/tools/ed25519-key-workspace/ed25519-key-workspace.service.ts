import type { Ed25519KeyPair } from './ed25519-key-workspace.worker.protocol';
import { parseEd25519Comment } from './ed25519-key-workspace.worker.protocol';

const ED25519_SPKI_PREFIX = new Uint8Array([0x30, 0x2A, 0x30, 0x05, 0x06, 0x03, 0x2B, 0x65, 0x70, 0x03, 0x21, 0x00]);

export interface Ed25519Dependencies {
  generateKey?: () => Promise<CryptoKeyPair>
  exportKey?: (format: 'spki' | 'pkcs8', key: CryptoKey) => Promise<ArrayBuffer>
  digest?: (data: Uint8Array) => Promise<ArrayBuffer>
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 32_768) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32_768));
  }
  return globalThis.btoa(binary);
}

function toPem(label: 'PUBLIC KEY' | 'PRIVATE KEY', bytes: Uint8Array): string {
  const lines = toBase64(bytes).match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----\n`;
}

function uint32(value: number): Uint8Array {
  return new Uint8Array([(value >>> 24) & 0xFF, (value >>> 16) & 0xFF, (value >>> 8) & 0xFF, value & 0xFF]);
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

export function extractRawEd25519PublicKey(spki: Uint8Array): Uint8Array {
  if (spki.length !== ED25519_SPKI_PREFIX.length + 32
    || !ED25519_SPKI_PREFIX.every((byte, index) => spki[index] === byte)) {
    throw new Error('Unexpected Ed25519 SPKI structure.');
  }
  return spki.slice(ED25519_SPKI_PREFIX.length);
}

export function createOpenSshBlob(rawPublicKey: Uint8Array): Uint8Array {
  if (rawPublicKey.length !== 32) {
    throw new Error('An Ed25519 public key must contain exactly 32 bytes.');
  }
  const type = new TextEncoder().encode('ssh-ed25519');
  return concat(uint32(type.length), type, uint32(rawPublicKey.length), rawPublicKey);
}

async function generateWebCryptoKey(): Promise<CryptoKeyPair> {
  if (!globalThis.crypto?.subtle) {
    throw new DOMException('Web Crypto is unavailable.', 'NotSupportedError');
  }
  const key = await globalThis.crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
  if (!('publicKey' in key && 'privateKey' in key)) {
    throw new Error('Web Crypto returned a single key.');
  }
  return key;
}

export async function generateEd25519KeyPair(
  commentInput: unknown,
  dependencies: Ed25519Dependencies = {},
): Promise<Ed25519KeyPair> {
  const comment = parseEd25519Comment(commentInput);
  const generateKey = dependencies.generateKey ?? generateWebCryptoKey;
  const exportKey = dependencies.exportKey ?? ((format, key) => globalThis.crypto.subtle.exportKey(format, key));
  const digest = dependencies.digest ?? (data => globalThis.crypto.subtle.digest('SHA-256', data));
  const pair = await generateKey();
  const [spkiBuffer, pkcs8Buffer] = await Promise.all([
    exportKey('spki', pair.publicKey),
    exportKey('pkcs8', pair.privateKey),
  ]);
  const spki = new Uint8Array(spkiBuffer);
  const rawPublicKey = extractRawEd25519PublicKey(spki);
  const sshBlob = createOpenSshBlob(rawPublicKey);
  const fingerprint = toBase64(new Uint8Array(await digest(sshBlob))).replace(/=+$/u, '');
  const commentSuffix = comment ? ` ${comment}` : '';
  return {
    publicKeyPem: toPem('PUBLIC KEY', spki),
    privateKeyPem: toPem('PRIVATE KEY', new Uint8Array(pkcs8Buffer)),
    openSshPublicKey: `ssh-ed25519 ${toBase64(sshBlob)}${commentSuffix}`,
    fingerprint: `SHA256:${fingerprint}`,
  };
}
