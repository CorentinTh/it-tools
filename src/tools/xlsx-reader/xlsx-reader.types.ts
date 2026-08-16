export const XLSX_MAX_FILE_BYTES = 32 * 1024 * 1024;
export const XLSX_MAX_FILE_LABEL = '32 MiB';
export const XLSX_MAX_CENTRAL_DIRECTORY_BYTES = 2 * 1024 * 1024;
export const XLSX_MAX_ENTRIES = 512;
export const XLSX_MAX_ENTRY_NAME_BYTES = 512;
export const XLSX_MAX_SHEETS = 128;
export const XLSX_MAX_ROWS = 1_048_576;
export const XLSX_MAX_COLUMNS = 16_384;
export const XLSX_MAX_PREVIEW_ROWS = 200;
export const XLSX_MAX_PREVIEW_COLUMNS = 32;
export const XLSX_MAX_WORKBOOK_XML_BYTES = 1024 * 1024;
export const XLSX_MAX_RELATIONSHIPS_XML_BYTES = 512 * 1024;
export const XLSX_MAX_CONTENT_TYPES_XML_BYTES = 512 * 1024;
export const XLSX_MAX_SHARED_STRINGS_XML_BYTES = 8 * 1024 * 1024;
export const XLSX_MAX_STYLES_XML_BYTES = 2 * 1024 * 1024;
export const XLSX_MAX_WORKSHEET_XML_BYTES = 16 * 1024 * 1024;
export const XLSX_MAX_REQUIRED_INFLATED_BYTES = 32 * 1024 * 1024;
export const XLSX_MAX_CELL_BYTES = 4 * 1024;
export const XLSX_MAX_FORMULA_BYTES = 4 * 1024;
export const XLSX_MAX_SHARED_STRING_COUNT = 200_000;
export const XLSX_MAX_PREVIEW_BYTES = 512 * 1024;
export const XLSX_MAX_EXPORT_BYTES = 1024 * 1024;
export const XLSX_TIMEOUT_MS = 15_000;

export type XlsxReaderWorkerErrorCode = 'validation' | 'limit' | 'format' | 'unsupported' | 'read' | 'processing';
export type XlsxReaderTaskErrorCode = XlsxReaderWorkerErrorCode | 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export interface XlsxSheetSummary {
  name: string
  state: 'visible' | 'hidden' | 'veryHidden'
  kind: 'worksheet' | 'unsupported'
  compressedBytes: number
  uncompressedBytes: number
  previewSupported: boolean
}

export interface XlsxInspectionResult {
  kind: 'inspection'
  fileSize: number
  entryCount: number
  totalCompressedBytes: number
  totalUncompressedBytes: number
  dateSystem: '1900' | '1904'
  hasSharedStrings: boolean
  sharedStringsBytes: number
  stylesBytes: number
  externalLinkCount: number
  sheets: XlsxSheetSummary[]
}

export interface XlsxPreviewResult {
  kind: 'preview'
  fileSize: number
  sheetIndex: number
  sheetName: string
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number
  totalRows: number
  columns: string[]
  rows: string[][]
  formulaCellCount: number
  missingFormulaResultCount: number
  json: string
  csv: string
}

export type XlsxReaderResult = XlsxInspectionResult | XlsxPreviewResult;

export type XlsxReaderTask =
  | { kind: 'inspect'; file: Blob }
  | { kind: 'preview'; file: Blob; sheetIndex: number; rowStart: number; rowCount: number; columnStart: number; columnCount: number };

export class XlsxReaderTaskError extends Error {
  override readonly name = 'XlsxReaderTaskError';

  constructor(
    public readonly code: XlsxReaderTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}
