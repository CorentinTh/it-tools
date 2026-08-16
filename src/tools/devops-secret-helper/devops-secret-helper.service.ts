import { exceedsUtf8ByteLimit } from '@/utils/utf8';

export type DevopsSecretOperation = 'vault-encrypt' | 'vault-decrypt' | 'htpasswd-generate' | 'htpasswd-verify';
export interface DevopsSecretTask {
  operation: DevopsSecretOperation
  source: string
  password: string
  username: string
  cost: number
  vaultId: string
}

export const DEVOPS_SECRET_MAX_INPUT_BYTES = 1024 * 1024;
export const DEVOPS_SECRET_MAX_PASSWORD_BYTES = 1024;
export const DEVOPS_SECRET_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const DEVOPS_SECRET_TIMEOUT_MS = 12_000;
export const HTPASSWD_MAX_PASSWORD_BYTES = 72;
const VAULT_ITERATIONS = 10_000;
const VAULT_SALT_BYTES = 32;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function unhex(value: string, label: string): Uint8Array {
  if (!/^(?:[0-9a-f]{2})+$/u.test(value)) {
    throw new Error(`Invalid ${label} hexadecimal data.`);
  }
  const output = new Uint8Array(value.length / 2);
  for (let index = 0; index < output.length; index += 1) {
    output[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return output;
}

function validatePassword(password: string): Uint8Array {
  if (!password || exceedsUtf8ByteLimit(password, DEVOPS_SECRET_MAX_PASSWORD_BYTES)) {
    throw new Error('Enter a non-empty password of at most 1,024 UTF-8 bytes.');
  }
  return encoder.encode(password);
}

function pkcs7Pad(value: Uint8Array): Uint8Array {
  const padding = 16 - (value.byteLength % 16);
  const output = new Uint8Array(value.byteLength + padding);
  output.set(value);
  output.fill(padding, value.byteLength);
  return output;
}

function pkcs7Unpad(value: Uint8Array): Uint8Array {
  const padding = value[value.byteLength - 1] ?? 0;
  if (padding < 1 || padding > 16 || padding > value.byteLength) {
    throw new Error('Authentication failed.');
  }
  for (let index = value.byteLength - padding; index < value.byteLength; index += 1) {
    if (value[index] !== padding) {
      throw new Error('Authentication failed.');
    }
  }
  return value.slice(0, value.byteLength - padding);
}

async function deriveVaultKeys(password: Uint8Array, salt: Uint8Array) {
  const material = await crypto.subtle.importKey('raw', password, 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: VAULT_ITERATIONS, hash: 'SHA-256' },
    material,
    80 * 8,
  ));
  return { cipherKey: bits.slice(0, 32), hmacKey: bits.slice(32, 64), iv: bits.slice(64, 80) };
}

async function importVaultKeys(password: Uint8Array, salt: Uint8Array) {
  const derived = await deriveVaultKeys(password, salt);
  return {
    cipher: await crypto.subtle.importKey('raw', derived.cipherKey, 'AES-CTR', false, ['encrypt', 'decrypt']),
    hmac: await crypto.subtle.importKey('raw', derived.hmacKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']),
    iv: derived.iv,
  };
}

function formatVault(body: string, vaultId: string): string {
  if (vaultId && !/^[A-Za-z0-9_.-]{1,64}$/u.test(vaultId)) {
    throw new Error('Vault ID must use 1–64 letters, digits, dot, underscore, or hyphen.');
  }
  const header = vaultId ? `$ANSIBLE_VAULT;1.2;AES256;${vaultId}` : '$ANSIBLE_VAULT;1.1;AES256';
  const lines = body.match(/.{1,80}/gu) ?? [];
  return `${header}\n${lines.join('\n')}\n`;
}

export async function encryptAnsibleVault(source: string, password: string, vaultId = '', saltOverride?: Uint8Array): Promise<string> {
  if (exceedsUtf8ByteLimit(source, DEVOPS_SECRET_MAX_INPUT_BYTES)) {
    throw new Error('Vault plaintext is limited to 1 MiB.');
  }
  const passwordBytes = validatePassword(password);
  const salt = saltOverride ?? crypto.getRandomValues(new Uint8Array(VAULT_SALT_BYTES));
  if (salt.byteLength !== VAULT_SALT_BYTES) {
    throw new Error('Ansible Vault salts must contain 32 bytes.');
  }
  const keys = await importVaultKeys(passwordBytes, salt);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt(
    { name: 'AES-CTR', counter: keys.iv, length: 128 },
    keys.cipher,
    pkcs7Pad(encoder.encode(source)),
  ));
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', keys.hmac, ciphertext));
  const inner = encoder.encode(`${hex(salt)}\n${hex(digest)}\n${hex(ciphertext)}`);
  return formatVault(hex(inner), vaultId);
}

