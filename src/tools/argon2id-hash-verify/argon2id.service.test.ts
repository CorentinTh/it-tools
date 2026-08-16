import { webcrypto } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { describe, expect, it } from 'vitest';
import {
  ARGON2ID_DEFAULT_PARAMETERS,
  ARGON2ID_PASSWORD_MAX_BYTES,
  createArgon2idSalt,
  parseArgon2idPhc,
  validateArgon2idParameters,
  validateArgon2idPassword,
} from './argon2id.service';

// RFC 9106 section 5.3 Argon2id tag. The RFC vector also uses a secret and
// associated data, so this checks canonical PHC transport rather than the UI's
// unkeyed verification operation.
const RFC_9106_PHC = '$argon2id$v=19$m=32,t=3,p=4$AgICAgICAgICAgICAgICAg$DWQN9Y14dmwIwDejSotTydAe8EUtdbZetSUg6WsB5lk';

describe('Argon2id service', () => {
  it('uses the RFC 9106 second-recommended memory-constrained parameters', () => {
    expect(ARGON2ID_DEFAULT_PARAMETERS).toEqual({ memoryKiB: 65_536, iterations: 3, parallelism: 4, hashLength: 32 });
  });

  it('strictly parses the RFC 9106 Argon2id v=19 vector transport', () => {
    const parsed = parseArgon2idPhc(RFC_9106_PHC);
    expect(parsed).toMatchObject({ memoryKiB: 32, iterations: 3, parallelism: 4, hashLength: 32 });
    expect([...parsed.salt]).toEqual(Array.from({ length: 16 }, () => 2));
    expect(Buffer.from(parsed.hash).toString('hex')).toBe('0d640df58d78766c08c037a34a8b53c9d01ef0452d75b65eb52520e96b01e659');
  });

  it.each([
    RFC_9106_PHC.replace('argon2id', 'argon2i'),
    RFC_9106_PHC.replace('v=19', 'v=16'),
    RFC_9106_PHC.replace('m=32,t=3,p=4', 't=3,m=32,p=4'),
    RFC_9106_PHC.replace('m=32', 'm=032'),
    RFC_9106_PHC.replace('AgICAgICAgICAgICAgICAg', 'AgICAgICAgICAgICAgICAg=='),
    RFC_9106_PHC.replace('m=32', 'm=262145'),
    `${RFC_9106_PHC}$extra`,
  ])('rejects malformed, ambiguous, or unsupported PHC input: %s', (phc) => {
    expect(() => parseArgon2idPhc(phc)).toThrow();
  });

  it('bounds parameters, UTF-8 passwords, and lane memory', () => {
    expect(validateArgon2idParameters({ memoryKiB: 8, iterations: 1, parallelism: 1, hashLength: 16 })).toEqual({ memoryKiB: 8, iterations: 1, parallelism: 1, hashLength: 16 });
    expect(() => validateArgon2idParameters({ memoryKiB: 31, iterations: 1, parallelism: 4, hashLength: 16 })).toThrow(/8 KiB per lane/u);
    expect(validateArgon2idPassword('😀'.repeat(ARGON2ID_PASSWORD_MAX_BYTES / 4))).toHaveLength(ARGON2ID_PASSWORD_MAX_BYTES / 2);
    expect(() => validateArgon2idPassword(`${'😀'.repeat(ARGON2ID_PASSWORD_MAX_BYTES / 4)}a`)).toThrow(/UTF-8 bytes/u);
    expect(() => validateArgon2idPassword('')).toThrow(/UTF-8 bytes/u);
  });

  it('creates exactly 16 cryptographically supplied random salt bytes', () => {
    const salt = createArgon2idSalt(webcrypto as unknown as Crypto);
    expect(salt).toBeInstanceOf(Uint8Array);
    expect(salt).toHaveLength(16);
    expect(() => createArgon2idSalt({} as Crypto)).toThrow(/unavailable/u);
  });
});
