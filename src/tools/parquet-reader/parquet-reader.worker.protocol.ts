import {
  PARQUET_MAX_CELL_BYTES,
  PARQUET_MAX_EXPORT_BYTES,
  PARQUET_MAX_FILE_BYTES,
  PARQUET_MAX_FILE_LABEL,
  PARQUET_MAX_PREVIEW_BYTES,
  PARQUET_MAX_PREVIEW_ROWS,
  PARQUET_MAX_ROWS,
  PARQUET_MAX_SCHEMA_ELEMENTS,
  PARQUET_MAX_SELECTED_COLUMNS,
  PARQUET_MAX_TOP_LEVEL_COLUMNS,
  type ParquetColumnSummary,
  type ParquetInspectionResult,
  type ParquetMetadataEntry,
  type ParquetPreviewResult,
  type ParquetReaderResult,
  type ParquetReaderTask,
  ParquetReaderTaskError,
  type ParquetReaderWorkerErrorCode,
  type ParquetSchemaField,
} from './parquet-reader.types';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export type ParquetReaderWorkerMessage =
  | { jobId: number; type: 'result'; result: ParquetReaderResult }
  | { jobId: number; type: 'error'; code: ParquetReaderWorkerErrorCode; message: string };

const ERROR_MESSAGES: Record<ParquetReaderWorkerErrorCode, string> = {
  validation: 'Select a valid local Parquet file and bounded preview options.',
  limit: `Parquet files are limited to ${PARQUET_MAX_FILE_LABEL}; metadata, schema, row groups, selected chunks, cells, and exports have independent limits.`,
  format: 'The selected file is not a supported well-formed Parquet file.',
  unsupported: 'The selected preview uses a Parquet compression codec or external/encrypted column layout that this local reader does not support.',
  read: 'The selected local Parquet file could not be read.',
  processing: 'Parquet processing failed inside the bounded worker.',
};

function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value, key));
}

function validBoundedString(value: unknown, maxBytes: number): value is string {
  return typeof value === 'string' && !exceedsUtf8ByteLimit(value, maxBytes);
}

function validStringArray(value: unknown, maxItems: number, maxItemBytes = 256): value is string[] {
  return Array.isArray(value)
    && value.length <= maxItems
    && value.every(item => validBoundedString(item, maxItemBytes));
}

export function parseParquetReaderTask(value: unknown): ParquetReaderTask {
  if (!isUnknownRecord(value) || !(value.file instanceof Blob) || value.file.size <= 0 || value.file.size > PARQUET_MAX_FILE_BYTES) {
    const oversized = isUnknownRecord(value) && value.file instanceof Blob && value.file.size > PARQUET_MAX_FILE_BYTES;
    throw new ParquetReaderTaskError(oversized ? 'limit' : 'validation', oversized ? ERROR_MESSAGES.limit : ERROR_MESSAGES.validation);
  }
  if (value.kind === 'inspect' && exactKeys(value, ['file', 'kind'])) {
    return { kind: 'inspect', file: value.file };
  }
  if (value.kind === 'preview' && exactKeys(value, ['columns', 'file', 'kind', 'rowCount', 'rowStart'])
    && validStringArray(value.columns, PARQUET_MAX_SELECTED_COLUMNS)
    && value.columns.length > 0
    && new Set(value.columns).size === value.columns.length
    && Number.isSafeInteger(value.rowStart) && Number(value.rowStart) >= 0 && Number(value.rowStart) < PARQUET_MAX_ROWS
    && Number.isSafeInteger(value.rowCount) && Number(value.rowCount) >= 1 && Number(value.rowCount) <= PARQUET_MAX_PREVIEW_ROWS) {
    return {
      kind: 'preview',
      file: value.file,
      columns: [...value.columns],
      rowStart: Number(value.rowStart),
      rowCount: Number(value.rowCount),
    };
  }
  throw new ParquetReaderTaskError('validation', ERROR_MESSAGES.validation);
}

export function parseParquetReaderRequest(value: unknown): { jobId: number; task: ParquetReaderTask } {
  if (!isUnknownRecord(value) || !exactKeys(value, ['jobId', 'task']) || !isWorkerJobId(value.jobId)) {
    throw new ParquetReaderTaskError('validation', ERROR_MESSAGES.validation);
  }
  return { jobId: value.jobId, task: parseParquetReaderTask(value.task) };
}

