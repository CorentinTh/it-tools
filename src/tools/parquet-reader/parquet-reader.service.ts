import { parquetMetadataAsync, parquetRead, parquetSchema } from 'hyparquet';
import type { AsyncBuffer, FileMetaData, ParquetParsers, RowGroup, SchemaElement, SchemaTree } from 'hyparquet';
import {
  PARQUET_MAX_CELL_BYTES,
  PARQUET_MAX_COLUMN_CHUNK_BYTES,
  PARQUET_MAX_EXPORT_BYTES,
  PARQUET_MAX_FILE_BYTES,
  PARQUET_MAX_FOOTER_BYTES,
  PARQUET_MAX_PREVIEW_BYTES,
  PARQUET_MAX_ROWS,
  PARQUET_MAX_ROW_GROUPS,
  PARQUET_MAX_SCHEMA_ELEMENTS,
  PARQUET_MAX_SELECTED_CHUNK_BYTES,
  PARQUET_MAX_SELECTED_COLUMNS,
  PARQUET_MAX_TOP_LEVEL_COLUMNS,
  PARQUET_SUPPORTED_CODECS,
  type ParquetColumnSummary,
  type ParquetInspectionResult,
  type ParquetPreviewResult,
  ParquetReaderTaskError,
  type ParquetSchemaField,
} from './parquet-reader.types';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

const PARQUET_MAGIC = 'PAR1';
const MAX_SLICE_BYTES = 16 * 1024 * 1024;
const MAX_TOTAL_READ_BYTES = 48 * 1024 * 1024;
const MAX_DECLARED_COLUMN_BYTES = 4n * 1024n * 1024n * 1024n;
const MAX_SCHEMA_DEPTH = 16;
const MAX_METADATA_ENTRIES = 64;
const MAX_METADATA_KEY_BYTES = 256;
const MAX_METADATA_VALUE_BYTES = 1024;
const MAX_NESTED_DEPTH = 8;
const MAX_VALUE_NODES = 20_000;
const MAX_COLLECTION_ITEMS = 256;
const SUPPORTED_CODECS = new Set<string>(PARQUET_SUPPORTED_CODECS);
const textDecoder = new TextDecoder('utf-8', { fatal: true });

interface ValidatedMetadata {
  metadata: FileMetaData
  schemaTree: SchemaTree
  inspection: ParquetInspectionResult
}

interface NormalizationState {
  nodes: number
}

function fail(code: 'limit' | 'format' | 'unsupported' | 'read' | 'processing'): never {
  throw new ParquetReaderTaskError(code, code);
}

function ascii(bytes: Uint8Array): string {
  return String.fromCharCode(...bytes);
}

async function readBlobRange(file: Blob, start: number, end: number): Promise<ArrayBuffer> {
  try {
    return await file.slice(start, end).arrayBuffer();
  }
  catch {
    fail('read');
  }
}

async function readFooterLength(file: Blob): Promise<number> {
  if (file.size < 12) {
    fail('format');
  }
  const [headerBuffer, footerBuffer] = await Promise.all([
    readBlobRange(file, 0, 4),
    readBlobRange(file, file.size - 8, file.size),
  ]);
  const header = new Uint8Array(headerBuffer);
  const footer = new Uint8Array(footerBuffer);
  if (ascii(header) !== PARQUET_MAGIC || ascii(footer.subarray(4)) !== PARQUET_MAGIC) {
    fail('format');
  }
  const footerLength = new DataView(footer.buffer, footer.byteOffset, footer.byteLength).getUint32(0, true);
  if (footerLength <= 0 || footerLength > PARQUET_MAX_FOOTER_BYTES || footerLength + 8 > file.size - 4) {
    fail(footerLength > PARQUET_MAX_FOOTER_BYTES ? 'limit' : 'format');
  }
  return footerLength;
}

function trackedAsyncBuffer(file: Blob): AsyncBuffer {
  let bytesRead = 0;
  return {
    byteLength: file.size,
    async slice(start: number, end = file.size): Promise<ArrayBuffer> {
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || end > file.size) {
        fail('format');
      }
      const length = end - start;
      if (length > MAX_SLICE_BYTES || bytesRead + length > MAX_TOTAL_READ_BYTES) {
        fail('limit');
      }
      bytesRead += length;
      return readBlobRange(file, start, end);
    },
  };
}

