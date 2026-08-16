import { describe, expect, it } from 'vitest';
import { createReadableXlsxFile, createXlsxFixture } from './xlsx-reader.fixtures';
import { columnLabel, inspectXlsx, previewXlsx } from './xlsx-reader.service';
import { XLSX_MAX_WORKSHEET_XML_BYTES } from './xlsx-reader.types';

describe('xlsx reader service', () => {
  it('inspects macro-free workbook metadata without inflating worksheets', async () => {
    const fixture = createXlsxFixture({ worksheetDeclaredSize: XLSX_MAX_WORKSHEET_XML_BYTES + 1 });
    const result = await inspectXlsx(createReadableXlsxFile(fixture));

    expect(result).toMatchObject({
      kind: 'inspection',
      entryCount: 7,
      dateSystem: '1904',
      hasSharedStrings: true,
      externalLinkCount: 1,
    });
    expect(result.sheets).toEqual([expect.objectContaining({ name: 'Data & IDs', kind: 'worksheet', previewSupported: false })]);
  });

  it('reads one bounded DEFLATE worksheet page and preserves stored scalar lexemes', async () => {
    const fixture = createXlsxFixture({ deflate: true });
    const result = await previewXlsx(createReadableXlsxFile(fixture), 0, 1, 3, 1, 2);

    expect(result.columns).toEqual(['A', 'B']);
    expect(result.rows).toEqual([
      ['Hello & local', '=2+2'],
      ['900719925474099312345', '=2+2'],
      ['TRUE', ''],
    ]);
    expect(result.formulaCellCount).toBe(2);
    expect(result.missingFormulaResultCount).toBe(1);
    expect(result.json).toContain('900719925474099312345');
    expect(result.json).not.toContain('CONCAT');
    expect(result.csv).toContain('\'=2+2');
  });

  it('rejects macros, XML declarations with DTDs, and CRC mismatches', async () => {
    await expect(inspectXlsx(createReadableXlsxFile(createXlsxFixture({ includeMacro: true })))).rejects.toMatchObject({ code: 'unsupported' });
    await expect(inspectXlsx(createReadableXlsxFile(createXlsxFixture({ workbook: '<!DOCTYPE workbook><workbook></workbook>' })))).rejects.toMatchObject({ code: 'unsupported' });
    await expect(inspectXlsx(createReadableXlsxFile(createXlsxFixture({ corruptRootRelationshipsCrc: true })))).rejects.toMatchObject({ code: 'format' });
  });

  it('rejects processing instructions, custom entities, and DEFLATE output beyond its declaration', async () => {
    await expect(inspectXlsx(createReadableXlsxFile(createXlsxFixture({
      workbook: '<?xml version="1.0"?><?private data?><workbook></workbook>',
    })))).rejects.toMatchObject({ code: 'unsupported' });
    await expect(inspectXlsx(createReadableXlsxFile(createXlsxFixture({
      workbook: '<?xml version="1.0"?><workbook><sheets><sheet name="&private;"/></sheets></workbook>',
    })))).rejects.toMatchObject({ code: 'format' });
    await expect(inspectXlsx(createReadableXlsxFile(createXlsxFixture({
      deflate: true,
      rootRelationshipsDeclaredSize: 8,
    })))).rejects.toMatchObject({ code: 'limit' });
  });

  it('formats the complete XLSX column range exactly', () => {
    expect([1, 26, 27, 702, 703, 16_384].map(columnLabel)).toEqual(['A', 'Z', 'AA', 'ZZ', 'AAA', 'XFD']);
  });
});