function parseSchemaField(value: unknown): ParquetSchemaField | undefined {
  if (!isUnknownRecord(value) || !exactKeys(value, ['logicalType', 'path', 'physicalType', 'repetition'])
    || !validBoundedString(value.path, 1024)
    || !validBoundedString(value.physicalType, 64)
    || !validBoundedString(value.logicalType, 256)
    || !validBoundedString(value.repetition, 32)) {
    return undefined;
  }
  return { path: value.path, physicalType: value.physicalType, logicalType: value.logicalType, repetition: value.repetition };
}

function parseColumnSummary(value: unknown): ParquetColumnSummary | undefined {
  if (!isUnknownRecord(value)
    || !exactKeys(value, ['codecs', 'compressedBytes', 'leafCount', 'logicalTypes', 'name', 'physicalTypes', 'uncompressedBytes'])
    || !validBoundedString(value.name, 256)
    || !Number.isSafeInteger(value.leafCount) || Number(value.leafCount) < 1 || Number(value.leafCount) > PARQUET_MAX_SCHEMA_ELEMENTS
    || !validStringArray(value.physicalTypes, 32, 64)
    || !validStringArray(value.logicalTypes, 32, 256)
    || !validStringArray(value.codecs, 16, 32)
    || typeof value.compressedBytes !== 'string' || !/^\d{1,30}$/u.test(value.compressedBytes)
    || typeof value.uncompressedBytes !== 'string' || !/^\d{1,30}$/u.test(value.uncompressedBytes)) {
    return undefined;
  }
  return {
    name: value.name,
    leafCount: Number(value.leafCount),
    physicalTypes: [...value.physicalTypes],
    logicalTypes: [...value.logicalTypes],
    codecs: [...value.codecs],
    compressedBytes: value.compressedBytes,
    uncompressedBytes: value.uncompressedBytes,
  };
}

function parseMetadataEntry(value: unknown): ParquetMetadataEntry | undefined {
  if (!isUnknownRecord(value) || !exactKeys(value, ['key', 'value'])
    || !validBoundedString(value.key, 256) || !validBoundedString(value.value, 1024)) {
    return undefined;
  }
  return { key: value.key, value: value.value };
}

function parseInspection(value: Record<string, unknown>): ParquetInspectionResult | undefined {
  if (!exactKeys(value, ['codecs', 'columns', 'createdBy', 'fileSize', 'kind', 'metadata', 'numRows', 'rowGroupCount', 'schema', 'totalCompressedBytes', 'totalUncompressedBytes', 'unsupportedCodecs', 'version'])
    || value.kind !== 'inspection'
    || !Number.isSafeInteger(value.fileSize) || Number(value.fileSize) <= 0 || Number(value.fileSize) > PARQUET_MAX_FILE_BYTES
    || !Number.isSafeInteger(value.version) || Number(value.version) < 0 || Number(value.version) > 100
    || !Number.isSafeInteger(value.numRows) || Number(value.numRows) < 0 || Number(value.numRows) > PARQUET_MAX_ROWS
    || !Number.isSafeInteger(value.rowGroupCount) || Number(value.rowGroupCount) < 1 || Number(value.rowGroupCount) > 512
    || !validBoundedString(value.createdBy, 256)
    || !validStringArray(value.codecs, 16, 32)
    || !validStringArray(value.unsupportedCodecs, 16, 32)
    || typeof value.totalCompressedBytes !== 'string' || !/^\d{1,30}$/u.test(value.totalCompressedBytes)
    || typeof value.totalUncompressedBytes !== 'string' || !/^\d{1,30}$/u.test(value.totalUncompressedBytes)
    || !Array.isArray(value.columns) || value.columns.length < 1 || value.columns.length > PARQUET_MAX_TOP_LEVEL_COLUMNS
    || !Array.isArray(value.schema) || value.schema.length < 1 || value.schema.length > PARQUET_MAX_SCHEMA_ELEMENTS
    || !Array.isArray(value.metadata) || value.metadata.length > 64) {
    return undefined;
  }
  const columns = value.columns.map(parseColumnSummary);
  const schema = value.schema.map(parseSchemaField);
  const metadata = value.metadata.map(parseMetadataEntry);
  if (columns.some(item => !item) || schema.some(item => !item) || metadata.some(item => !item)) {
    return undefined;
  }
  return {
    kind: 'inspection',
    fileSize: Number(value.fileSize),
    version: Number(value.version),
    numRows: Number(value.numRows),
    rowGroupCount: Number(value.rowGroupCount),
    createdBy: value.createdBy,
    codecs: [...value.codecs],
    unsupportedCodecs: [...value.unsupportedCodecs],
    totalCompressedBytes: value.totalCompressedBytes,
    totalUncompressedBytes: value.totalUncompressedBytes,
    columns: columns as ParquetColumnSummary[],
    schema: schema as ParquetSchemaField[],
    metadata: metadata as ParquetMetadataEntry[],
  };
}

