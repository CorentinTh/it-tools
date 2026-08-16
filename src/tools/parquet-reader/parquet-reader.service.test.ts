import { describe, expect, it } from 'vitest';
import { parquetFixture, parquetFixtureBytes } from './parquet-reader.fixtures';
import { buildParquetPreviewExports, inspectParquetFile, previewParquetFile } from './parquet-reader.service';
import { ParquetReaderTaskError } from './parquet-reader.types';

function readableFile(bytes: Uint8Array, name = 'fixture.parquet'): File {
  const file = new File([bytes], name, { type: 'application/vnd.apache.parquet' });
  Object.defineProperty(file, 'slice', {
    value(start = 0, end = bytes.byteLength) {
      const part = bytes.slice(start, end);
      const blob = new Blob([part]);
      Object.defineProperty(blob, 'arrayBuffer', {
        value: async () => {
          const buffer = new ArrayBuffer(part.byteLength);
          new Uint8Array(buffer).set(part);
          return buffer;
        },
      });
      return blob;
    },
  });
  return file;
}

describe('parquet reader service', () => {
  it('inspects official uncompressed Apache metadata without decoding rows', async () => {
    const result = await inspectParquetFile(parquetFixture('plain'));
    expect(result).toMatchObject({
      kind: 'inspection',
      fileSize: 1851,
      version: 1,
      numRows: 8,
      rowGroupCount: 1,
      codecs: ['UNCOMPRESSED'],
      unsupportedCodecs: [],
    });
    expect(result.columns.map(column => column.name)).toEqual([
      'id', 'bool_col', 'tinyint_col', 'smallint_col', 'int_col', 'bigint_col',
      'float_col', 'double_col', 'date_string_col', 'string_col', 'timestamp_col',
    ]);
    expect(result.schema).toContainEqual(expect.objectContaining({ path: 'bigint_col', physicalType: 'INT64' }));
  });

  it('decodes only a bounded selected page and preserves exact values in JSON/CSV', async () => {
    const result = await previewParquetFile(parquetFixture('plain'), ['id', 'bigint_col', 'string_col'], 1, 3);
    expect(result).toMatchObject({
      kind: 'preview',
      rowStart: 1,
      rowEnd: 4,
      totalRows: 8,
      columns: ['id', 'bigint_col', 'string_col'],
    });
    expect(result.rows).toEqual([
      ['5', '10', '0x31'],
      ['6', '0', '0x30'],
      ['7', '10', '0x31'],
    ]);
    expect(JSON.parse(result.json)).toEqual([
      { id: 5, bigint_col: '10', string_col: '0x31' },
      { id: 6, bigint_col: '0', string_col: '0x30' },
      { id: 7, bigint_col: '10', string_col: '0x31' },
    ]);
    expect(result.csv).toContain('id,bigint_col,string_col\r\n5,10,0x31');
  });

  it('decodes the built-in Snappy path without adding the broad codec package', async () => {
    const file = parquetFixture('snappy');
    const inspection = await inspectParquetFile(file);
    expect(inspection.codecs).toEqual(['SNAPPY']);
    expect(inspection.columns.map(column => column.name)).toEqual(['long_field', 'binary_field']);
    const result = await previewParquetFile(file, ['long_field'], 0, 2);
    expect(result.rows).toEqual([
      ['0'],
      ['0'],
    ]);
  });

  it('protects formula-like CSV cells and keeps exact conservative JSON strings', () => {
    const result = buildParquetPreviewExports(['name', '=header'], [['=SUM(A1:A2)', 9n], [' safe', -0]]);
    expect(result.csv).toBe('name,\'=header\r\n\'=SUM(A1:A2),9\r\n safe,\'-0');
    expect(JSON.parse(result.json)).toEqual([
      { 'name': '=SUM(A1:A2)', '=header': '9' },
      { 'name': ' safe', '=header': '-0' },
    ]);
  });

  it('rejects bad magic, oversized footer declarations, and unknown columns without echoing bytes', async () => {
    const badMagic = parquetFixtureBytes('plain');
    badMagic[0] = 0;
    await expect(inspectParquetFile(readableFile(badMagic))).rejects.toMatchObject({ code: 'format' });

    const badFooter = parquetFixtureBytes('plain');
    new DataView(badFooter.buffer).setUint32(badFooter.byteLength - 8, 0x7FFF_FFFF, true);
    await expect(inspectParquetFile(readableFile(badFooter))).rejects.toMatchObject({ code: 'limit' });

    await expect(previewParquetFile(parquetFixture('plain'), ['private-unknown-column'], 0, 1))
      .rejects.toBeInstanceOf(ParquetReaderTaskError);
  });
});
