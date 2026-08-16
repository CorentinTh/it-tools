import { describe, expect, it } from 'vitest';
import { parquetFixture } from './parquet-reader.fixtures';
import { handleParquetReaderRequest } from './parquet-reader.worker-handler';
import { parseParquetReaderMessage, parseParquetReaderTask } from './parquet-reader.worker.protocol';
import { PARQUET_MAX_FILE_BYTES } from './parquet-reader.types';

describe('parquet reader worker protocol', () => {
  it('accepts exact inspect and preview requests', () => {
    const file = parquetFixture('plain');
    expect(parseParquetReaderTask({ kind: 'inspect', file })).toEqual({ kind: 'inspect', file });
    expect(parseParquetReaderTask({ kind: 'preview', file, columns: ['id'], rowStart: 0, rowCount: 25 }))
      .toEqual({ kind: 'preview', file, columns: ['id'], rowStart: 0, rowCount: 25 });
  });

  it('rejects oversized, duplicate-column, extra-key, and oversized-page tasks', () => {
    const oversized = new Blob(['x']);
    Object.defineProperty(oversized, 'size', { value: PARQUET_MAX_FILE_BYTES + 1 });
    expect(() => parseParquetReaderTask({ kind: 'inspect', file: oversized })).toThrow(/64 MiB/u);

    const file = parquetFixture('plain');
    expect(() => parseParquetReaderTask({ kind: 'preview', file, columns: ['id', 'id'], rowStart: 0, rowCount: 25 })).toThrow(/valid local Parquet/u);
    expect(() => parseParquetReaderTask({ kind: 'inspect', file, extra: true })).toThrow(/valid local Parquet/u);
    expect(() => parseParquetReaderTask({ kind: 'preview', file, columns: ['id'], rowStart: 0, rowCount: 201 })).toThrow(/valid local Parquet/u);
  });

  it('returns static errors that do not echo malformed private input', async () => {
    const message = await handleParquetReaderRequest({ jobId: 4, task: { kind: 'preview', file: 'private-parquet-marker', columns: ['secret'], rowStart: 0, rowCount: 1 } });
    expect(message).toEqual({
      jobId: 0,
      type: 'error',
      code: 'validation',
      message: 'Select a valid local Parquet file and bounded preview options.',
    });
    expect(JSON.stringify(message)).not.toContain('private-parquet-marker');
  });

  it('parses real results and rejects unknown response keys', async () => {
    const message = await handleParquetReaderRequest({ jobId: 9, task: { kind: 'inspect', file: parquetFixture('plain') } });
    expect(parseParquetReaderMessage(message)).toMatchObject({ jobId: 9, type: 'result', result: { kind: 'inspection', numRows: 8 } });
    expect(() => parseParquetReaderMessage({ ...message, extra: true })).toThrow(/invalid message/u);
  });
});