function parsePreview(value: Record<string, unknown>): ParquetPreviewResult | undefined {
  if (!exactKeys(value, ['columns', 'csv', 'fileSize', 'json', 'kind', 'rowEnd', 'rows', 'rowStart', 'totalRows'])
    || value.kind !== 'preview'
    || !Number.isSafeInteger(value.fileSize) || Number(value.fileSize) <= 0 || Number(value.fileSize) > PARQUET_MAX_FILE_BYTES
    || !Number.isSafeInteger(value.rowStart) || Number(value.rowStart) < 0
    || !Number.isSafeInteger(value.rowEnd) || Number(value.rowEnd) < Number(value.rowStart)
    || !Number.isSafeInteger(value.totalRows) || Number(value.totalRows) < Number(value.rowEnd) || Number(value.totalRows) > PARQUET_MAX_ROWS
    || !validStringArray(value.columns, PARQUET_MAX_SELECTED_COLUMNS)
    || value.columns.length < 1 || new Set(value.columns).size !== value.columns.length
    || !Array.isArray(value.rows) || value.rows.length > PARQUET_MAX_PREVIEW_ROWS
    || !validBoundedString(value.json, PARQUET_MAX_EXPORT_BYTES)
    || !validBoundedString(value.csv, PARQUET_MAX_EXPORT_BYTES)) {
    return undefined;
  }
  const rows: string[][] = [];
  let preview = '';
  for (const row of value.rows) {
    if (!validStringArray(row, value.columns.length, PARQUET_MAX_CELL_BYTES) || row.length !== value.columns.length) {
      return undefined;
    }
    rows.push([...row]);
    preview += row.join('\0');
    if (exceedsUtf8ByteLimit(preview, PARQUET_MAX_PREVIEW_BYTES)) {
      return undefined;
    }
  }
  if (Number(value.rowEnd) - Number(value.rowStart) !== rows.length) {
    return undefined;
  }
  return {
    kind: 'preview',
    fileSize: Number(value.fileSize),
    rowStart: Number(value.rowStart),
    rowEnd: Number(value.rowEnd),
    totalRows: Number(value.totalRows),
    columns: [...value.columns],
    rows,
    json: value.json,
    csv: value.csv,
  };
}

function parseResult(value: unknown): ParquetReaderResult | undefined {
  if (!isUnknownRecord(value)) {
    return undefined;
  }
  return value.kind === 'inspection' ? parseInspection(value) : value.kind === 'preview' ? parsePreview(value) : undefined;
}

export function parseParquetReaderMessage(value: unknown): ParquetReaderWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new ParquetReaderTaskError('worker', 'The Parquet worker returned an invalid message.');
  }
  if (value.type === 'result' && exactKeys(value, ['jobId', 'result', 'type'])) {
    const result = parseResult(value.result);
    if (result) {
      return { jobId: value.jobId, type: 'result', result };
    }
  }
  if (value.type === 'error' && exactKeys(value, ['code', 'jobId', 'message', 'type'])
    && typeof value.code === 'string' && value.code in ERROR_MESSAGES
    && value.message === ERROR_MESSAGES[value.code as ParquetReaderWorkerErrorCode]) {
    return { jobId: value.jobId, type: 'error', code: value.code as ParquetReaderWorkerErrorCode, message: value.message };
  }
  throw new ParquetReaderTaskError('worker', 'The Parquet worker returned an invalid message.');
}

export function parquetReaderErrorMessage(code: ParquetReaderWorkerErrorCode): string {
  return ERROR_MESSAGES[code];
}
