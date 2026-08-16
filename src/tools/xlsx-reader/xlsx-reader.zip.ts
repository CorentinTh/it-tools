import {
  XLSX_MAX_CENTRAL_DIRECTORY_BYTES,
  XLSX_MAX_ENTRIES,
  XLSX_MAX_ENTRY_NAME_BYTES,
  XLSX_MAX_FILE_BYTES,
  XLSX_MAX_REQUIRED_INFLATED_BYTES,
  XlsxReaderTaskError,
} from './xlsx-reader.types';

const EOCD_SIGNATURE = 0x06054B50;
const CENTRAL_SIGNATURE = 0x02014B50;
const LOCAL_SIGNATURE = 0x04034B50;
const EOCD_MIN_BYTES = 22;
const EOCD_SEARCH_BYTES = 65_535 + EOCD_MIN_BYTES;
const ZIP64_EXTRA_ID = 0x0001;
const UTF8_FLAG = 0x0800;
const DATA_DESCRIPTOR_FLAG = 0x0008;
const ALLOWED_FLAGS = 0x080E;

export interface XlsxZipEntry {
  name: string
  flags: number
  method: number
  crc32: number
  compressedSize: number
  uncompressedSize: number
  localOffset: number
  dataOffset: number
}

export interface XlsxZipArchive {
  file: Blob
  entries: XlsxZipEntry[]
  byName: Map<string, XlsxZipEntry>
  totalCompressedBytes: number
  totalUncompressedBytes: number
}

export interface XlsxZipReadBudget {
  inflatedBytes: number
}

function readU16(view: DataView, offset: number): number {
  return view.getUint16(offset, true);
}

function readU32(view: DataView, offset: number): number {
  return view.getUint32(offset, true);
}

function assertRange(offset: number, length: number, total: number): void {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset + length > total) {
    throw new XlsxReaderTaskError('format', 'The XLSX ZIP archive contains an invalid byte range.');
  }
}

function hasZip64Extra(bytes: Uint8Array): boolean {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 0;
  while (offset < bytes.length) {
    if (offset + 4 > bytes.length) {
      throw new XlsxReaderTaskError('format', 'The XLSX ZIP archive contains malformed extra data.');
    }
    const id = readU16(view, offset);
    const size = readU16(view, offset + 2);
    offset += 4;
    if (offset + size > bytes.length) {
      throw new XlsxReaderTaskError('format', 'The XLSX ZIP archive contains malformed extra data.');
    }
    if (id === ZIP64_EXTRA_ID) {
      return true;
    }
    offset += size;
  }
  return false;
}

