import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { describe, it } from 'node:test';
import {
  OUI_DATA_FILE,
  OUI_DATA_FORMAT_VERSION,
  OUI_MAX_VENDOR_LENGTH,
  buildCompactOuiData,
  buildOuiArtifacts,
  parseOuiSource,
} from './generate-oui-data.mjs';

const packageMetadata = {
  version: '1.2.3',
  license: 'BSD-2-Clause',
  repository: { type: 'git', url: 'https://example.test/oui-data.git' },
};

describe('OUI data generator', () => {
  it('validates and sorts the package source deterministically', () => {
    assert.deepEqual(
      parseOuiSource('{"AABBCC":"Second","001122":"First"}'),
      [['001122', 'First'], ['AABBCC', 'Second']],
    );
    assert.throws(() => parseOuiSource('{"aa1122":"Vendor"}'), /Invalid OUI prefix/);
    assert.throws(() => parseOuiSource('{"AA1122":""}'), /Invalid vendor value/);
    assert.throws(
      () => parseOuiSource(JSON.stringify({ AA1122: 'x'.repeat(OUI_MAX_VENDOR_LENGTH + 1) })),
      /Invalid vendor value/,
    );
  });

  it('rejects an empty source instead of emitting invalid metadata', () => {
    assert.throws(
      () => parseOuiSource('{}'),
      /must contain at least one OUI record/,
    );
  });

  it('encodes sorted prefix deltas and reuses deterministic vendor identifiers', () => {
    const entries = [
      ['000010', 'Shared vendor'],
      ['000020', 'Alpha vendor'],
      ['AABBCC', 'Shared vendor'],
    ];

    assert.deepEqual(buildCompactOuiData(entries), [
      [0x10, 0x10, 0xAABBAC],
      '001000001',
      ['Alpha vendor', 'Shared vendor'],
    ]);
  });

  it('emits one stable compact artifact plus source metadata', () => {
    const rawSource = '{"AABBCC":"Second","001122":"First"}';
    const reorderedSource = '{"001122":"First","AABBCC":"Second"}';
    const first = buildOuiArtifacts({ rawSource, packageMetadata });
    const second = buildOuiArtifacts({ rawSource: reorderedSource, packageMetadata });

    assert.deepEqual([...first.keys()], [OUI_DATA_FILE, 'metadata.json']);
    assert.equal(first.get(OUI_DATA_FILE), second.get(OUI_DATA_FILE));
    assert.deepEqual(JSON.parse(first.get(OUI_DATA_FILE)), [
      [0x001122, 0xAAAAAA],
      '000001',
      ['First', 'Second'],
    ]);

    const contents = first.get(OUI_DATA_FILE);
    const metadata = JSON.parse(first.get('metadata.json'));
    assert.equal(metadata.schema.version, OUI_DATA_FORMAT_VERSION);
    assert.equal(metadata.records, 2);
    assert.equal(metadata.uniqueVendors, 2);
    assert.equal(metadata.source.version, '1.2.3');
    assert.equal(metadata.artifact.file, OUI_DATA_FILE);
    assert.equal(metadata.artifact.rawBytes, Buffer.byteLength(contents));
    assert.equal(metadata.artifact.sha256, createHash('sha256').update(contents).digest('hex'));
    assert.match(metadata.source.sha256, /^[a-f\d]{64}$/);
  });
});
