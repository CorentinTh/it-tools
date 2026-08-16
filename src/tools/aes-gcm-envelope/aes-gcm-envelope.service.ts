import { Base64 } from 'js-base64';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

export type AesEnvelopeKind = 'text' | 'file';

export interface AesEnvelopePlaintext {
  kind: AesEnvelopeKind
  payload: Uint8Array
  fileName?: string
  mimeType?: string
}

export interface AesEnvelopeHeader {
  iterations: number
  ciphertextLength: number
  salt: Uint8Array
  iv: Uint8Array
}

export interface AesEnvelopeCrypto {
  subtle: Pick<SubtleCrypto, 'importKey' | 'deriveKey' | 'encrypt' | 'decrypt'>
  randomBytes: (length: number) => Uint8Array
}

export const AES_ENVELOPE_ITERATIONS = 600_000;
export const AES_ENVELOPE_MAX_TEXT_BYTES = 1024 * 1024;
export const AES_ENVELOPE_MAX_FILE_BYTES = 32 * 1024 * 1024;
export const AES_ENVELOPE_MAX_BYTES = AES_ENVELOPE_MAX_FILE_BYTES + 1024;
export const AES_ENVELOPE_MAX_BASE64_CHARACTERS = Math.ceil((AES_ENVELOPE_MAX_TEXT_BYTES + 1024) / 3) * 4;
export const AES_ENVELOPE_HEADER_BYTES = 44;
const AES_ENVELOPE_TAG_BYTES = 16;
const AES_ENVELOPE_PLAINTEXT_HEADER_BYTES = 12;
const MIN_DECRYPT_ITERATIONS = 100_000;
const MAX_DECRYPT_ITERATIONS = 1_000_000;
const MAGIC = [0x49, 0x54, 0x41, 0x45] as const; // ITAE
const VERSION = 1;
const KDF_PBKDF2_SHA256 = 1;
const CIPHER_AES_256_GCM = 1;
const textEncoder = new TextEncoder();
const strictTextDecoder = new TextDecoder('utf-8', { fatal: true });

function defaultCrypto(): AesEnvelopeCrypto {
  if (!globalThis.crypto?.subtle || typeof globalThis.crypto.getRandomValues !== 'function') {
    throw new TypeError('Web Crypto AES-GCM and PBKDF2 are not available in this browser.');
  }
  return {
    subtle: globalThis.crypto.subtle,
    randomBytes: (length) => {
      const output = new Uint8Array(length);
      globalThis.crypto.getRandomValues(output);
      return output;
    },
  };
}

function validatePassphrase(passphrase: string): Uint8Array {
  if (Array.from(passphrase).length < 12 || exceedsUtf8ByteLimit(passphrase, 1024)) {
    throw new RangeError('Passphrases must contain 12 or more Unicode characters and at most 1024 UTF-8 bytes.');
  }
  return textEncoder.encode(passphrase);
}

function hasUnsafeFileNameCharacter(value: string): boolean {
  return [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1F || code === 0x7F || character === '/' || character === '\\';
  });
}

function validateFileName(fileName: string): Uint8Array {
  const encoded = textEncoder.encode(fileName);
  if (!fileName || encoded.byteLength > 255 || hasUnsafeFileNameCharacter(fileName) || fileName === '.' || fileName === '..') {
    throw new TypeError('File names must be 1–255 UTF-8 bytes without paths or control characters.');
  }
  return encoded;
}

function validateMimeType(mimeType: string): Uint8Array {
  const selected = mimeType || 'application/octet-stream';
  const encoded = textEncoder.encode(selected);
  if (encoded.byteLength > 127 || !/^[\x20-\x7E]+$/u.test(selected)) {
    throw new TypeError('File media types must be printable ASCII up to 127 bytes.');
  }
  return encoded;
}

function concatenate(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.byteLength, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.byteLength;
  }
  return output;
}