function boundedString(value: unknown, maxBytes: number, code: 'limit' | 'format' = 'limit'): string {
  const containsDisallowedControl = typeof value === 'string' && [...value].some((character) => {
    const point = character.codePointAt(0) ?? 0;
    return point === 0x7F || (point < 0x20 && point !== 0x09 && point !== 0x0A && point !== 0x0D);
  });
  if (typeof value !== 'string' || exceedsUtf8ByteLimit(value, maxBytes) || containsDisallowedControl) {
    fail(code);
  }
  return value;
}

function checkedBigInt(value: unknown, max: bigint, code: 'limit' | 'format' = 'format'): bigint {
  if (typeof value !== 'bigint' || value < 0n) {
    fail('format');
  }
  if (value > max) {
    fail(code);
  }
  return value;
}

function formatLogicalType(element: SchemaElement): string {
  if (element.logical_type) {
    const logical = element.logical_type;
    if (logical.type === 'DECIMAL') {
      return `DECIMAL(${logical.precision},${logical.scale})`;
    }
    if (logical.type === 'TIME' || logical.type === 'TIMESTAMP') {
      return `${logical.type}(${logical.unit},${logical.isAdjustedToUTC ? 'UTC' : 'local'})`;
    }
    if (logical.type === 'INTEGER') {
      return `${logical.isSigned ? 'INT' : 'UINT'}${logical.bitWidth}`;
    }
    return logical.type;
  }
  return element.converted_type ?? 'none';
}

function flattenSchema(tree: SchemaTree): ParquetSchemaField[] {
  const output: ParquetSchemaField[] = [];
  const visit = (node: SchemaTree, depth: number) => {
    if (depth > MAX_SCHEMA_DEPTH || output.length >= PARQUET_MAX_SCHEMA_ELEMENTS) {
      fail('limit');
    }
    const name = boundedString(node.element.name, 256, 'format');
    const path = node.path.length > 0 ? node.path.join('.') : name;
    output.push({
      path: boundedString(path, 1024),
      physicalType: node.element.type ?? 'group',
      logicalType: boundedString(formatLogicalType(node.element), 256),
      repetition: node.element.repetition_type ?? (depth === 0 ? 'ROOT' : 'unknown'),
    });
    for (const child of node.children) {
      visit(child, depth + 1);
    }
  };
  for (const child of tree.children) {
    visit(child, 1);
  }
  return output;
}

function collectLeaves(node: SchemaTree): SchemaTree[] {
  if (node.children.length === 0) {
    return [node];
  }
  return node.children.flatMap(collectLeaves);
}

function safeChunkMetadata(rowGroups: RowGroup[], fileSize: number) {
  let totalCompressed = 0n;
  let totalUncompressed = 0n;
  const codecs = new Set<string>();
  const byTopLevel = new Map<string, { compressed: bigint; uncompressed: bigint; codecs: Set<string> }>();

  for (const rowGroup of rowGroups) {
    checkedBigInt(rowGroup.num_rows, BigInt(PARQUET_MAX_ROWS), 'limit');
    checkedBigInt(rowGroup.total_byte_size, BigInt(PARQUET_MAX_FILE_BYTES), 'limit');
    if (!Array.isArray(rowGroup.columns) || rowGroup.columns.length > PARQUET_MAX_SCHEMA_ELEMENTS) {
      fail('limit');
    }
    for (const chunk of rowGroup.columns) {
      if (chunk.file_path || chunk.crypto_metadata || chunk.encrypted_column_metadata || !chunk.meta_data) {
        fail('unsupported');
      }
      const metadata = chunk.meta_data;
      if (!Array.isArray(metadata.path_in_schema) || metadata.path_in_schema.length < 1 || metadata.path_in_schema.length > MAX_SCHEMA_DEPTH) {
        fail('format');
      }
      const topLevel = boundedString(metadata.path_in_schema[0], 256, 'format');
      metadata.path_in_schema.forEach(segment => boundedString(segment, 256, 'format'));
      const compressed = checkedBigInt(metadata.total_compressed_size, BigInt(PARQUET_MAX_FILE_BYTES), 'limit');
      // Inspection never allocates the declared uncompressed payload. Keep
      // suspicious declarations bounded here, then enforce the much smaller
      // allocation budget only for chunks selected for Preview.
      const uncompressed = checkedBigInt(metadata.total_uncompressed_size, MAX_DECLARED_COLUMN_BYTES, 'limit');
      checkedBigInt(metadata.num_values, BigInt(PARQUET_MAX_ROWS) * BigInt(MAX_COLLECTION_ITEMS), 'limit');
      if (typeof metadata.data_page_offset !== 'bigint' || metadata.data_page_offset < 4n) {
        fail('format');
      }
      const firstPageOffset = metadata.dictionary_page_offset ?? metadata.data_page_offset;
      if (firstPageOffset < 4n || firstPageOffset >= BigInt(fileSize) || compressed > BigInt(fileSize) - firstPageOffset) {
        fail('format');
      }
      boundedString(metadata.codec, 32, 'format');
      codecs.add(metadata.codec);
      totalCompressed += compressed;
      totalUncompressed += uncompressed;
      const aggregate = byTopLevel.get(topLevel) ?? { compressed: 0n, uncompressed: 0n, codecs: new Set<string>() };
      aggregate.compressed += compressed;
      aggregate.uncompressed += uncompressed;
      aggregate.codecs.add(metadata.codec);
      byTopLevel.set(topLevel, aggregate);
    }
  }
  return { totalCompressed, totalUncompressed, codecs, byTopLevel };
}

