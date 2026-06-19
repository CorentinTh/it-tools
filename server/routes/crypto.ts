import { Hono } from 'hono';
import CryptoJSLib from 'crypto-js';
import bcryptjs from 'bcryptjs';
const { hashSync, compareSync } = bcryptjs;
import { v1, v3, v4, v5, NIL } from 'uuid';
import { ulid } from 'ulid';
import nodeForge from 'node-forge';
const { pki } = nodeForge;
import bip39Lib from '@it-tools/bip39';
const { entropyToMnemonic, mnemonicToEntropy, generateEntropy, englishWordList } = bip39Lib as any;
import { createToken } from '@/tools/token-generator/token-generator.service.js';
import {
  getPasswordCrackTimeEstimation,
  getCharsetLength,
} from '@/tools/password-strength-analyser/password-strength-analyser.service.js';

// crypto-js is CJS-only; destructure from the default export
const CryptoJS = CryptoJSLib as any;
const { MD5, SHA1, SHA224, SHA256, SHA384, SHA512, SHA3, RIPEMD160, enc } = CryptoJS;
const { HmacMD5, HmacSHA1, HmacSHA224, HmacSHA256, HmacSHA384, HmacSHA512, HmacSHA3, HmacRIPEMD160 } = CryptoJS;
const { AES, TripleDES, Rabbit, RC4 } = CryptoJS;

// --- Inlined OTP helpers (avoids crypto-js named-import issue in ESM) ---

function base32toHex(base32: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const bits = base32.toUpperCase().replace(/=+$/, '').split('')
    .map(v => chars.indexOf(v).toString(2).padStart(5, '0')).join('');
  return (bits.match(/.{1,8}/g) ?? [])
    .map(chunk => Number.parseInt(chunk, 2).toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): number[] {
  return (hex.match(/.{1,2}/g) ?? []).map(c => Number.parseInt(c, 16));
}

function generateHOTP({ key, counter = 0 }: { key: string; counter?: number }): string {
  const digest = HmacSHA1(CryptoJS.enc.Hex.parse(counter.toString(16).padStart(16, '0')), CryptoJS.enc.Hex.parse(base32toHex(key))).toString(CryptoJS.enc.Hex);
  const bytes = hexToBytes(digest);
  const offset = bytes[19] & 0xF;
  const v = ((bytes[offset] & 0x7F) << 24) | ((bytes[offset + 1] & 0xFF) << 16)
    | ((bytes[offset + 2] & 0xFF) << 8) | (bytes[offset + 3] & 0xFF);
  return String(v % 1000000).padStart(6, '0');
}

function verifyHOTP({ token, key, window = 0, counter = 0 }: { token: string; key: string; window?: number; counter?: number }): boolean {
  for (let i = counter - window; i <= counter + window; i++) {
    if (generateHOTP({ key, counter: i }) === token) return true;
  }
  return false;
}

function generateTOTP({ key, now = Date.now(), timeStep = 30 }: { key: string; now?: number; timeStep?: number }): string {
  return generateHOTP({ key, counter: Math.floor(now / 1000 / timeStep) });
}

function verifyTOTP({ key, token, window = 0, now = Date.now(), timeStep = 30 }: { key: string; token: string; window?: number; now?: number; timeStep?: number }): boolean {
  return verifyHOTP({ token, key, window, counter: Math.floor(now / 1000 / timeStep) });
}

function buildKeyUri({ secret, app = 'IT-Tools', account = 'demo-user', algorithm = 'SHA1', digits = 6, period = 30 }: { secret: string; app?: string; account?: string; algorithm?: string; digits?: number; period?: number }): string {
  const params = { issuer: app, secret, algorithm, digits, period };
  const qs = Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  return `otpauth://totp/${encodeURIComponent(app)}:${encodeURIComponent(account)}?${qs}`;
}

function generateSecret(): string {
  return createToken({ length: 16, alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' });
}

// ---

const router = new Hono();

// Token generator
router.post('/token', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const token = createToken({
    withUppercase: body.withUppercase ?? true,
    withLowercase: body.withLowercase ?? true,
    withNumbers: body.withNumbers ?? true,
    withSymbols: body.withSymbols ?? false,
    length: body.length ?? 64,
    alphabet: body.alphabet,
  });
  return c.json({ result: token });
});

// Hash text
router.post('/hash', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '', algorithm = 'SHA256', encoding = 'Hex' } = body;

  const algos: Record<string, (s: string) => any> = {
    MD5, SHA1, SHA224, SHA256, SHA384, SHA512, SHA3, RIPEMD160,
  };

  if (!algos[algorithm]) {
    return c.json({ error: `Unsupported algorithm. Use one of: ${Object.keys(algos).join(', ')}` }, 400);
  }

  const hash = algos[algorithm](text);
  const encodings: Record<string, any> = { Hex: enc.Hex, Base64: enc.Base64, Latin1: enc.Latin1 };
  const result = encoding === 'Bin'
    ? hash.toString(enc.Hex).split('').map((b: string) => parseInt(b, 16).toString(2).padStart(4, '0')).join('')
    : hash.toString(encodings[encoding] ?? enc.Hex);

  return c.json({ result });
});

// HMAC
router.post('/hmac', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '', secret = '', algorithm = 'SHA256', encoding = 'Hex' } = body;

  const algos: Record<string, (s: string, k: string) => any> = {
    MD5: HmacMD5, SHA1: HmacSHA1, SHA224: HmacSHA224,
    SHA256: HmacSHA256, SHA384: HmacSHA384, SHA512: HmacSHA512,
    SHA3: HmacSHA3, RIPEMD160: HmacRIPEMD160,
  };

  if (!algos[algorithm]) {
    return c.json({ error: `Unsupported algorithm. Use one of: ${Object.keys(algos).join(', ')}` }, 400);
  }

  const hash = algos[algorithm](text, secret);
  const encodings: Record<string, any> = { Hex: enc.Hex, Base64: enc.Base64 };
  const result = hash.toString(encodings[encoding] ?? enc.Hex);
  return c.json({ result });
});