function parseVault(source: string) {
  if (exceedsUtf8ByteLimit(source, DEVOPS_SECRET_MAX_OUTPUT_BYTES)) {
    throw new Error('Vault input is limited to 2 MiB.');
  }
  const lines = source.trimEnd().split(/\r?\n/u);
  const header = lines.shift() ?? '';
  const match = /^\$ANSIBLE_VAULT;(1\.[12]);AES256(?:;([A-Za-z0-9_.-]{1,64}))?$/u.exec(header);
  if (!match || (match[1] === '1.1' && match[2])) {
    throw new Error('Only Ansible Vault 1.1 AES256 and labelled 1.2 AES256 are supported.');
  }
  if (!lines.length || lines.some((line, index) => !/^[0-9a-f]+$/u.test(line) || line.length > 80 || (index < lines.length - 1 && line.length !== 80))) {
    throw new Error('Ansible Vault armor must contain lowercase hexadecimal lines up to 80 characters.');
  }
  const inner = decoder.decode(unhex(lines.join(''), 'vault armor'));
  const parts = inner.split('\n');
  if (parts.length !== 3 || parts[0]?.length !== 64 || parts[1]?.length !== 64) {
    throw new Error('Ansible Vault payload structure is invalid.');
  }
  const salt = unhex(parts[0], 'salt');
  const digest = unhex(parts[1], 'HMAC');
  const ciphertext = unhex(parts[2], 'ciphertext');
  if (salt.byteLength !== 32 || digest.byteLength !== 32 || !ciphertext.byteLength || ciphertext.byteLength % 16 !== 0) {
    throw new Error('Ansible Vault payload lengths are invalid.');
  }
  return { salt, digest, ciphertext };
}

export async function decryptAnsibleVault(source: string, password: string): Promise<string> {
  const parsed = parseVault(source);
  const keys = await importVaultKeys(validatePassword(password), parsed.salt);
  if (!await crypto.subtle.verify('HMAC', keys.hmac, parsed.digest, parsed.ciphertext)) {
    throw new Error('Authentication failed: the password is wrong or the vault was modified.');
  }
  let plaintext: Uint8Array;
  try {
    plaintext = pkcs7Unpad(new Uint8Array(await crypto.subtle.decrypt(
      { name: 'AES-CTR', counter: keys.iv, length: 128 }, keys.cipher, parsed.ciphertext,
    )));
    return decoder.decode(plaintext);
  }
  catch {
    throw new Error('Authentication failed: the password is wrong or the vault was modified.');
  }
}

export function validateHtpasswdUsername(username: string): string {
  if (!username || exceedsUtf8ByteLimit(username, 255) || /[:\r\n]/u.test(username)) {
    throw new Error('Username must be 1–255 UTF-8 bytes and cannot contain colon or line breaks.');
  }
  return username;
}

export function parseHtpasswdLine(source: string): { username: string; hash: string } {
  const match = /^([^:\r\n]+):(\$2[ayb]\$(\d{2})\$[./A-Za-z0-9]{53})$/u.exec(source.trim());
  if (!match) {
    throw new Error('Enter one bcrypt htpasswd line in username:$2y$… form.');
  }
  validateHtpasswdUsername(match[1]);
  const cost = Number(match[3]);
  if (cost < 4 || cost > 14) {
    throw new Error('For bounded browser work, bcrypt cost must be between 4 and 14.');
  }
  return { username: match[1], hash: match[2] };
}

export function validateHtpasswdPassword(password: string): string {
  if (exceedsUtf8ByteLimit(password, HTPASSWD_MAX_PASSWORD_BYTES)) {
    throw new Error('Bcrypt passwords are limited to 72 UTF-8 bytes to avoid silent truncation.');
  }
  return password;
}