function validateMetadata(file: Blob, metadata: FileMetaData, schemaTree: SchemaTree): ParquetInspectionResult {
  if (!Number.isSafeInteger(metadata.version) || metadata.version < 0 || metadata.version > 100
    || !Array.isArray(metadata.schema) || metadata.schema.length < 2 || metadata.schema.length > PARQUET_MAX_SCHEMA_ELEMENTS
    || !Array.isArray(metadata.row_groups) || metadata.row_groups.length < 1 || metadata.row_groups.length > PARQUET_MAX_ROW_GROUPS
    || !Number.isSafeInteger(metadata.metadata_length) || metadata.metadata_length <= 0 || metadata.metadata_length > PARQUET_MAX_FOOTER_BYTES) {
    fail('limit');
  }
  const numRowsBig = checkedBigInt(metadata.num_rows, BigInt(PARQUET_MAX_ROWS), 'limit');
  const numRows = Number(numRowsBig);
  const schema = flattenSchema(schemaTree);
  if (schemaTree.children.length < 1 || schemaTree.children.length > PARQUET_MAX_TOP_LEVEL_COLUMNS) {
    fail('limit');
  }
  const { totalCompressed, totalUncompressed, codecs, byTopLevel } = safeChunkMetadata(metadata.row_groups, file.size);
  const columns: ParquetColumnSummary[] = schemaTree.children.map((node) => {
    const name = boundedString(node.element.name, 256, 'format');
    const leaves = collectLeaves(node);
    const aggregate = byTopLevel.get(name);
    if (!aggregate || leaves.length < 1 || leaves.length > PARQUET_MAX_SCHEMA_ELEMENTS) {
      fail('format');
    }
    return {
      name,
      leafCount: leaves.length,
      physicalTypes: [...new Set(leaves.map(leaf => leaf.element.type ?? 'group'))].sort(),
      logicalTypes: [...new Set(leaves.map(leaf => formatLogicalType(leaf.element)))].sort(),
      codecs: [...aggregate.codecs].sort(),
      compressedBytes: aggregate.compressed.toString(),
      uncompressedBytes: aggregate.uncompressed.toString(),
    };
  });

  const metadataEntries = metadata.key_value_metadata ?? [];
  if (metadataEntries.length > MAX_METADATA_ENTRIES) {
    fail('limit');
  }

  return {
    kind: 'inspection',
    fileSize: file.size,
    version: metadata.version,
    numRows,
    rowGroupCount: metadata.row_groups.length,
    createdBy: boundedString(metadata.created_by ?? '', 256),
    codecs: [...codecs].sort(),
    unsupportedCodecs: [...codecs].filter(codec => !SUPPORTED_CODECS.has(codec)).sort(),
    totalCompressedBytes: totalCompressed.toString(),
    totalUncompressedBytes: totalUncompressed.toString(),
    columns,
    schema,
    metadata: metadataEntries.map(entry => ({
      key: boundedString(entry.key, MAX_METADATA_KEY_BYTES, 'format'),
      value: boundedString(entry.value ?? '', MAX_METADATA_VALUE_BYTES),
    })),
  };
}

