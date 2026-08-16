import { Parser } from 'saxen';
import {
  XLSX_MAX_CELL_BYTES,
  XLSX_MAX_COLUMNS,
  XLSX_MAX_CONTENT_TYPES_XML_BYTES,
  XLSX_MAX_EXPORT_BYTES,
  XLSX_MAX_FORMULA_BYTES,
  XLSX_MAX_PREVIEW_BYTES,
  XLSX_MAX_PREVIEW_COLUMNS,
  XLSX_MAX_PREVIEW_ROWS,
  XLSX_MAX_RELATIONSHIPS_XML_BYTES,
  XLSX_MAX_ROWS,
  XLSX_MAX_SHARED_STRINGS_XML_BYTES,
  XLSX_MAX_SHARED_STRING_COUNT,
  XLSX_MAX_SHEETS,
  XLSX_MAX_WORKBOOK_XML_BYTES,
  XLSX_MAX_WORKSHEET_XML_BYTES,
  type XlsxInspectionResult,
  type XlsxPreviewResult,
  XlsxReaderTaskError,
  type XlsxSheetSummary,
} from './xlsx-reader.types';
import {
  type XlsxZipArchive,
  type XlsxZipEntry,
  type XlsxZipReadBudget,
  inspectXlsxZip,
  readXlsxZipEntry,
} from './xlsx-reader.zip';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

const MAX_XML_DEPTH = 32;
const MAX_XML_ELEMENTS = 400_000;
const MAX_XML_ATTRIBUTES = 32;
const MAX_ATTRIBUTE_BYTES = 8 * 1024;
const MAX_RELATIONSHIPS = 512;
const XLSX_WORKBOOK_CONTENT_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml';

interface XmlCallbacks {
  open(name: string, attributes: Record<string, string>): void
  close(name: string): void
  text(value: string): void
}

interface Relationship {
  id: string
  kind: string
  targetMode: 'Internal' | 'External'
  target?: string
}

interface WorkbookSheet {
  name: string
  state: 'visible' | 'hidden' | 'veryHidden'
  relationshipId: string
}

interface WorkbookContext {
  archive: XlsxZipArchive
  budget: XlsxZipReadBudget
  dateSystem: '1900' | '1904'
  sheets: Array<WorkbookSheet & { relationship?: Relationship; entry?: XlsxZipEntry }>
  sharedStringsEntry?: XlsxZipEntry
  stylesEntry?: XlsxZipEntry
  externalLinkCount: number
}

interface ParsedCell {
  row: number
  column: number
  type: string
  value: string
  inline: string
  formula: string
}

function localName(name: string): string {
  const separator = name.lastIndexOf(':');
  return separator === -1 ? name : name.slice(separator + 1);
}

