import {
  XLSX_MAX_CELL_BYTES,
  XLSX_MAX_COLUMNS,
  XLSX_MAX_ENTRIES,
  XLSX_MAX_EXPORT_BYTES,
  XLSX_MAX_FILE_BYTES,
  XLSX_MAX_FILE_LABEL,
  XLSX_MAX_PREVIEW_BYTES,
  XLSX_MAX_PREVIEW_COLUMNS,
  XLSX_MAX_PREVIEW_ROWS,
  XLSX_MAX_ROWS,
  XLSX_MAX_SHEETS,
  type XlsxInspectionResult,
  type XlsxPreviewResult,
  type XlsxReaderResult,
  type XlsxReaderTask,
  XlsxReaderTaskError,
  type XlsxReaderWorkerErrorCode,
  type XlsxSheetSummary,
} from './xlsx-reader.types';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export type XlsxReaderWorkerMessage =
  | { jobId: number; type: 'result'; result: XlsxReaderResult }
  | { jobId: number; type: 'error'; code: XlsxReaderWorkerErrorCode; message: string };

const ERROR_MESSAGES: Record<XlsxReaderWorkerErrorCode, string> = {
  validation: 'Select a valid local XLSX file and bounded sheet page.',
  limit: `XLSX files are limited to ${XLSX_MAX_FILE_LABEL}; ZIP entries, inflated XML, sheets, rows, columns, cells, preview, and exports have independent limits.`,
  format: 'The selected file is not a supported well-formed macro-free XLSX workbook.',
  unsupported: 'The workbook uses an unsupported ZIP, XML, macro, sheet, or encoding feature.',
  read: 'The selected local XLSX file could not be read.',
  processing: 'XLSX processing failed inside the bounded worker.',
};

function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value, key));
}

function boundedString(value: unknown, maxBytes: number): value is string {
  return typeof value === 'string' && !exceedsUtf8ByteLimit(value, maxBytes);
}

function integer(value: unknown, min: number, max: number): value is number {
  return Number.isSafeInteger(value) && Number(value) >= min && Number(value) <= max;
}

export function parseXlsxReaderTask(value: unknown): XlsxReaderTask {
  if (!isUnknownRecord(value) || !(value.file instanceof Blob) || value.file.size <= 0 || value.file.size > XLSX_MAX_FILE_BYTES) {
    const oversized = isUnknownRecord(value) && value.file instanceof Blob && value.file.size > XLSX_MAX_FILE_BYTES;
    throw new XlsxReaderTaskError(oversized ? 'limit' : 'validation', oversized ? ERROR_MESSAGES.limit : ERROR_MESSAGES.validation);
  }
  if (value.kind === 'inspect' && exactKeys(value, ['file', 'kind'])) {
    return { kind: 'inspect', file: value.file };
  }
  if (value.kind === 'preview' && exactKeys(value, ['columnCount', 'columnStart', 'file', 'kind', 'rowCount', 'rowStart', 'sheetIndex'])
    && integer(value.sheetIndex, 0, XLSX_MAX_SHEETS - 1)
    && integer(value.rowStart, 1, XLSX_MAX_ROWS)
    && integer(value.rowCount, 1, XLSX_MAX_PREVIEW_ROWS)
    && Number(value.rowStart) + Number(value.rowCount) - 1 <= XLSX_MAX_ROWS
    && integer(value.columnStart, 1, XLSX_MAX_COLUMNS)
    && integer(value.columnCount, 1, XLSX_MAX_PREVIEW_COLUMNS)
    && Number(value.columnStart) + Number(value.columnCount) - 1 <= XLSX_MAX_COLUMNS) {
    return {
      kind: 'preview',
      file: value.file,
      sheetIndex: Number(value.sheetIndex),
      rowStart: Number(value.rowStart),
      rowCount: Number(value.rowCount),
      columnStart: Number(value.columnStart),
      columnCount: Number(value.columnCount),
    };
  }
  throw new XlsxReaderTaskError('validation', ERROR_MESSAGES.validation);
}

