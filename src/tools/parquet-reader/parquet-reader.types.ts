export const PARQUET_MAX_FILE_BYTES = 64 * 1024 * 1024;
export const PARQUET_MAX_FILE_LABEL = '64 MiB';
export const PARQUET_MAX_FOOTER_BYTES = 2 * 1024 * 1024;
export const PARQUET_MAX_SCHEMA_ELEMENTS = 512;
export const PARQUET_MAX_TOP_LEVEL_COLUMNS = 128;
export const PARQUET_MAX_SELECTED_COLUMNS = 16;
export const PARQUET_MAX_ROW_GROUPS = 512;
export const PARQUET_MAX_ROWS = 1_000_000_000;
export const PARQUET_MAX_PREVIEW_ROWS = 200;
export const PARQUET_MAX_CELL_BYTES = 4 * 1024;
export const PARQUET_MAX_PREVIEW_BYTES = 512 * 1024;
export const PARQUET_MAX_EXPORT_BYTES = 1024 * 1024;
export const PARQUET_MAX_COLUMN_CHUNK_BYTES = 16 * 1024 * 1024;
export const PARQUET_MAX_SELECTED_CHUNK_BYTES = 32 * 1024 * 1024;
export const PARQUET_TIMEOUT_MS = 15_000;

export const PARQUET_SUPPORTED_CODECS = ['UNCOMPRESSED', 'SNAPPY'] as const;
export type SupportedParquetCodec = typeof PARQUET_SUPPORTED_CODECS[number];

export type ParquetReaderWorkerErrorCode = 'validation' | 'limit' | 'format' | 'unsupported' | 'read' | 'processing';
export type ParquetReaderTaskErrorCode = ParquetReaderWorkerErrorCode | 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export interface ParquetSchemaField {
  path: string
  physicalType: string
  logicalType: string
  repetition: string
}

export interface ParquetColumnSummary {
  name: string
  leafCount: number
  physicalTypes: string[]
  logicalTypes: string[]
  codecs: string[]
  compressedBytes: string
  uncompressedBytes: string
}

export interface ParquetMetadataEntry {
  key: string
  value: string
}

export interface ParquetInspectionResult {
  kind: 'inspection'
  fileSize: number
  version: number
  numRows: number
  rowGroupCount: number
  createdBy: string
  codecs: string[]
  unsupportedCodecs: string[]
  totalCompressedBytes: string
  totalUncompressedBytes: string
  columns: ParquetColumnSummary[]
  schema: ParquetSchemaField[]
  metadata: ParquetMetadataEntry[]
}

export interface ParquetPreviewResult {
  kind: 'preview'
  fileSize: number
  rowStart: number
  rowEnd: number
  totalRows: number
  columns: string[]
  rows: string[][]
  json: string
  csv: string
}

export type ParquetReaderResult = ParquetInspectionResult | ParquetPreviewResult;

export type ParquetReaderTask =
  | { kind: 'inspect'; file: Blob }
  | { kind: 'preview'; file: Blob; columns: string[]; rowStart: number; rowCount: number };

export class ParquetReaderTaskError extends Error {
  override readonly name = 'ParquetReaderTaskError';

  constructor(
    public readonly code: ParquetReaderTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}
