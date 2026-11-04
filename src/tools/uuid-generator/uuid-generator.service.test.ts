import { version as getUuidVersion, validate as validateUuid } from 'uuid';
import { describe, expect, it } from 'vitest';
import { generateUuids, isValidNamespace } from './uuid-generator.service';

const dnsNamespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

function getV7Timestamp(uuid: string): number {
  return Number.parseInt(uuid.replaceAll('-', '').slice(0, 12), 16);
}

describe('uuid-generator', () => {
  describe('generateUuids', () => {
    it('generates the requested number of UUIDs', () => {
      expect(generateUuids({ version: 'v4', count: 5 })).to.have.length(5);
    });

    it('generates the NIL UUID', () => {
      expect(generateUuids({ version: 'NIL', count: 2 })).to.eql([
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000000',
      ]);
    });

    it.each([
      ['v1', 1],
      ['v4', 4],
      ['v6', 6],
      ['v7', 7],
    ] as const)('generates valid and unique %s UUIDs', (uuidVersion, versionNumber) => {
      const uuids = generateUuids({ version: uuidVersion, count: 50 });

      for (const uuid of uuids) {
        expect(validateUuid(uuid)).to.eql(true);
        expect(getUuidVersion(uuid)).to.eql(versionNumber);
      }
      expect(new Set(uuids).size).to.eql(50);
    });

    // Test vectors from RFC 9562, appendix A.2 and A.4
    it('generates the RFC 9562 v3 test vector', () => {
      expect(generateUuids({ version: 'v3', count: 1, namespace: dnsNamespace, name: 'www.example.com' })).to.eql([
        '5df41881-3aed-3515-88a7-2f4a814cf09e',
      ]);
    });

    it('generates the RFC 9562 v5 test vector', () => {
      expect(generateUuids({ version: 'v5', count: 1, namespace: dnsNamespace, name: 'www.example.com' })).to.eql([
        '2ed6657d-e927-568b-95e1-2665a8aea6a2',
      ]);
    });

    it.each(['v6', 'v7'] as const)('generates %s UUIDs in ascending order', (uuidVersion) => {
      const uuids = generateUuids({ version: uuidVersion, count: 50 });

      expect(uuids).to.eql([...uuids].sort());
    });

    it('generates v7 UUIDs that start with the current Unix timestamp in milliseconds', () => {
      const before = Date.now();
      const [uuid] = generateUuids({ version: 'v7', count: 1 });
      const after = Date.now();

      expect(getV7Timestamp(uuid)).to.be.within(before, after);
    });
  });

  describe('isValidNamespace', () => {
    it.each([
      ['NIL', '00000000-0000-0000-0000-000000000000'],
      ['MAX', 'ffffffff-ffff-ffff-ffff-ffffffffffff'],
      ['v1', '6ba7b811-9dad-11d1-80b4-00c04fd430c8'],
      ['v4', '919108f7-52d1-4320-9bac-f847db4148a8'],
      ['v6', '1ec9414c-232a-6b00-b3c8-9e6bdeced846'],
      ['v7', '017f22e2-79b0-7cc3-98c4-dc0c0c07398f'],
    ])('accepts a %s UUID', (_label, namespace) => {
      expect(isValidNamespace(namespace)).to.eql(true);
    });

    it.each([
      ['an empty string', ''],
      ['a non-UUID string', 'not-a-uuid'],
      ['a UUID with an unknown version', '017f22e2-79b0-9cc3-98c4-dc0c0c07398f'],
      ['a UUID with an invalid variant', '017f22e2-79b0-7cc3-08c4-dc0c0c07398f'],
    ])('rejects %s', (_label, namespace) => {
      expect(isValidNamespace(namespace)).to.eql(false);
    });
  });
});
