import {
  decodeAesEnvelopeBase64,
  decodeUtf8TextPayload,
  decryptAesEnvelope,
  encodeAesEnvelopeBase64,
  encryptAesEnvelope,
  utf8TextPayload,
} from '../aes-gcm-envelope/aes-gcm-envelope.service';
import { base32toHex } from '../otp-code-generator-and-validator/otp.service';

export const MAX_OTP_VAULT_ENTRIES = 128;
export const OTP_VAULT_SCHEMA_VERSION = 1;

export interface OtpVaultEntry {
  createdAt: string
  digits: 6 | 8
  id: string
  issuer: string
  label: string
  period: number
  secret: string
}

interface OtpVaultPayload {
  entries: OtpVaultEntry[]
  version: 1
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateText(value: unknown, name: string, maximum: number) {
  if (typeof value !== 'string' || value.trim() === '' || value.length > maximum) {
    throw new TypeError(`${name} must contain 1–${maximum} characters.`);
  }
  return value.trim();
}

export function validateOtpVaultEntry(value: unknown): OtpVaultEntry {
  if (!isRecord(value)
    || Object.keys(value).sort().join(',') !== 'createdAt,digits,id,issuer,label,period,secret') {
    throw new TypeError('The OTP vault entry schema is invalid.');
  }
  const id = validateText(value.id, 'Entry identifier', 64);
  if (!/^[A-Za-z0-9-]+$/u.test(id)) {
    throw new TypeError('The OTP vault entry identifier is invalid.');
  }
  const label = validateText(value.label, 'Account label', 100);
  const issuer = validateText(value.issuer, 'Issuer', 100);
  const secret = validateText(value.secret, 'Base32 secret', 512).toUpperCase().replace(/=+$/u, '');
  base32toHex(secret);
  if (value.digits !== 6 && value.digits !== 8) {
    throw new TypeError('OTP digits must be 6 or 8.');
  }
  if (typeof value.period !== 'number' || !Number.isSafeInteger(value.period) || value.period < 15 || value.period > 300) {
    throw new TypeError('TOTP period must be a whole number from 15 to 300 seconds.');
  }
  const createdAt = validateText(value.createdAt, 'Creation timestamp', 40);
  if (Number.isNaN(Date.parse(createdAt))) {
    throw new TypeError('The OTP vault creation timestamp is invalid.');
  }
  return { id, label, issuer, secret, digits: value.digits, period: value.period, createdAt };
}

export function createOtpVaultEntry(input: Pick<OtpVaultEntry, 'label' | 'issuer' | 'secret' | 'digits' | 'period'>): OtpVaultEntry {
  if (!globalThis.crypto?.randomUUID) {
    throw new TypeError('Secure browser UUID generation is not available.');
  }
  return validateOtpVaultEntry({
    ...input,
    id: globalThis.crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  });
}

function parsePayload(source: string): OtpVaultPayload {
  let value: unknown;
  try {
    value = JSON.parse(source);
  }
  catch {
    throw new TypeError('The decrypted OTP vault is not valid JSON.');
  }
  if (!isRecord(value)
    || Object.keys(value).sort().join(',') !== 'entries,version'
    || value.version !== OTP_VAULT_SCHEMA_VERSION
    || !Array.isArray(value.entries)
    || value.entries.length > MAX_OTP_VAULT_ENTRIES) {
    throw new TypeError('The decrypted OTP vault schema or entry limit is invalid.');
  }
  const entries = value.entries.map(validateOtpVaultEntry);
  if (new Set(entries.map(({ id }) => id)).size !== entries.length) {
    throw new TypeError('The decrypted OTP vault contains duplicate entry identifiers.');
  }
  return { version: OTP_VAULT_SCHEMA_VERSION, entries };
}

export async function encryptOtpVault(entries: readonly OtpVaultEntry[], passphrase: string) {
  if (entries.length > MAX_OTP_VAULT_ENTRIES) {
    throw new RangeError(`OTP vaults are limited to ${MAX_OTP_VAULT_ENTRIES} entries.`);
  }
  const payload: OtpVaultPayload = {
    version: OTP_VAULT_SCHEMA_VERSION,
    entries: entries.map(validateOtpVaultEntry),
  };
  const encrypted = await encryptAesEnvelope(
    { kind: 'text', payload: utf8TextPayload(JSON.stringify(payload)) },
    passphrase,
  );
  return encodeAesEnvelopeBase64(encrypted);
}

export async function decryptOtpVault(envelope: string, passphrase: string) {
  const plaintext = await decryptAesEnvelope(decodeAesEnvelopeBase64(envelope), passphrase);
  if (plaintext.kind !== 'text') {
    throw new TypeError('The encrypted OTP vault does not contain a text payload.');
  }
  return parsePayload(decodeUtf8TextPayload(plaintext.payload)).entries;
}
