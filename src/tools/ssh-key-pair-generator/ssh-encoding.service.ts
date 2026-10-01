/** OpenSSH wire format helpers (RFC 4251) and the openssh-key-v1 private key
 *  container with the "none" cipher (no passphrase). */

export { concat, encodeMpint, encodeOpenSshPrivateEd25519, encodeSshString };

function encodeSshString(data: Uint8Array): Uint8Array {
  const out = new Uint8Array(4 + data.length);
  new DataView(out.buffer).setUint32(0, data.length);
  out.set(data, 4);
  return out;
}

function encodeUint32(value: number): Uint8Array {
  const out = new Uint8Array(4);
  new DataView(out.buffer).setUint32(0, value);
  return out;
}

/** SSH mpint: big-endian, minimal length, leading 0x00 when the high bit is set. */
function encodeMpint(data: Uint8Array): Uint8Array {
  let start = 0;
  while (start < data.length - 1 && data[start] === 0) {
    start++;
  }
  const trimmed = data.slice(start);
  const needsZero = trimmed.length > 0 && (trimmed[0]! & 0x80) !== 0;
  const body = needsZero ? new Uint8Array([0, ...trimmed]) : trimmed;
  return encodeSshString(body);
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((acc, part) => acc + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/** Public key line: `<keytype> <base64 blob> [comment]`, blob = string(type) + string(key). */
function encodePublicKeyLine(keyType: string, keyFields: Uint8Array[], comment: string): string {
  const typeBytes = new TextEncoder().encode(keyType);
  const payload = concat(encodeSshString(typeBytes), ...keyFields.map(field => encodeSshString(field)));
  return `${keyType} ${encodeBase64(payload)} ${comment}`.trim();
}

/** openssh-key-v1 unencrypted container:
 *  magic, ciphername, kdfname, kdfoptions, uint32 keycount, pubkey blob, private section. */
function encodeOpenSshPrivateContainer(keyType: string, publicKeyBlob: Uint8Array, privateBody: Uint8Array): string {
  const magic = new TextEncoder().encode('openssh-key-v1\0');
  const typeBytes = new TextEncoder().encode(keyType);

  const container = concat(
    magic,
    encodeSshString(new TextEncoder().encode('none')), // cipher
    encodeSshString(new TextEncoder().encode('none')), // kdf
    encodeSshString(new Uint8Array(0)), // kdf options
    encodeUint32(1), // number of keys
    encodeSshString(publicKeyBlob),
    encodeSshString(privateBody),
  );
  void typeBytes;

  const base64 = encodeBase64(container).replace(/(.{70})/g, '$1\n');
  // PEM requires the END line to be newline-terminated
  return `-----BEGIN OPENSSH PRIVATE KEY-----\n${base64}\n-----END OPENSSH PRIVATE KEY-----\n`;
}

/** Unencrypted OpenSSH private key for an Ed25519 pair.
 *  Private section: checkint x2, key type, public key, 64-byte secret
 *  (32-byte seed followed by a copy of the public key), comment, padding 1..N. */
function encodeOpenSshPrivateEd25519(publicKey: Uint8Array, privateKeySeed: Uint8Array, comment: string): string {
  const check = crypto.getRandomValues(new Uint8Array(4));
  const typeBytes = new TextEncoder().encode('ssh-ed25519');
  const publicKeyBlob = concat(encodeSshString(typeBytes), encodeSshString(publicKey));

  const privBody = concat(
    check,
    check,
    encodeSshString(typeBytes),
    encodeSshString(publicKey),
    encodeSshString(concat(privateKeySeed, publicKey)),
    encodeSshString(new TextEncoder().encode(comment)),
  );
  const paddingLength = (8 - (privBody.length % 8)) % 8;
  const padding = new Uint8Array(paddingLength);
  for (let index = 0; index < paddingLength; index++) {
    padding[index] = index + 1;
  }

  return encodeOpenSshPrivateContainer('ssh-ed25519', publicKeyBlob, concat(privBody, padding));
}