function exactTimestamp(value: bigint, unit: 'ms' | 'us' | 'ns'): string {
  return `${value.toString()} ${unit} since Unix epoch`;
}

const parsers: ParquetParsers = {
  timestampFromMilliseconds: value => exactTimestamp(value, 'ms'),
  timestampFromMicroseconds: value => exactTimestamp(value, 'us'),
  timestampFromNanoseconds: value => exactTimestamp(value, 'ns'),
  dateFromDays(days) {
    if (!Number.isSafeInteger(days) || Math.abs(days) > 100_000_000) {
      fail('limit');
    }
    return new Date(days * 86_400_000).toISOString().slice(0, 10);
  },
  stringFromBytes(bytes) {
    if (bytes.byteLength > PARQUET_MAX_CELL_BYTES) {
      fail('limit');
    }
    try {
      return textDecoder.decode(bytes);
    }
    catch {
      fail('format');
    }
  },
  jsonFromBytes(bytes) {
    if (bytes.byteLength > PARQUET_MAX_CELL_BYTES) {
      fail('limit');
    }
    try {
      return textDecoder.decode(bytes);
    }
    catch {
      fail('format');
    }
  },
  geometryFromBytes: bytes => bytes,
  geographyFromBytes: bytes => bytes,
  uuidFromBytes(bytes) {
    if (bytes.byteLength !== 16) {
      fail('format');
    }
    const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  },
};

async function readAndValidateMetadata(file: Blob): Promise<ValidatedMetadata> {
  const footerLength = await readFooterLength(file);
  const buffer = trackedAsyncBuffer(file);
  let metadata: FileMetaData;
  let schemaTree: SchemaTree;
  try {
    metadata = await parquetMetadataAsync(buffer, {
      initialFetchSize: footerLength + 8,
      geoparquet: false,
      parsers,
    });
    schemaTree = parquetSchema(metadata);
  }
  catch (error) {
    if (error instanceof ParquetReaderTaskError) {
      throw error;
    }
    fail('format');
  }
  return { metadata, schemaTree, inspection: validateMetadata(file, metadata, schemaTree) };
}

function selectedChunkBudget(metadata: FileMetaData, selected: Set<string>, rowStart: number, rowEnd: number): void {
  let currentStart = 0;
  let compressed = 0n;
  let uncompressed = 0n;
  let selectedChunks = 0;
  for (const rowGroup of metadata.row_groups) {
    const rowCount = Number(rowGroup.num_rows);
    const currentEnd = currentStart + rowCount;
    if (currentEnd > rowStart && currentStart < rowEnd) {
      for (const chunk of rowGroup.columns) {
        const chunkMetadata = chunk.meta_data;
        if (!chunkMetadata || !selected.has(chunkMetadata.path_in_schema[0])) {
          continue;
        }
        if (!SUPPORTED_CODECS.has(chunkMetadata.codec)) {
          fail('unsupported');
        }
        compressed += checkedBigInt(chunkMetadata.total_compressed_size, BigInt(PARQUET_MAX_COLUMN_CHUNK_BYTES), 'limit');
        uncompressed += checkedBigInt(chunkMetadata.total_uncompressed_size, BigInt(PARQUET_MAX_COLUMN_CHUNK_BYTES), 'limit');
        selectedChunks += 1;
      }
    }
    currentStart = currentEnd;
  }
  if (selectedChunks === 0 || compressed > BigInt(PARQUET_MAX_SELECTED_CHUNK_BYTES) || uncompressed > BigInt(PARQUET_MAX_SELECTED_CHUNK_BYTES)) {
    fail(selectedChunks === 0 ? 'format' : 'limit');
  }
}

