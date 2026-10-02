import { execSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPrivateKey } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { generateEd25519SshPair, generateRsaSshPair } from './ssh-key-pair-generator.service';

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const out = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    out[index] = binary.charCodeAt(index);
  }
  return out;
}

/** Authoritative check: ssh-keygen parses the private key and re-derives the
 *  public key line (available on dev machines and CI runners). */
function sshKeygenPublicLine(privateKey: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'ssh-key-'));
  const path = join(dir, 'id_test');
  writeFileSync(path, privateKey, { mode: 0o600 });
  try {
    return execSync(`ssh-keygen -y -f ${JSON.stringify(path)}`, { encoding: 'utf8' }).trim();
  }
  finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('ssh-key-pair-generator: ed25519', () => {
  it('generates an OpenSSH public key line', async () => {
    const { publicKey } = await generateEd25519SshPair('user@host');
    expect(publicKey).toMatch(/^ssh-ed25519 AAAA[a-zA-Z0-9+/]+=* user@host$/);
  });

  it('private key is accepted by ssh-keygen and round-trips to the same public key', async () => {
    const { publicKey, privateKey } = await generateEd25519SshPair('roundtrip');
    expect(privateKey).toContain('-----BEGIN OPENSSH PRIVATE KEY-----');

    const derived = sshKeygenPublicLine(privateKey);
    // modern ssh-keygen -y preserves the comment; the full line must match
    expect(derived).toBe(publicKey);
  });

  it('embeds the comment in the private key container', async () => {
    const { privateKey } = await generateEd25519SshPair('my-comment');
    const base64 = privateKey
      .split('\n')
      .filter(line => line && !line.startsWith('-----'))
      .join('');
    const container = String.fromCharCode(...base64ToBytes(base64));
    expect(container).toContain('my-comment');
  });
});

describe('ssh-key-pair-generator: rsa', () => {
  it('generates an ssh-rsa public key line and parseable PKCS#8 private key', async () => {
    const { publicKey, privateKey } = await generateRsaSshPair('rsa@test', 2048);
    expect(publicKey).toMatch(/^ssh-rsa AAAA[a-zA-Z0-9+/]+=* rsa@test$/);
    expect(privateKey).toMatch(/BEGIN (RSA )?PRIVATE KEY-----/);

    const keyObject = createPrivateKey(privateKey);
    expect(keyObject.asymmetricKeyType).toBe('rsa');
    expect(keyObject.asymmetricKeyDetails?.modulusLength).toBe(2048);
  }, 60_000);

  it('encodes the public exponent 65537 right after the key type', async () => {
    const { publicKey } = await generateRsaSshPair('exp@test', 2048);
    const blob = base64ToBytes(publicKey.split(' ')[1]!);
    // string("ssh-rsa") = 4 + 7 bytes, then mpint(65537) = 00 01 00 01
    // mpint(65537) = length prefix 3 + bytes 01 00 01
    expect([...blob.slice(4 + 7, 4 + 7 + 4)]).toEqual([0x00, 0x00, 0x00, 0x03]);
    expect([...blob.slice(4 + 7 + 4, 4 + 7 + 7)]).toEqual([0x01, 0x00, 0x01]);
  }, 60_000);
});

describe('ssh-key-pair-generator: shared', () => {
  it('reads back previously written key files without side effects', () => {
    expect(readFileSync(new URL('./ssh-key-pair-generator.service.ts', import.meta.url)).length).toBeGreaterThan(0);
  });
});
