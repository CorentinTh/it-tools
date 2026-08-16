import { describe, expect, it } from 'vitest';
import { parseXlsxReaderMessage, parseXlsxReaderTask, xlsxReaderErrorMessage } from './xlsx-reader.worker.protocol';
import { XLSX_MAX_FILE_BYTES, XlsxReaderTaskError } from './xlsx-reader.types';

describe('xlsx reader worker protocol', () => {
  it('accepts exact bounded tasks and rejects extra or oversized input', () => {
    const file = new Blob(['xlsx']);
    expect(parseXlsxReaderTask({ kind: 'inspect', file })).toEqual({ kind: 'inspect', file });
    expect(parseXlsxReaderTask({ kind: 'preview', file, sheetIndex: 0, rowStart: 1, rowCount: 25, columnStart: 1, columnCount: 8 })).toMatchObject({ kind: 'preview' });
    expect(() => parseXlsxReaderTask({ kind: 'inspect', file, extra: true })).toThrow(XlsxReaderTaskError);
    expect(() => parseXlsxReaderTask({ kind: 'inspect', file: new Blob([new Uint8Array(XLSX_MAX_FILE_BYTES + 1)]) })).toThrow(XlsxReaderTaskError);
  });

  it('accepts only static exact worker errors', () => {
    expect(parseXlsxReaderMessage({ jobId: 1, type: 'error', code: 'format', message: xlsxReaderErrorMessage('format') })).toMatchObject({ code: 'format' });
    expect(() => parseXlsxReaderMessage({ jobId: 1, type: 'error', code: 'format', message: 'leaked input' })).toThrow(XlsxReaderTaskError);
  });
});