function normalizeValue(value: unknown, state: NormalizationState, depth = 0): unknown {
  state.nodes += 1;
  if (state.nodes > MAX_VALUE_NODES || depth > MAX_NESTED_DEPTH) {
    fail('limit');
  }
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    return boundedString(value, PARQUET_MAX_CELL_BYTES);
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return String(value);
    }
    return Object.is(value, -0) ? '-0' : value;
  }
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof Uint8Array) {
    if (value.byteLength > PARQUET_MAX_CELL_BYTES / 2) {
      fail('limit');
    }
    return `0x${[...value].map(byte => byte.toString(16).padStart(2, '0')).join('')}`;
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_COLLECTION_ITEMS) {
      fail('limit');
    }
    return value.map(item => normalizeValue(item, state, depth + 1));
  }
  if (value instanceof Map) {
    if (value.size > MAX_COLLECTION_ITEMS) {
      fail('limit');
    }
    return [...value.entries()].map(([key, item]) => [normalizeValue(key, state, depth + 1), normalizeValue(item, state, depth + 1)]);
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length > MAX_COLLECTION_ITEMS) {
      fail('limit');
    }
    const normalized = Object.create(null) as Record<string, unknown>;
    for (const [key, item] of entries) {
      normalized[boundedString(key, 256, 'format')] = normalizeValue(item, state, depth + 1);
    }
    return normalized;
  }
  fail('format');
}

function displayCell(value: unknown): string {
  const output = typeof value === 'string'
    ? value
    : value === null
      ? 'null'
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);
  return boundedString(output, PARQUET_MAX_CELL_BYTES);
}

function csvCell(value: string): string {
  const protectedValue = /^[\t\r ]*[=+\-@]/u.test(value) ? `'${value}` : value;
  return /[",\r\n]/u.test(protectedValue) ? `"${protectedValue.replace(/"/gu, '""')}"` : protectedValue;
}

export function buildParquetPreviewExports(columns: string[], normalizedRows: unknown[][]): { rows: string[][]; json: string; csv: string } {
  const state: NormalizationState = { nodes: 0 };
  const safeRows = normalizedRows.map(row => row.map(value => normalizeValue(value, state)));
  const rows = safeRows.map(row => row.map(displayCell));
  let preview = '';
  for (const row of rows) {
    preview += row.join('\0');
    if (exceedsUtf8ByteLimit(preview, PARQUET_MAX_PREVIEW_BYTES)) {
      fail('limit');
    }
  }
  const objects = safeRows.map((row) => {
    const item = Object.create(null) as Record<string, unknown>;
    columns.forEach((column, index) => {
      item[column] = row[index] ?? null;
    });
    return item;
  });
  const json = JSON.stringify(objects, null, 2);
  const csv = [columns.map(csvCell).join(','), ...rows.map(row => row.map(csvCell).join(','))].join('\r\n');
  if (exceedsUtf8ByteLimit(json, PARQUET_MAX_EXPORT_BYTES) || exceedsUtf8ByteLimit(csv, PARQUET_MAX_EXPORT_BYTES)) {
    fail('limit');
  }
  return { rows, json, csv };
}

export async function inspectParquetFile(file: Blob): Promise<ParquetInspectionResult> {
  return (await readAndValidateMetadata(file)).inspection;
}

export async function previewParquetFile(file: Blob, columns: string[], rowStart: number, rowCount: number): Promise<ParquetPreviewResult> {
  const { metadata, inspection } = await readAndValidateMetadata(file);
  const available = new Set(inspection.columns.map(column => column.name));
  if (columns.length < 1 || columns.length > PARQUET_MAX_SELECTED_COLUMNS || new Set(columns).size !== columns.length || columns.some(column => !available.has(column))) {
    fail('format');
  }
  if (!Number.isSafeInteger(rowStart) || rowStart < 0 || rowStart >= inspection.numRows || !Number.isSafeInteger(rowCount) || rowCount < 1) {
    fail('format');
  }
  const rowEnd = Math.min(inspection.numRows, rowStart + rowCount);
  selectedChunkBudget(metadata, new Set(columns), rowStart, rowEnd);

  let rawRows: unknown[][] = [];
  try {
    await parquetRead({
      file: trackedAsyncBuffer(file),
      metadata,
      columns,
      rowStart,
      rowEnd,
      rowFormat: 'array',
      utf8: false,
      geoparquet: false,
      parsers,
      onComplete(rows: unknown[][]) {
        rawRows = rows;
      },
    });
  }
  catch (error) {
    if (error instanceof ParquetReaderTaskError) {
      throw error;
    }
    fail('processing');
  }
  if (rawRows.length !== rowEnd - rowStart || rawRows.some(row => !Array.isArray(row) || row.length !== columns.length)) {
    fail('format');
  }
  const exports = buildParquetPreviewExports(columns, rawRows);
  return {
    kind: 'preview',
    fileSize: file.size,
    rowStart,
    rowEnd,
    totalRows: inspection.numRows,
    columns: [...columns],
    ...exports,
  };
}