function decodeEntryName(bytes: Uint8Array, flags: number): string {
  if (bytes.length === 0 || bytes.length > XLSX_MAX_ENTRY_NAME_BYTES) {
    throw new XlsxReaderTaskError('limit', 'The XLSX ZIP archive contains an empty or oversized entry name.');
  }
  if ((flags & UTF8_FLAG) === 0 && bytes.some(byte => byte > 0x7F)) {
    throw new XlsxReaderTaskError('unsupported', 'Non-UTF-8 ZIP entry names are not supported.');
  }
  let name: string;
  try {
    name = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  catch {
    throw new XlsxReaderTaskError('format', 'The XLSX ZIP archive contains an invalid UTF-8 entry name.');
  }
  if (name.includes('\\') || name.includes('\0') || name.startsWith('/') || name.endsWith('/') || name.split('/').some(part => part === '' || part === '.' || part === '..')) {
    throw new XlsxReaderTaskError('format', 'The XLSX ZIP archive contains an unsafe entry path.');
  }
  return name;
}

async function readBytes(file: Blob, offset: number, length: number): Promise<Uint8Array> {
  assertRange(offset, length, file.size);
  try {
    return new Uint8Array(await file.slice(offset, offset + length).arrayBuffer());
  }
  catch {
    throw new XlsxReaderTaskError('read', 'The selected local XLSX file could not be read.');
  }
}

async function locateEocd(file: Blob): Promise<{ offset: number; entries: number; centralOffset: number; centralSize: number }> {
  const suffixOffset = Math.max(0, file.size - EOCD_SEARCH_BYTES);
  const suffix = await readBytes(file, suffixOffset, file.size - suffixOffset);
  const view = new DataView(suffix.buffer, suffix.byteOffset, suffix.byteLength);
  for (let index = suffix.length - EOCD_MIN_BYTES; index >= 0; index -= 1) {
    if (readU32(view, index) !== EOCD_SIGNATURE) {
      continue;
    }
    const commentLength = readU16(view, index + 20);
    const absoluteOffset = suffixOffset + index;
    if (absoluteOffset + EOCD_MIN_BYTES + commentLength !== file.size) {
      continue;
    }
    const disk = readU16(view, index + 4);
    const centralDisk = readU16(view, index + 6);
    const diskEntries = readU16(view, index + 8);
    const entries = readU16(view, index + 10);
    const centralSize = readU32(view, index + 12);
    const centralOffset = readU32(view, index + 16);
    if (disk !== 0 || centralDisk !== 0 || diskEntries !== entries) {
      throw new XlsxReaderTaskError('unsupported', 'Split XLSX ZIP archives are not supported.');
    }
    if (entries === 0xFFFF || centralSize === 0xFFFFFFFF || centralOffset === 0xFFFFFFFF) {
      throw new XlsxReaderTaskError('unsupported', 'ZIP64 XLSX archives are not supported by this bounded reader.');
    }
    if (entries < 1 || entries > XLSX_MAX_ENTRIES || centralSize > XLSX_MAX_CENTRAL_DIRECTORY_BYTES) {
      throw new XlsxReaderTaskError('limit', 'The XLSX ZIP entry count or central directory exceeds the supported limit.');
    }
    if (centralOffset + centralSize !== absoluteOffset) {
      throw new XlsxReaderTaskError('format', 'The XLSX ZIP central directory is ambiguous or not contiguous.');
    }
    return { offset: absoluteOffset, entries, centralOffset, centralSize };
  }
  throw new XlsxReaderTaskError('format', 'The selected file is not a well-formed XLSX ZIP archive.');
}

async function resolveLocalDataOffset(file: Blob, entry: Omit<XlsxZipEntry, 'dataOffset'>, centralOffset: number): Promise<number> {
  const fixed = await readBytes(file, entry.localOffset, 30);
  const view = new DataView(fixed.buffer, fixed.byteOffset, fixed.byteLength);
  if (readU32(view, 0) !== LOCAL_SIGNATURE) {
    throw new XlsxReaderTaskError('format', 'The XLSX ZIP archive contains an invalid local file header.');
  }
  const localFlags = readU16(view, 6);
  const localMethod = readU16(view, 8);
  const localCrc = readU32(view, 14);
  const localCompressedSize = readU32(view, 18);
  const localUncompressedSize = readU32(view, 22);
  const nameLength = readU16(view, 26);
  const extraLength = readU16(view, 28);
  if (localFlags !== entry.flags || localMethod !== entry.method || nameLength === 0 || nameLength > XLSX_MAX_ENTRY_NAME_BYTES) {
    throw new XlsxReaderTaskError('format', 'The XLSX ZIP local header disagrees with the central directory.');
  }
  const variable = await readBytes(file, entry.localOffset + 30, nameLength + extraLength);
  const localName = decodeEntryName(variable.subarray(0, nameLength), entry.flags);
  if (localName !== entry.name || hasZip64Extra(variable.subarray(nameLength))) {
    throw new XlsxReaderTaskError('format', 'The XLSX ZIP local header is inconsistent or uses ZIP64.');
  }
  if ((entry.flags & DATA_DESCRIPTOR_FLAG) === 0
    && (localCrc !== entry.crc32 || localCompressedSize !== entry.compressedSize || localUncompressedSize !== entry.uncompressedSize)) {
    throw new XlsxReaderTaskError('format', 'The XLSX ZIP entry sizes or checksum are inconsistent.');
  }
  const dataOffset = entry.localOffset + 30 + nameLength + extraLength;
  assertRange(dataOffset, entry.compressedSize, centralOffset);
  return dataOffset;
}

export async function inspectXlsxZip(file: Blob): Promise<XlsxZipArchive> {
  if (file.size <= 0 || file.size > XLSX_MAX_FILE_BYTES) {
    throw new XlsxReaderTaskError(file.size > XLSX_MAX_FILE_BYTES ? 'limit' : 'validation', 'Select a non-empty local XLSX file within the 32 MiB limit.');
  }
  const eocd = await locateEocd(file);
  const central = await readBytes(file, eocd.centralOffset, eocd.centralSize);
  const view = new DataView(central.buffer, central.byteOffset, central.byteLength);
  const partial: Array<Omit<XlsxZipEntry, 'dataOffset'>> = [];
  const names = new Set<string>();
  let offset = 0;
  let totalCompressedBytes = 0;
  let totalUncompressedBytes = 0;
  for (let index = 0; index < eocd.entries; index += 1) {
    if (offset + 46 > central.length || readU32(view, offset) !== CENTRAL_SIGNATURE) {
      throw new XlsxReaderTaskError('format', 'The XLSX ZIP central directory is malformed.');
    }
    const flags = readU16(view, offset + 8);
    const method = readU16(view, offset + 10);
    const crc32 = readU32(view, offset + 16);
    const compressedSize = readU32(view, offset + 20);
    const uncompressedSize = readU32(view, offset + 24);
    const nameLength = readU16(view, offset + 28);
    const extraLength = readU16(view, offset + 30);
    const commentLength = readU16(view, offset + 32);
    const diskStart = readU16(view, offset + 34);
    const localOffset = readU32(view, offset + 42);
    const recordLength = 46 + nameLength + extraLength + commentLength;
    if (offset + recordLength > central.length || diskStart !== 0) {
      throw new XlsxReaderTaskError('format', 'The XLSX ZIP central directory contains an invalid record.');
    }
    if ((flags & ~ALLOWED_FLAGS) !== 0 || (flags & 0x0001) !== 0 || (flags & 0x0040) !== 0 || (flags & 0x2000) !== 0) {
      throw new XlsxReaderTaskError('unsupported', 'Encrypted or masked XLSX ZIP entries are not supported.');
    }
    if (compressedSize === 0xFFFFFFFF || uncompressedSize === 0xFFFFFFFF || localOffset === 0xFFFFFFFF) {
      throw new XlsxReaderTaskError('unsupported', 'ZIP64 XLSX entries are not supported by this bounded reader.');
    }
    const nameBytes = central.subarray(offset + 46, offset + 46 + nameLength);
    const extraBytes = central.subarray(offset + 46 + nameLength, offset + 46 + nameLength + extraLength);
    if (hasZip64Extra(extraBytes)) {
      throw new XlsxReaderTaskError('unsupported', 'ZIP64 XLSX entries are not supported by this bounded reader.');
    }
    const name = decodeEntryName(nameBytes, flags);
    if (names.has(name)) {
      throw new XlsxReaderTaskError('format', 'Duplicate XLSX ZIP entry names are not accepted.');
    }
    names.add(name);
    totalCompressedBytes += compressedSize;
    totalUncompressedBytes += uncompressedSize;
    if (!Number.isSafeInteger(totalCompressedBytes) || !Number.isSafeInteger(totalUncompressedBytes)) {
      throw new XlsxReaderTaskError('limit', 'The XLSX ZIP archive declares unsupported aggregate sizes.');
    }
    partial.push({ name, flags, method, crc32, compressedSize, uncompressedSize, localOffset });
    offset += recordLength;
  }
  if (offset !== central.length) {
    throw new XlsxReaderTaskError('format', 'The XLSX ZIP central directory contains trailing records.');
  }
  const entries: XlsxZipEntry[] = [];
  for (const entry of partial) {
    entries.push({ ...entry, dataOffset: await resolveLocalDataOffset(file, entry, eocd.centralOffset) });
  }
  const ranges = entries.map(entry => ({ start: entry.localOffset, end: entry.dataOffset + entry.compressedSize })).sort((a, b) => a.start - b.start);
  for (let index = 1; index < ranges.length; index += 1) {
    if (ranges[index].start < ranges[index - 1].end) {
      throw new XlsxReaderTaskError('format', 'Overlapping XLSX ZIP entries are not accepted.');
    }
  }
  return {
    file,
    entries,
    byName: new Map(entries.map(entry => [entry.name, entry])),
    totalCompressedBytes,
    totalUncompressedBytes,
  };
}

let crcTable: Uint32Array | undefined;

function getCrcTable(): Uint32Array {
  if (crcTable) {
    return crcTable;
  }
  crcTable = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) !== 0 ? (0xEDB88320 ^ (value >>> 1)) : (value >>> 1);
    }
    crcTable[index] = value >>> 0;
  }
  return crcTable;
}