function encodePlaintext(input: AesEnvelopePlaintext): Uint8Array {
  if (input.payload.byteLength > (input.kind === 'text' ? AES_ENVELOPE_MAX_TEXT_BYTES : AES_ENVELOPE_MAX_FILE_BYTES)) {
    throw new RangeError(input.kind === 'text' ? 'Text is limited to 1 MiB of UTF-8 data.' : 'Files are limited to 32 MiB.');
  }
  const name = input.kind === 'file' ? validateFileName(input.fileName ?? '') : new Uint8Array();
  const mime = input.kind === 'file' ? validateMimeType(input.mimeType ?? '') : new Uint8Array();
  const header = new Uint8Array(AES_ENVELOPE_PLAINTEXT_HEADER_BYTES);
  const view = new DataView(header.buffer);
  header[0] = input.kind === 'text' ? 0 : 1;
  view.setUint16(4, name.byteLength, false);
  view.setUint16(6, mime.byteLength, false);
  view.setUint32(8, input.payload.byteLength, false);
  return concatenate([header, name, mime, input.payload]);
}

function decodePlaintext(bytes: Uint8Array): AesEnvelopePlaintext {
  if (bytes.byteLength < AES_ENVELOPE_PLAINTEXT_HEADER_BYTES) {
    throw new TypeError('The authenticated envelope payload is truncated.');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const kindByte = bytes[0];
  if ((kindByte !== 0 && kindByte !== 1) || bytes[1] !== 0 || bytes[2] !== 0 || bytes[3] !== 0) {
    throw new TypeError('The authenticated envelope payload type is invalid.');
  }
  const nameLength = view.getUint16(4, false);
  const mimeLength = view.getUint16(6, false);
  const payloadLength = view.getUint32(8, false);
  const expectedLength = AES_ENVELOPE_PLAINTEXT_HEADER_BYTES + nameLength + mimeLength + payloadLength;
  if (expectedLength !== bytes.byteLength || payloadLength > (kindByte === 0 ? AES_ENVELOPE_MAX_TEXT_BYTES : AES_ENVELOPE_MAX_FILE_BYTES)) {
    throw new TypeError('The authenticated envelope payload length is invalid.');
  }
  const nameStart = AES_ENVELOPE_PLAINTEXT_HEADER_BYTES;
  const mimeStart = nameStart + nameLength;
  const payloadStart = mimeStart + mimeLength;
  if (kindByte === 0) {
    if (nameLength !== 0 || mimeLength !== 0) {
      throw new TypeError('Text envelopes cannot contain file metadata.');
    }
    return { kind: 'text', payload: bytes.slice(payloadStart) };
  }
  let fileName: string;
  let mimeType: string;
  try {
    fileName = strictTextDecoder.decode(bytes.subarray(nameStart, mimeStart));
    mimeType = strictTextDecoder.decode(bytes.subarray(mimeStart, payloadStart));
  }
  catch {
    throw new TypeError('The authenticated file metadata is not valid UTF-8.');
  }
  validateFileName(fileName);
  validateMimeType(mimeType);
  return { kind: 'file', fileName, mimeType, payload: bytes.slice(payloadStart) };
}

function createHeader(salt: Uint8Array, iv: Uint8Array, ciphertextLength: number): Uint8Array {
  if (salt.byteLength !== 16 || iv.byteLength !== 12 || !Number.isSafeInteger(ciphertextLength) || ciphertextLength < AES_ENVELOPE_TAG_BYTES || ciphertextLength > AES_ENVELOPE_MAX_BYTES) {
    throw new TypeError('The AES-GCM envelope parameters are invalid.');
  }
  const header = new Uint8Array(AES_ENVELOPE_HEADER_BYTES);
  header.set(MAGIC, 0);
  header[4] = VERSION;
  header[5] = KDF_PBKDF2_SHA256;
  header[6] = CIPHER_AES_256_GCM;
  new DataView(header.buffer).setUint32(8, AES_ENVELOPE_ITERATIONS, false);
  header.set(salt, 12);
  header.set(iv, 28);
  new DataView(header.buffer).setUint32(40, ciphertextLength, false);
  return header;
}

export function parseAesEnvelopeHeader(envelope: Uint8Array): AesEnvelopeHeader {
  if (envelope.byteLength < AES_ENVELOPE_HEADER_BYTES + AES_ENVELOPE_TAG_BYTES || envelope.byteLength > AES_ENVELOPE_MAX_BYTES) {
    throw new TypeError('The AES-GCM envelope size is invalid.');
  }
  if (!MAGIC.every((value, index) => envelope[index] === value)
    || envelope[4] !== VERSION || envelope[5] !== KDF_PBKDF2_SHA256
    || envelope[6] !== CIPHER_AES_256_GCM || envelope[7] !== 0) {
    throw new TypeError('The AES-GCM envelope magic, version, or algorithms are unsupported.');
  }
  const view = new DataView(envelope.buffer, envelope.byteOffset, envelope.byteLength);
  const iterations = view.getUint32(8, false);
  const ciphertextLength = view.getUint32(40, false);
  if (iterations < MIN_DECRYPT_ITERATIONS || iterations > MAX_DECRYPT_ITERATIONS
    || ciphertextLength !== envelope.byteLength - AES_ENVELOPE_HEADER_BYTES) {
    throw new TypeError('The AES-GCM envelope KDF or length parameters are invalid.');
  }
  return {
    iterations,
    ciphertextLength,
    salt: envelope.slice(12, 28),
    iv: envelope.slice(28, 40),
  };
}

async function deriveKey(passphrase: Uint8Array, salt: Uint8Array, iterations: number, usage: 'encrypt' | 'decrypt', crypto: AesEnvelopeCrypto): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey('raw', passphrase, 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    [usage],
  );
}