export function parseXlsxReaderRequest(value: unknown): { jobId: number; task: XlsxReaderTask } {
  if (!isUnknownRecord(value) || !exactKeys(value, ['jobId', 'task']) || !isWorkerJobId(value.jobId)) {
    throw new XlsxReaderTaskError('validation', ERROR_MESSAGES.validation);
  }
  return { jobId: value.jobId, task: parseXlsxReaderTask(value.task) };
}

function parseSheet(value: unknown): XlsxSheetSummary | undefined {
  if (!isUnknownRecord(value) || !exactKeys(value, ['compressedBytes', 'kind', 'name', 'previewSupported', 'state', 'uncompressedBytes'])
    || !boundedString(value.name, 256) || value.name.length === 0
    || !['visible', 'hidden', 'veryHidden'].includes(String(value.state))
    || !['worksheet', 'unsupported'].includes(String(value.kind))
    || !integer(value.compressedBytes, 0, XLSX_MAX_FILE_BYTES)
    || !integer(value.uncompressedBytes, 0, Number.MAX_SAFE_INTEGER)
    || typeof value.previewSupported !== 'boolean') {
    return undefined;
  }
  return {
    name: value.name,
    state: value.state as XlsxSheetSummary['state'],
    kind: value.kind as XlsxSheetSummary['kind'],
    compressedBytes: Number(value.compressedBytes),
    uncompressedBytes: Number(value.uncompressedBytes),
    previewSupported: value.previewSupported,
  };
}

function parseInspection(value: Record<string, unknown>): XlsxInspectionResult | undefined {
  if (!exactKeys(value, ['dateSystem', 'entryCount', 'externalLinkCount', 'fileSize', 'hasSharedStrings', 'kind', 'sharedStringsBytes', 'sheets', 'stylesBytes', 'totalCompressedBytes', 'totalUncompressedBytes'])
    || value.kind !== 'inspection' || !integer(value.fileSize, 1, XLSX_MAX_FILE_BYTES)
    || !integer(value.entryCount, 1, XLSX_MAX_ENTRIES)
    || !integer(value.totalCompressedBytes, 0, Number.MAX_SAFE_INTEGER)
    || !integer(value.totalUncompressedBytes, 0, Number.MAX_SAFE_INTEGER)
    || !['1900', '1904'].includes(String(value.dateSystem))
    || typeof value.hasSharedStrings !== 'boolean'
    || !integer(value.sharedStringsBytes, 0, Number.MAX_SAFE_INTEGER)
    || !integer(value.stylesBytes, 0, Number.MAX_SAFE_INTEGER)
    || !integer(value.externalLinkCount, 0, 512)
    || !Array.isArray(value.sheets) || value.sheets.length < 1 || value.sheets.length > XLSX_MAX_SHEETS) {
    return undefined;
  }
  const sheets = value.sheets.map(parseSheet);
  if (sheets.some(sheet => !sheet)) {
    return undefined;
  }
  return {
    kind: 'inspection',
    fileSize: Number(value.fileSize),
    entryCount: Number(value.entryCount),
    totalCompressedBytes: Number(value.totalCompressedBytes),
    totalUncompressedBytes: Number(value.totalUncompressedBytes),
    dateSystem: value.dateSystem as '1900' | '1904',
    hasSharedStrings: value.hasSharedStrings,
    sharedStringsBytes: Number(value.sharedStringsBytes),
    stylesBytes: Number(value.stylesBytes),
    externalLinkCount: Number(value.externalLinkCount),
    sheets: sheets as XlsxSheetSummary[],
  };
}

