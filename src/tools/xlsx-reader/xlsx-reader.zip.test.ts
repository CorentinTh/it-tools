import { describe, expect, it } from 'vitest';
import { createReadableXlsxFile, createStoredZip } from './xlsx-reader.fixtures';
import { inspectXlsxZip } from './xlsx-reader.zip';

function mutate(bytes: Uint8Array, change: (view: DataView, eocdOffset: number, centralOffset: number) => void): Uint8Array {
  const copy = bytes.slice();
  const view = new DataView(copy.buffer, copy.byteOffset, copy.byteLength);
  const eocdOffset = copy.byteLength - 22;
  change(view, eocdOffset, view.getUint32(eocdOffset + 16, true));
  return copy;
}

describe('xlsx ZIP boundary', () => {
  it('rejects duplicate and unsafe package paths', async () => {
    const duplicate = createStoredZip([
      { name: 'xl/workbook.xml', content: 'one' },
      { name: 'xl/workbook.xml', content: 'two' },
    ]);
    const traversal = createStoredZip([{ name: '../private.xml', content: 'secret' }]);

    await expect(inspectXlsxZip(createReadableXlsxFile(duplicate))).rejects.toMatchObject({ code: 'format' });
    await expect(inspectXlsxZip(createReadableXlsxFile(traversal))).rejects.toMatchObject({ code: 'format' });
  });

  it('rejects encrypted flags, ZIP64 sentinels, and overlapping local records', async () => {
    const base = createStoredZip([
      { name: 'first.xml', content: 'one' },
      { name: 'second.xml', content: 'two' },
    ]);
    const encrypted = mutate(base, (view, _eocd, central) => view.setUint16(central + 8, 0x0801, true));
    const zip64 = mutate(base, (view, eocd) => view.setUint16(eocd + 10, 0xFFFF, true));
    const overlap = mutate(base, (view, _eocd, central) => {
      const firstRecordLength = 46 + view.getUint16(central + 28, true) + view.getUint16(central + 30, true) + view.getUint16(central + 32, true);
      view.setUint32(central + firstRecordLength + 42, 0, true);
    });

    await expect(inspectXlsxZip(createReadableXlsxFile(encrypted))).rejects.toMatchObject({ code: 'unsupported' });
    await expect(inspectXlsxZip(createReadableXlsxFile(zip64))).rejects.toMatchObject({ code: 'unsupported' });
    await expect(inspectXlsxZip(createReadableXlsxFile(overlap))).rejects.toMatchObject({ code: 'format' });
  });
});