function decodeEntities(value: string): string {
  let output = '';
  let offset = 0;
  const pattern = /&(?:amp|lt|gt|apos|quot|#\d+|#x[\da-f]+);/giu;
  for (const match of value.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (value.slice(offset, index).includes('&')) {
      throw new XlsxReaderTaskError('format', 'An XLSX XML part contains an unsupported entity reference.');
    }
    output += value.slice(offset, index);
    const entity = match[0];
    if (entity === '&amp;') {
      output += '&';
    }
    else if (entity === '&lt;') {
      output += '<';
    }
    else if (entity === '&gt;') {
      output += '>';
    }
    else if (entity === '&apos;') {
      output += '\'';
    }
    else if (entity === '&quot;') {
      output += '"';
    }
    else {
      const hex = entity.startsWith('&#x') || entity.startsWith('&#X');
      const digits = entity.slice(hex ? 3 : 2, -1);
      const codePoint = Number.parseInt(digits, hex ? 16 : 10);
      if (!Number.isInteger(codePoint) || codePoint <= 0 || codePoint > 0x10FFFF || (codePoint >= 0xD800 && codePoint <= 0xDFFF)) {
        throw new XlsxReaderTaskError('format', 'An XLSX XML part contains an invalid character reference.');
      }
      output += String.fromCodePoint(codePoint);
    }
    offset = index + entity.length;
  }
  if (value.slice(offset).includes('&')) {
    throw new XlsxReaderTaskError('format', 'An XLSX XML part contains an unsupported entity reference.');
  }
  return output + value.slice(offset);
}

function decodeXml(bytes: Uint8Array): string {
  let xml: string;
  try {
    xml = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  catch {
    throw new XlsxReaderTaskError('unsupported', 'Only UTF-8 XLSX XML parts are supported.');
  }
  if (/<!DOCTYPE|<!ENTITY|<\?xml-stylesheet/iu.test(xml) || xml.includes('\0')) {
    throw new XlsxReaderTaskError('unsupported', 'DTD, entity declarations, XML stylesheets, and NUL bytes are not accepted in XLSX XML parts.');
  }
  return xml;
}

function parseXml(bytes: Uint8Array, callbacks: XmlCallbacks): void {
  const xml = decodeXml(bytes);
  const parser = new Parser();
  let depth = 0;
  let elements = 0;
  let parseError: Error | undefined;
  let sawXmlDeclaration = false;
  parser.on('openTag', (name, getAttributes) => {
    depth += 1;
    elements += 1;
    if (depth > MAX_XML_DEPTH || elements > MAX_XML_ELEMENTS) {
      throw new XlsxReaderTaskError('limit', 'An XLSX XML part exceeds the nesting or element limit.');
    }
    const rawAttributes = getAttributes();
    const keys = Object.keys(rawAttributes);
    if (keys.length > MAX_XML_ATTRIBUTES) {
      throw new XlsxReaderTaskError('limit', 'An XLSX XML element has too many attributes.');
    }
    const attributes: Record<string, string> = {};
    for (const key of keys) {
      const decoded = decodeEntities(rawAttributes[key]);
      if (exceedsUtf8ByteLimit(key, 256) || exceedsUtf8ByteLimit(decoded, MAX_ATTRIBUTE_BYTES)) {
        throw new XlsxReaderTaskError('limit', 'An XLSX XML attribute exceeds the supported limit.');
      }
      attributes[key] = decoded;
    }
    callbacks.open(localName(name), attributes);
  });
  parser.on('closeTag', (name) => {
    callbacks.close(localName(name));
    depth -= 1;
  });
  parser.on('text', value => callbacks.text(decodeEntities(value)));
  parser.on('cdata', value => callbacks.text(value));
  parser.on('attention', () => {
    throw new XlsxReaderTaskError('unsupported', 'XML declarations beyond the standard prolog are not supported.');
  });
  parser.on('question', (value) => {
    const declaration = value.trim();
    if (sawXmlDeclaration || !/^<\?xml(?:\s|\?>)/iu.test(declaration) || !xml.trimStart().startsWith(declaration)) {
      throw new XlsxReaderTaskError('unsupported', 'XML processing instructions are not supported in XLSX parts.');
    }
    sawXmlDeclaration = true;
  });
  parser.on('error', (error) => {
    parseError = error;
  });
  parser.on('warn', (error) => {
    parseError = error;
  });
  const returned = parser.parse(xml);
  if (returned || parseError || depth !== 0) {
    throw new XlsxReaderTaskError('format', 'An XLSX XML part is not well formed.');
  }
}

function getAttribute(attributes: Record<string, string>, local: string): string | undefined {
  const match = Object.entries(attributes).find(([key]) => localName(key) === local);
  return match?.[1];
}

function relationshipKind(type: string): string {
  const clean = type.replace(/\/$/u, '');
  return clean.slice(clean.lastIndexOf('/') + 1);
}

function normalizeTarget(sourcePart: string, rawTarget: string): string {
  if (rawTarget.length === 0 || rawTarget.length > 1024 || rawTarget.includes('\\') || rawTarget.includes('\0') || rawTarget.includes('?') || rawTarget.includes('#') || /^[a-z][a-z\d+.-]*:/iu.test(rawTarget)) {
    throw new XlsxReaderTaskError('format', 'An XLSX relationship contains an unsafe target.');
  }
  const prefix = rawTarget.startsWith('/') ? '' : sourcePart.slice(0, Math.max(0, sourcePart.lastIndexOf('/') + 1));
  const parts: string[] = [];
  for (const rawPart of `${prefix}${rawTarget.replace(/^\/+/, '')}`.split('/')) {
    let part: string;
    try {
      part = decodeURIComponent(rawPart);
    }
    catch {
      throw new XlsxReaderTaskError('format', 'An XLSX relationship contains invalid percent encoding.');
    }
    if (part === '' || part === '.') {
      continue;
    }
    if (part === '..') {
      if (parts.length === 0) {
        throw new XlsxReaderTaskError('format', 'An XLSX relationship escapes the package root.');
      }
      parts.pop();
      continue;
    }
    if (part.includes('/') || part.includes('\\') || part.includes('\0')) {
      throw new XlsxReaderTaskError('format', 'An XLSX relationship contains an unsafe encoded path.');
    }
    parts.push(part);
  }
  if (parts.length === 0) {
    throw new XlsxReaderTaskError('format', 'An XLSX relationship resolves to an empty part name.');
  }
  return parts.join('/');
}

function relationshipsPartName(sourcePart: string): string {
  const separator = sourcePart.lastIndexOf('/');
  const directory = separator === -1 ? '' : sourcePart.slice(0, separator + 1);
  const filename = separator === -1 ? sourcePart : sourcePart.slice(separator + 1);
  return `${directory}_rels/${filename}.rels`;
}

function parseRelationships(bytes: Uint8Array, sourcePart: string): Relationship[] {
  const relationships: Relationship[] = [];
  const ids = new Set<string>();
  parseXml(bytes, {
    open(name, attributes) {
      if (name !== 'Relationship') {
        return;
      }
      if (relationships.length >= MAX_RELATIONSHIPS) {
        throw new XlsxReaderTaskError('limit', 'An XLSX relationships part contains too many entries.');
      }
      const id = getAttribute(attributes, 'Id');
      const type = getAttribute(attributes, 'Type');
      const rawTarget = getAttribute(attributes, 'Target');
      const targetModeValue = getAttribute(attributes, 'TargetMode');
      if (!id || !type || !rawTarget || ids.has(id) || exceedsUtf8ByteLimit(id, 256) || exceedsUtf8ByteLimit(type, 1024)) {
        throw new XlsxReaderTaskError('format', 'An XLSX relationship is incomplete or duplicated.');
      }
      ids.add(id);
      const targetMode = targetModeValue === 'External' ? 'External' : 'Internal';
      relationships.push({ id, kind: relationshipKind(type), targetMode, target: targetMode === 'Internal' ? normalizeTarget(sourcePart, rawTarget) : undefined });
    },
    close() {},
    text() {},
  });
  return relationships;
}

function parseWorkbook(bytes: Uint8Array): { dateSystem: '1900' | '1904'; sheets: WorkbookSheet[] } {
  let dateSystem: '1900' | '1904' = '1900';
  const sheets: WorkbookSheet[] = [];
  const names = new Set<string>();
  parseXml(bytes, {
    open(name, attributes) {
      if (name === 'workbookPr') {
        const date1904 = getAttribute(attributes, 'date1904');
        if (date1904 === '1' || date1904 === 'true') {
          dateSystem = '1904';
        }
      }
      if (name !== 'sheet') {
        return;
      }
      if (sheets.length >= XLSX_MAX_SHEETS) {
        throw new XlsxReaderTaskError('limit', 'The XLSX workbook contains too many sheets.');
      }
      const sheetName = getAttribute(attributes, 'name');
      const relationshipId = getAttribute(attributes, 'id');
      const stateValue = getAttribute(attributes, 'state') ?? 'visible';
      if (!sheetName || !relationshipId || names.has(sheetName) || exceedsUtf8ByteLimit(sheetName, 256) || exceedsUtf8ByteLimit(relationshipId, 256)
        || !['visible', 'hidden', 'veryHidden'].includes(stateValue)) {
        throw new XlsxReaderTaskError('format', 'The XLSX workbook contains invalid sheet metadata.');
      }
      names.add(sheetName);
      sheets.push({ name: sheetName, relationshipId, state: stateValue as WorkbookSheet['state'] });
    },
    close() {},
    text() {},
  });
  if (sheets.length === 0) {
    throw new XlsxReaderTaskError('format', 'The XLSX workbook does not contain a sheet.');
  }
  return { dateSystem, sheets };
}

function parseContentTypes(bytes: Uint8Array): Map<string, string> {
  const overrides = new Map<string, string>();
  parseXml(bytes, {
    open(name, attributes) {
      if (name !== 'Override') {
        return;
      }
      const partName = getAttribute(attributes, 'PartName');
      const contentType = getAttribute(attributes, 'ContentType');
      if (!partName || !contentType || !partName.startsWith('/')) {
        throw new XlsxReaderTaskError('format', 'The XLSX content-types part contains an invalid override.');
      }
      const normalized = normalizeTarget('', partName);
      if (overrides.has(normalized)) {
        throw new XlsxReaderTaskError('format', 'The XLSX content-types part contains a duplicate override.');
      }
      overrides.set(normalized, contentType);
    },
    close() {},
    text() {},
  });
  return overrides;
}

function requireEntry(archive: XlsxZipArchive, name: string): XlsxZipEntry {
  const entry = archive.byName.get(name);
  if (!entry) {
    throw new XlsxReaderTaskError('format', 'The XLSX package is missing a required part.');
  }
  return entry;
}

async function loadWorkbookContext(file: Blob): Promise<WorkbookContext> {
  const archive = await inspectXlsxZip(file);
  if (archive.entries.some(entry => /(^|\/)vbaProject\.bin$/iu.test(entry.name) || /(^|\/)macrosheets\//iu.test(entry.name))) {
    throw new XlsxReaderTaskError('unsupported', 'Macro-enabled workbooks are not accepted; select a macro-free .xlsx file.');
  }
  const budget: XlsxZipReadBudget = { inflatedBytes: 0 };
  const contentTypesBytes = await readXlsxZipEntry(archive, requireEntry(archive, '[Content_Types].xml'), XLSX_MAX_CONTENT_TYPES_XML_BYTES, budget);
  const rootRelationshipsBytes = await readXlsxZipEntry(archive, requireEntry(archive, '_rels/.rels'), XLSX_MAX_RELATIONSHIPS_XML_BYTES, budget);
  const contentTypes = parseContentTypes(contentTypesBytes);
  const rootRelationships = parseRelationships(rootRelationshipsBytes, '');
  const workbookRelationships = rootRelationships.filter(relationship => relationship.kind === 'officeDocument');
  if (workbookRelationships.length !== 1 || workbookRelationships[0].targetMode !== 'Internal' || !workbookRelationships[0].target) {
    throw new XlsxReaderTaskError('format', 'The XLSX package must contain one internal workbook relationship.');
  }
  const workbookPath = workbookRelationships[0].target;
  if (contentTypes.get(workbookPath) !== XLSX_WORKBOOK_CONTENT_TYPE) {
    throw new XlsxReaderTaskError('unsupported', 'Only macro-free XLSX SpreadsheetML workbooks are supported.');
  }
  const workbookBytes = await readXlsxZipEntry(archive, requireEntry(archive, workbookPath), XLSX_MAX_WORKBOOK_XML_BYTES, budget);
  const workbookRelationshipBytes = await readXlsxZipEntry(archive, requireEntry(archive, relationshipsPartName(workbookPath)), XLSX_MAX_RELATIONSHIPS_XML_BYTES, budget);
  const workbook = parseWorkbook(workbookBytes);
  const relations = parseRelationships(workbookRelationshipBytes, workbookPath);
  if (relations.some(relationship => relationship.kind === 'vbaProject')) {
    throw new XlsxReaderTaskError('unsupported', 'Macro-enabled workbooks are not accepted; select a macro-free .xlsx file.');
  }
  const byId = new Map(relations.map(relationship => [relationship.id, relationship]));
  const sheets = workbook.sheets.map((sheet) => {
    const relationship = byId.get(sheet.relationshipId);
    const entry = relationship?.targetMode === 'Internal' && relationship.target ? archive.byName.get(relationship.target) : undefined;
    if (!relationship || (relationship.kind === 'worksheet' && !entry)) {
      throw new XlsxReaderTaskError('format', 'An XLSX sheet relationship is missing or invalid.');
    }
    return { ...sheet, relationship, entry };
  });
  const sharedRelation = relations.find(relationship => relationship.kind === 'sharedStrings' && relationship.targetMode === 'Internal');
  const stylesRelation = relations.find(relationship => relationship.kind === 'styles' && relationship.targetMode === 'Internal');
  const sharedStringsEntry = sharedRelation?.target ? archive.byName.get(sharedRelation.target) : undefined;
  const stylesEntry = stylesRelation?.target ? archive.byName.get(stylesRelation.target) : undefined;
  if (sharedRelation && !sharedStringsEntry) {
    throw new XlsxReaderTaskError('format', 'The XLSX shared-strings relationship target is missing.');
  }
  if (stylesRelation && !stylesEntry) {
    throw new XlsxReaderTaskError('format', 'The XLSX styles relationship target is missing.');
  }
  return {
    archive,
    budget,
    dateSystem: workbook.dateSystem,
    sheets,
    sharedStringsEntry,
    stylesEntry,
    externalLinkCount: [...rootRelationships, ...relations].filter(relationship => relationship.targetMode === 'External' || relationship.kind === 'externalLink').length,
  };
}

export async function inspectXlsx(file: Blob): Promise<XlsxInspectionResult> {
  const context = await loadWorkbookContext(file);
  const sheets: XlsxSheetSummary[] = context.sheets.map((sheet) => {
    const worksheet = sheet.relationship?.kind === 'worksheet';
    return {
      name: sheet.name,
      state: sheet.state,
      kind: worksheet ? 'worksheet' : 'unsupported',
      compressedBytes: sheet.entry?.compressedSize ?? 0,
      uncompressedBytes: sheet.entry?.uncompressedSize ?? 0,
      previewSupported: Boolean(worksheet && sheet.entry && [0, 8].includes(sheet.entry.method) && sheet.entry.uncompressedSize <= XLSX_MAX_WORKSHEET_XML_BYTES),
    };
  });
  return {
    kind: 'inspection',
    fileSize: file.size,
    entryCount: context.archive.entries.length,
    totalCompressedBytes: context.archive.totalCompressedBytes,
    totalUncompressedBytes: context.archive.totalUncompressedBytes,
    dateSystem: context.dateSystem,
    hasSharedStrings: Boolean(context.sharedStringsEntry),
    sharedStringsBytes: context.sharedStringsEntry?.uncompressedSize ?? 0,
    stylesBytes: context.stylesEntry?.uncompressedSize ?? 0,
    externalLinkCount: context.externalLinkCount,
    sheets,
  };
}

function columnNumber(label: string): number {
  let value = 0;
  for (const character of label) {
    value = value * 26 + character.charCodeAt(0) - 64;
  }
  return value;
}

export function columnLabel(value: number): string {
  let remaining = value;
  let label = '';
  while (remaining > 0) {
    remaining -= 1;
    label = String.fromCharCode(65 + (remaining % 26)) + label;
    remaining = Math.floor(remaining / 26);
  }
  return label;
}

function parseCellReference(reference: string): { row: number; column: number } {
  const match = /^\$?([A-Z]{1,3})\$?([1-9]\d{0,6})$/u.exec(reference);
  if (!match) {
    throw new XlsxReaderTaskError('format', 'The XLSX worksheet contains an invalid cell reference.');
  }
  const column = columnNumber(match[1]);
  const row = Number(match[2]);
  if (row > XLSX_MAX_ROWS || column > XLSX_MAX_COLUMNS) {
    throw new XlsxReaderTaskError('limit', 'The XLSX worksheet exceeds the spreadsheet row or column limit.');
  }
  return { row, column };
}

function appendBounded(current: string, value: string, limit: number, message: string): string {
  const next = current + value;
  if (exceedsUtf8ByteLimit(next, limit)) {
    throw new XlsxReaderTaskError('limit', message);
  }
  return next;
}

function parseWorksheet(bytes: Uint8Array, rowStart: number, rowCount: number, columnStart: number, columnCount: number): { cells: ParsedCell[]; sharedIndexes: Set<number>; totalRows: number; formulaCellCount: number; missingFormulaResultCount: number } {
  const cells: ParsedCell[] = [];
  const sharedIndexes = new Set<number>();
  const rowEnd = rowStart + rowCount - 1;
  const columnEnd = columnStart + columnCount - 1;
  let currentRow = 0;
  let inferredRow = 0;
  let inferredColumn = 0;
  let currentCell: ParsedCell | undefined;
  let capture: 'value' | 'inline' | 'formula' | undefined;
  let totalRows = 0;
  let formulaCellCount = 0;
  let missingFormulaResultCount = 0;
  parseXml(bytes, {
    open(name, attributes) {
      if (name === 'dimension') {
        const reference = getAttribute(attributes, 'ref');
        const last = reference?.split(':').at(-1);
        if (last) {
          totalRows = Math.max(totalRows, parseCellReference(last).row);
        }
      }
      if (name === 'row') {
        const rowValue = getAttribute(attributes, 'r');
        currentRow = rowValue ? Number(rowValue) : inferredRow + 1;
        if (!Number.isInteger(currentRow) || currentRow < 1 || currentRow > XLSX_MAX_ROWS || currentRow <= inferredRow) {
          throw new XlsxReaderTaskError('format', 'The XLSX worksheet contains invalid or unordered row numbers.');
        }
        inferredRow = currentRow;
        inferredColumn = 0;
        totalRows = Math.max(totalRows, currentRow);
      }
      if (name === 'c') {
        const reference = getAttribute(attributes, 'r');
        const position = reference ? parseCellReference(reference) : { row: currentRow, column: inferredColumn + 1 };
        if (position.row !== currentRow || position.column <= inferredColumn || position.column > XLSX_MAX_COLUMNS) {
          throw new XlsxReaderTaskError('format', 'The XLSX worksheet contains invalid or unordered cell coordinates.');
        }
        inferredColumn = position.column;
        currentCell = { row: position.row, column: position.column, type: getAttribute(attributes, 't') ?? 'n', value: '', inline: '', formula: '' };
      }
      if (!currentCell) {
        return;
      }
      if (name === 'v') {
        capture = 'value';
      }
      else if (name === 'f') {
        capture = 'formula';
      }
      else if (name === 't' && currentCell.type === 'inlineStr') {
        capture = 'inline';
      }
    },
    close(name) {
      if (name === 'v' || name === 'f' || name === 't') {
        capture = undefined;
      }
      if (name !== 'c' || !currentCell) {
        return;
      }
      if (currentCell.row >= rowStart && currentCell.row <= rowEnd && currentCell.column >= columnStart && currentCell.column <= columnEnd) {
        if (currentCell.formula) {
          formulaCellCount += 1;
          if (!currentCell.value) {
            missingFormulaResultCount += 1;
          }
        }
        if (currentCell.type === 's' && currentCell.value) {
          if (!/^\d{1,9}$/u.test(currentCell.value)) {
            throw new XlsxReaderTaskError('format', 'An XLSX shared-string index is invalid.');
          }
          const index = Number(currentCell.value);
          if (index >= XLSX_MAX_SHARED_STRING_COUNT) {
            throw new XlsxReaderTaskError('limit', 'An XLSX shared-string index exceeds the supported limit.');
          }
          sharedIndexes.add(index);
        }
        cells.push(currentCell);
      }
      currentCell = undefined;
      capture = undefined;
    },
    text(value) {
      if (!currentCell || !capture) {
        return;
      }
      if (capture === 'value') {
        currentCell.value = appendBounded(currentCell.value, value, XLSX_MAX_CELL_BYTES, 'An XLSX cell value exceeds the supported limit.');
      }
      else if (capture === 'inline') {
        currentCell.inline = appendBounded(currentCell.inline, value, XLSX_MAX_CELL_BYTES, 'An XLSX inline string exceeds the supported limit.');
      }
      else {
        currentCell.formula = appendBounded(currentCell.formula, value, XLSX_MAX_FORMULA_BYTES, 'An XLSX formula exceeds the supported limit.');
      }
    },
  });
  return { cells, sharedIndexes, totalRows, formulaCellCount, missingFormulaResultCount };
}

function parseSharedStrings(bytes: Uint8Array, needed: Set<number>): Map<number, string> {
  const values = new Map<number, string>();
  let index = -1;
  let current = '';
  let capture = false;
  parseXml(bytes, {
    open(name) {
      if (name === 'si') {
        index += 1;
        if (index >= XLSX_MAX_SHARED_STRING_COUNT) {
          throw new XlsxReaderTaskError('limit', 'The XLSX shared-string table exceeds the supported count.');
        }
        current = '';
      }
      if (name === 't' && index >= 0) {
        capture = true;
      }
    },
    close(name) {
      if (name === 't') {
        capture = false;
      }
      if (name === 'si' && needed.has(index)) {
        values.set(index, current);
      }
    },
    text(value) {
      if (capture && needed.has(index)) {
        current = appendBounded(current, value, XLSX_MAX_CELL_BYTES, 'An XLSX shared string exceeds the supported cell limit.');
      }
    },
  });
  for (const neededIndex of needed) {
    if (!values.has(neededIndex)) {
      throw new XlsxReaderTaskError('format', 'An XLSX cell references a missing shared string.');
    }
  }
  return values;
}

function displayCell(cell: ParsedCell, shared: Map<number, string>): string {
  if (cell.type === 's') {
    return cell.value ? shared.get(Number(cell.value)) ?? '' : '';
  }
  if (cell.type === 'inlineStr') {
    return cell.inline;
  }
  if (cell.type === 'b') {
    if (cell.value === '1') {
      return 'TRUE';
    }
    if (cell.value === '0') {
      return 'FALSE';
    }
    throw new XlsxReaderTaskError('format', 'An XLSX Boolean cell contains an invalid value.');
  }
  if (cell.type === 'e' || cell.type === 'str' || cell.type === 'd') {
    return cell.value;
  }
  if (cell.value === '') {
    return '';
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/u.test(cell.value)) {
    throw new XlsxReaderTaskError('format', 'An XLSX numeric cell contains an invalid stored value.');
  }
  return cell.value;
}

function csvCell(value: string): string {
  const protectedValue = /^[\t\r\n ]*[=+\-@]/u.test(value) ? `'${value}` : value;
  return /[",\r\n]/u.test(protectedValue) ? `"${protectedValue.replace(/"/gu, '""')}"` : protectedValue;
}

function buildExports(columns: string[], rows: string[][], rowStart: number): { json: string; csv: string } {
  const objects = rows.map((row, index) => Object.fromEntries([['_row', String(rowStart + index)], ...columns.map((column, columnIndex) => [column, row[columnIndex]])]));
  const json = JSON.stringify(objects, null, 2);
  const csv = [['_row', ...columns].map(csvCell).join(','), ...rows.map((row, index) => [String(rowStart + index), ...row].map(csvCell).join(','))].join('\r\n');
  if (exceedsUtf8ByteLimit(json, XLSX_MAX_EXPORT_BYTES) || exceedsUtf8ByteLimit(csv, XLSX_MAX_EXPORT_BYTES)) {
    throw new XlsxReaderTaskError('limit', 'The selected XLSX page exceeds the JSON or CSV export limit.');
  }
  return { json, csv };
}

export async function previewXlsx(file: Blob, sheetIndex: number, rowStart: number, rowCount: number, columnStart: number, columnCount: number): Promise<XlsxPreviewResult> {
  if (!Number.isInteger(sheetIndex) || sheetIndex < 0 || sheetIndex >= XLSX_MAX_SHEETS
    || !Number.isInteger(rowStart) || rowStart < 1 || rowStart > XLSX_MAX_ROWS
    || !Number.isInteger(rowCount) || rowCount < 1 || rowCount > XLSX_MAX_PREVIEW_ROWS || rowStart + rowCount - 1 > XLSX_MAX_ROWS
    || !Number.isInteger(columnStart) || columnStart < 1 || columnStart > XLSX_MAX_COLUMNS
    || !Number.isInteger(columnCount) || columnCount < 1 || columnCount > XLSX_MAX_PREVIEW_COLUMNS || columnStart + columnCount - 1 > XLSX_MAX_COLUMNS) {
    throw new XlsxReaderTaskError('validation', 'Select a valid bounded XLSX sheet page.');
  }
  const context = await loadWorkbookContext(file);
  const sheet = context.sheets[sheetIndex];
  if (!sheet || sheet.relationship?.kind !== 'worksheet' || !sheet.entry) {
    throw new XlsxReaderTaskError('unsupported', 'The selected workbook sheet is not a supported worksheet.');
  }
  const worksheetBytes = await readXlsxZipEntry(context.archive, sheet.entry, XLSX_MAX_WORKSHEET_XML_BYTES, context.budget);
  const parsed = parseWorksheet(worksheetBytes, rowStart, rowCount, columnStart, columnCount);
  let shared = new Map<number, string>();
  if (parsed.sharedIndexes.size > 0) {
    if (!context.sharedStringsEntry) {
      throw new XlsxReaderTaskError('format', 'The XLSX worksheet references a missing shared-string table.');
    }
    const sharedBytes = await readXlsxZipEntry(context.archive, context.sharedStringsEntry, XLSX_MAX_SHARED_STRINGS_XML_BYTES, context.budget);
    shared = parseSharedStrings(sharedBytes, parsed.sharedIndexes);
  }
  const columns = Array.from({ length: columnCount }, (_, index) => columnLabel(columnStart + index));
  const rows = Array.from({ length: rowCount }, () => Array.from({ length: columnCount }, () => ''));
  for (const cell of parsed.cells) {
    rows[cell.row - rowStart][cell.column - columnStart] = displayCell(cell, shared);
  }
  let previewText = '';
  for (const row of rows) {
    for (const cell of row) {
      previewText = appendBounded(previewText, `${cell}\0`, XLSX_MAX_PREVIEW_BYTES, 'The selected XLSX page exceeds the preview limit.');
    }
  }
  const exports = buildExports(columns, rows, rowStart);
  return {
    kind: 'preview',
    fileSize: file.size,
    sheetIndex,
    sheetName: sheet.name,
    rowStart,
    rowEnd: rowStart + rowCount - 1,
    columnStart,
    columnEnd: columnStart + columnCount - 1,
    totalRows: parsed.totalRows,
    columns,
    rows,
    formulaCellCount: parsed.formulaCellCount,
    missingFormulaResultCount: parsed.missingFormulaResultCount,
    ...exports,
  };
}