function parsePreview(value: Record<string, unknown>): XlsxPreviewResult | undefined {
  if (!exactKeys(value, ['columnEnd', 'columnStart', 'columns', 'csv', 'fileSize', 'formulaCellCount', 'json', 'kind', 'missingFormulaResultCount', 'rowEnd', 'rows', 'rowStart', 'sheetIndex', 'sheetName', 'totalRows'])
    || value.kind !== 'preview' || !integer(value.fileSize, 1, XLSX_MAX_FILE_BYTES)
    || !integer(value.sheetIndex, 0, XLSX_MAX_SHEETS - 1) || !boundedString(value.sheetName, 256)
    || !integer(value.rowStart, 1, XLSX_MAX_ROWS) || !integer(value.rowEnd, Number(value.rowStart), XLSX_MAX_ROWS)
    || !integer(value.columnStart, 1, XLSX_MAX_COLUMNS) || !integer(value.columnEnd, Number(value.columnStart), XLSX_MAX_COLUMNS)
    || !integer(value.totalRows, 0, XLSX_MAX_ROWS)
    || !integer(value.formulaCellCount, 0, XLSX_MAX_PREVIEW_ROWS * XLSX_MAX_PREVIEW_COLUMNS)
    || !integer(value.missingFormulaResultCount, 0, Number(value.formulaCellCount))
    || !Array.isArray(value.columns) || value.columns.length !== Number(value.columnEnd) - Number(value.columnStart) + 1 || value.columns.length > XLSX_MAX_PREVIEW_COLUMNS
    || !value.columns.every(column => boundedString(column, 8))
    || !Array.isArray(value.rows) || value.rows.length !== Number(value.rowEnd) - Number(value.rowStart) + 1 || value.rows.length > XLSX_MAX_PREVIEW_ROWS
    || !boundedString(value.json, XLSX_MAX_EXPORT_BYTES) || !boundedString(value.csv, XLSX_MAX_EXPORT_BYTES)) {
    return undefined;
  }
  let preview = '';
  const rows: string[][] = [];
  for (const row of value.rows) {
    if (!Array.isArray(row) || row.length !== value.columns.length || !row.every(cell => boundedString(cell, XLSX_MAX_CELL_BYTES))) {
      return undefined;
    }
    const parsed = [...row] as string[];
    rows.push(parsed);
    preview += parsed.join('\0');
    if (exceedsUtf8ByteLimit(preview, XLSX_MAX_PREVIEW_BYTES)) {
      return undefined;
    }
  }
  return {
    kind: 'preview',
    fileSize: Number(value.fileSize),
    sheetIndex: Number(value.sheetIndex),
    sheetName: value.sheetName,
    rowStart: Number(value.rowStart),
    rowEnd: Number(value.rowEnd),
    columnStart: Number(value.columnStart),
    columnEnd: Number(value.columnEnd),
    totalRows: Number(value.totalRows),
    columns: [...value.columns] as string[],
    rows,
    formulaCellCount: Number(value.formulaCellCount),
    missingFormulaResultCount: Number(value.missingFormulaResultCount),
    json: value.json,
    csv: value.csv,
  };
}

export function parseXlsxReaderMessage(value: unknown): XlsxReaderWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new XlsxReaderTaskError('worker', 'The XLSX worker returned an invalid message.');
  }
  if (value.type === 'result' && exactKeys(value, ['jobId', 'result', 'type']) && isUnknownRecord(value.result)) {
    const result = value.result.kind === 'inspection' ? parseInspection(value.result) : value.result.kind === 'preview' ? parsePreview(value.result) : undefined;
    if (result) {
      return { jobId: value.jobId, type: 'result', result };
    }
  }
  if (value.type === 'error' && exactKeys(value, ['code', 'jobId', 'message', 'type']) && typeof value.code === 'string' && Object.prototype.hasOwnProperty.call(ERROR_MESSAGES, value.code) && value.message === ERROR_MESSAGES[value.code as XlsxReaderWorkerErrorCode]) {
    return { jobId: value.jobId, type: 'error', code: value.code as XlsxReaderWorkerErrorCode, message: value.message };
  }
  throw new XlsxReaderTaskError('worker', 'The XLSX worker returned an invalid message.');
}

export function xlsxReaderErrorMessage(code: XlsxReaderWorkerErrorCode): string {
  return ERROR_MESSAGES[code];
}
