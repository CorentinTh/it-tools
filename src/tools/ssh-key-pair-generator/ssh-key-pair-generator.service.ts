import { pki } from 'node-forge';
import { concat, encodeMpint, encodeOpenSshPrivateEd25519, encodeSshString } from './ssh-encoding.service';

export interface SshKeyPair {
  /** Public key line: `ssh-ed25519 AAAA... comment` or `ssh-rsa AAAA... comment`. */
  publicKey: string
  /** OpenSSH private key (Ed25519) or PKCS#8 PEM (RSA). */
  privateKey: string
}

async function generateEd25519KeyPair(): Promise<{ publicKeyRaw: Uint8Array; privateKeyRaw: Uint8Array }> {
  const pair = (await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
  const publicKeyRaw = new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey));
  const privateKeyRaw = new Uint8Array(await crypto.subtle.exportKey('pkcs8', pair.privateKey));
  // PKCS#8 Ed25519 DER: 302e020100300506032b657004220420 || 32-byte seed
  const seed = privateKeyRaw.slice(privateKeyRaw.length - 32);
  return { publicKeyRaw, privateKeyRaw: seed };
}

export async function generateEd25519SshPair(comment: string): Promise<SshKeyPair> {
  const { publicKeyRaw, privateKeyRaw } = await generateEd25519KeyPair();
  const typeBytes = new TextEncoder().encode('ssh-ed25519');

  const publicKeyPayload = concat(
    encodeSshString(typeBytes),
    encodeSshString(publicKeyRaw),
  );
  const publicKey = `ssh-ed25519 ${toBase64(publicKeyPayload)} ${comment}`.trim();
  const privateKey = encodeOpenSshPrivateEd25519(publicKeyRaw, privateKeyRaw, comment);

  return { publicKey, privateKey };
}

export async function generateRsaSshPair(comment: string, bits: 2048 | 3072 | 4096 = 3072): Promise<SshKeyPair> {
  const pair = pki.rsa.generateKeyPair({ bits, workers: 2 });
  const privateKeyPem = pki.privateKeyToPem(pair.privateKey);

  // ssh-rsa public key: string("ssh-rsa") + mpint(e) + mpint(n)
  const e = hexToBytes(pair.publicKey.e.toString(16));
  const n = hexToBytes(pair.publicKey.n.toString(16));
  const typeBytes = new TextEncoder().encode('ssh-rsa');
  const payload = concat(encodeSshString(typeBytes), encodeMpint(e), encodeMpint(n));
  const publicKey = `ssh-rsa ${toBase64(payload)} ${comment}`.trim();

  return { publicKey, privateKey: privateKeyPem };
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function hexToBytes(hex: string): Uint8Array {
  const padded = hex.length % 2 === 0 ? hex : `0${hex}`;
  const out = new Uint8Array(padded.length / 2);
  for (let index = 0; index < out.length; index++) {
    out[index] = Number.parseInt(padded.slice(index * 2, index * 2 + 2), 16);
  }
  return out;
}