export async function encryptAesEnvelope(input: AesEnvelopePlaintext, passphrase: string, dependencies?: AesEnvelopeCrypto): Promise<Uint8Array> {
  const crypto = dependencies ?? defaultCrypto();
  const passwordBytes = validatePassphrase(passphrase);
  const plaintext = encodePlaintext(input);
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const header = createHeader(salt, iv, plaintext.byteLength + AES_ENVELOPE_TAG_BYTES);
  const key = await deriveKey(passwordBytes, salt, AES_ENVELOPE_ITERATIONS, 'encrypt', crypto);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: header, tagLength: 128 },
    key,
    plaintext,
  ));
  if (encrypted.byteLength !== plaintext.byteLength + AES_ENVELOPE_TAG_BYTES) {
    throw new Error('Web Crypto returned an unexpected AES-GCM output length.');
  }
  return concatenate([header, encrypted]);
}

export async function decryptAesEnvelope(envelope: Uint8Array, passphrase: string, dependencies?: AesEnvelopeCrypto): Promise<AesEnvelopePlaintext> {
  const crypto = dependencies ?? defaultCrypto();
  const passwordBytes = validatePassphrase(passphrase);
  const parsed = parseAesEnvelopeHeader(envelope);
  const header = envelope.subarray(0, AES_ENVELOPE_HEADER_BYTES);
  const key = await deriveKey(passwordBytes, parsed.salt, parsed.iterations, 'decrypt', crypto);
  let decrypted: ArrayBuffer;
  try {
    decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: parsed.iv, additionalData: header, tagLength: 128 },
      key,
      envelope.subarray(AES_ENVELOPE_HEADER_BYTES),
    );
  }
  catch {
    throw new Error('Authentication failed: the passphrase is wrong or the envelope was modified.');
  }
  return decodePlaintext(new Uint8Array(decrypted));
}

export function encodeAesEnvelopeBase64(envelope: Uint8Array): string {
  if (envelope.byteLength > AES_ENVELOPE_MAX_TEXT_BYTES + 1024) {
    throw new RangeError('Base64 display is limited to text envelopes up to 1 MiB.');
  }
  return Base64.fromUint8Array(envelope);
}

export function decodeAesEnvelopeBase64(source: string): Uint8Array {
  const normalized = source.trim().replace(/\s+/gu, '');
  if (!normalized || normalized.length > AES_ENVELOPE_MAX_BASE64_CHARACTERS
    || !/^[A-Za-z0-9+/]*={0,2}$/u.test(normalized) || normalized.length % 4 === 1) {
    throw new TypeError('Enter canonical standard Base64 for an ITAE text envelope.');
  }
  try {
    const bytes = Base64.toUint8Array(normalized);
    if (Base64.fromUint8Array(bytes) !== normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')) {
      throw new TypeError('Invalid Base64.');
    }
    return bytes;
  }
  catch {
    throw new TypeError('Enter canonical standard Base64 for an ITAE text envelope.');
  }
}

export function utf8TextPayload(source: string): Uint8Array {
  if (exceedsUtf8ByteLimit(source, AES_ENVELOPE_MAX_TEXT_BYTES)) {
    throw new RangeError('Text is limited to 1 MiB of UTF-8 data.');
  }
  return textEncoder.encode(source);
}

export function decodeUtf8TextPayload(payload: Uint8Array): string {
  try {
    return strictTextDecoder.decode(payload);
  }
  catch {
    throw new TypeError('The authenticated text payload is not valid UTF-8.');
  }
}