export function crc32Of(chunks: Uint8Array[]): number {
  const table = getCrcTable();
  let crc = 0xFFFFFFFF;
  for (const chunk of chunks) {
    for (const byte of chunk) {
      crc = table[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

export async function readXlsxZipEntry(archive: XlsxZipArchive, entry: XlsxZipEntry, limit: number, budget: XlsxZipReadBudget): Promise<Uint8Array> {
  if (entry.uncompressedSize > limit || budget.inflatedBytes + entry.uncompressedSize > XLSX_MAX_REQUIRED_INFLATED_BYTES) {
    throw new XlsxReaderTaskError('limit', 'A required XLSX XML part exceeds its independent or aggregate inflated-byte limit.');
  }
  if (entry.method !== 0 && entry.method !== 8) {
    throw new XlsxReaderTaskError('unsupported', 'A required XLSX ZIP entry uses an unsupported compression method.');
  }
  if (entry.method === 0 && entry.compressedSize !== entry.uncompressedSize) {
    throw new XlsxReaderTaskError('format', 'A stored XLSX ZIP entry declares inconsistent sizes.');
  }
  let readable: ReadableStream<Uint8Array> = archive.file.slice(entry.dataOffset, entry.dataOffset + entry.compressedSize).stream();
  if (entry.method === 8) {
    try {
      readable = readable.pipeThrough(new DecompressionStream('deflate-raw'));
    }
    catch {
      throw new XlsxReaderTaskError('unsupported', 'This browser does not support bounded raw-DEFLATE decompression in a worker.');
    }
  }
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const item = await reader.read();
      if (item.done) {
        break;
      }
      size += item.value.byteLength;
      if (size > entry.uncompressedSize || size > limit || budget.inflatedBytes + size > XLSX_MAX_REQUIRED_INFLATED_BYTES) {
        await reader.cancel();
        throw new XlsxReaderTaskError('limit', 'XLSX decompression exceeded the declared or configured output limit.');
      }
      chunks.push(item.value);
    }
  }
  catch (error) {
    if (error instanceof XlsxReaderTaskError) {
      throw error;
    }
    throw new XlsxReaderTaskError('format', 'A required XLSX ZIP entry could not be decompressed safely.');
  }
  if (size !== entry.uncompressedSize || crc32Of(chunks) !== entry.crc32) {
    throw new XlsxReaderTaskError('format', 'A required XLSX ZIP entry failed its size or CRC-32 check.');
  }
  const output = new Uint8Array(size);
  let outputOffset = 0;
  for (const chunk of chunks) {
    output.set(chunk, outputOffset);
    outputOffset += chunk.byteLength;
  }
  budget.inflatedBytes += size;
  return output;
}