// Bcrypt hash
router.post('/bcrypt/hash', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '', saltRounds = 10 } = body;
  const result = hashSync(text, saltRounds);
  return c.json({ result });
});

// Bcrypt verify
router.post('/bcrypt/verify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '', hash = '' } = body;
  try {
    const match = compareSync(text, hash);
    return c.json({ result: match });
  } catch {
    return c.json({ error: 'Invalid hash format' }, 400);
  }
});

// UUID generator
router.post('/uuid', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { version = 'v4', count = 1, namespace, name } = body;

  const generators: Record<string, (i: number) => string> = {
    NIL: () => NIL,
    v1: (i) => v1({ clockseq: i, msecs: Date.now(), nsecs: Math.floor(Math.random() * 10000), node: Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)) }),
    v3: () => v3(name ?? '', namespace ?? '6ba7b811-9dad-11d1-80b4-00c04fd430c8'),
    v4: () => v4(),
    v5: () => v5(name ?? '', namespace ?? '6ba7b811-9dad-11d1-80b4-00c04fd430c8'),
  };

  if (!generators[version]) {
    return c.json({ error: 'Unsupported version. Use one of: NIL, v1, v3, v4, v5' }, 400);
  }

  try {
    const result = Array.from({ length: Math.min(count, 100) }, (_, i) => generators[version](i));
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// ULID generator
router.post('/ulid', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { count = 1 } = body;
  const result = Array.from({ length: Math.min(count, 100) }, () => ulid());
  return c.json({ result });
});

// Encrypt
router.post('/encrypt', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '', secret = '', algorithm = 'AES' } = body;
  const algos: Record<string, any> = { AES, TripleDES, Rabbit, RC4 };
  if (!algos[algorithm]) {
    return c.json({ error: 'Unsupported algorithm. Use one of: AES, TripleDES, Rabbit, RC4' }, 400);
  }
  const result = algos[algorithm].encrypt(text, secret).toString();
  return c.json({ result });
});

// Decrypt
router.post('/decrypt', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text = '', secret = '', algorithm = 'AES' } = body;
  const algos: Record<string, any> = { AES, TripleDES, Rabbit, RC4 };
  if (!algos[algorithm]) {
    return c.json({ error: 'Unsupported algorithm. Use one of: AES, TripleDES, Rabbit, RC4' }, 400);
  }
  try {
    const result = algos[algorithm].decrypt(text, secret).toString(enc.Utf8);
    if (!result) return c.json({ error: 'Unable to decrypt — wrong secret or algorithm?' }, 400);
    return c.json({ result });
  } catch (e: any) {
    return c.json({ error: `Decryption failed: ${e.message}` }, 400);
  }
});

// RSA key pair generator
router.post('/rsa/generate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const bits = body.bits ?? 2048;
  try {
    const keyPair = await new Promise<pki.rsa.KeyPair>((resolve, reject) => {
      pki.rsa.generateKeyPair({ bits }, (err, kp) => err ? reject(err) : resolve(kp));
    });
    return c.json({
      result: {
        publicKey: pki.publicKeyToPem(keyPair.publicKey),
        privateKey: pki.privateKeyToPem(keyPair.privateKey),
      },
    });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// BIP39 — generate mnemonic
// entropyBits must be one of: 128, 160, 192, 224, 256 (maps to 16/20/24/28/32 bytes)
router.post('/bip39/generate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { entropyBits = 128 } = body;
  const validBits = [128, 160, 192, 224, 256];
  if (!validBits.includes(entropyBits)) {
    return c.json({ error: `entropyBits must be one of: ${validBits.join(', ')}` }, 400);
  }
  try {
    const entropy = generateEntropy(entropyBits / 8);
    const mnemonic = entropyToMnemonic(entropy, englishWordList);
    return c.json({ result: mnemonic });
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

// BIP39 — mnemonic to entropy
router.post('/bip39/to-entropy', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { mnemonic = '' } = body;
  try {
    const entropy = mnemonicToEntropy(mnemonic, englishWordList);
    return c.json({ result: entropy });
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

// OTP — generate secret
router.post('/otp/secret', async (c) => {
  return c.json({ result: generateSecret() });
});

// OTP — generate TOTP
router.post('/otp/totp/generate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { key = '', timeStep = 30 } = body;
  const result = generateTOTP({ key, timeStep });
  return c.json({ result });
});

// OTP — verify TOTP
router.post('/otp/totp/verify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { key = '', token = '', window = 0, timeStep = 30 } = body;
  const result = verifyTOTP({ key, token, window, timeStep });
  return c.json({ result });
});

// OTP — generate HOTP
router.post('/otp/hotp/generate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { key = '', counter = 0 } = body;
  const result = generateHOTP({ key, counter });
  return c.json({ result });
});

// OTP — verify HOTP
router.post('/otp/hotp/verify', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { key = '', token = '', counter = 0, window = 0 } = body;
  const result = verifyHOTP({ key, token, counter, window });
  return c.json({ result });
});

// OTP — build key URI
router.post('/otp/key-uri', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const result = buildKeyUri(body);
  return c.json({ result });
});

// Password strength analyser
router.post('/password-strength', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { password = '' } = body;
  const result = getPasswordCrackTimeEstimation({ password });
  return c.json({ result });
});

export default router;
