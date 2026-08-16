import { deflateRawSync } from 'node:zlib';
import { crc32Of } from './xlsx-reader.zip';

interface FixtureEntry {
  name: string
  content: string | Uint8Array
  deflate?: boolean
  declaredUncompressedSize?: number
  corruptCrc?: boolean
}

interface BuiltEntry {
  nameBytes: Uint8Array
  data: Uint8Array
  method: number
  crc32: number
  compressedSize: number
  uncompressedSize: number
  localOffset: number
}

const encoder = new TextEncoder();

function bytes(value: string | Uint8Array): Uint8Array {
  return typeof value === 'string' ? encoder.encode(value) : value;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.byteLength, 0));
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.byteLength;
  }
  return output;
}

function header(length: number, write: (view: DataView) => void): Uint8Array {
  const output = new Uint8Array(length);
  write(new DataView(output.buffer));
  return output;
}

export function createStoredZip(entries: FixtureEntry[]): Uint8Array {
  const localParts: Uint8Array[] = [];
  const built: BuiltEntry[] = [];
  let localOffset = 0;
  for (const entry of entries) {
    const source = bytes(entry.content);
    const data = entry.deflate ? new Uint8Array(deflateRawSync(source)) : source;
    const nameBytes = encoder.encode(entry.name);
    const actualCrc = crc32Of([source]);
    const crc32 = entry.corruptCrc ? (actualCrc + 1) >>> 0 : actualCrc;
    const local = header(30, (view) => {
      view.setUint32(0, 0x04034B50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 0x0800, true);
      view.setUint16(8, entry.deflate ? 8 : 0, true);
      view.setUint32(14, crc32, true);
      view.setUint32(18, data.byteLength, true);
      view.setUint32(22, entry.declaredUncompressedSize ?? source.byteLength, true);
      view.setUint16(26, nameBytes.byteLength, true);
      view.setUint16(28, 0, true);
    });
    localParts.push(local, nameBytes, data);
    built.push({
      nameBytes,
      data,
      method: entry.deflate ? 8 : 0,
      crc32,
      compressedSize: data.byteLength,
      uncompressedSize: entry.declaredUncompressedSize ?? source.byteLength,
      localOffset,
    });
    localOffset += local.byteLength + nameBytes.byteLength + data.byteLength;
  }
  const centralParts: Uint8Array[] = [];
  for (const entry of built) {
    const central = header(46, (view) => {
      view.setUint32(0, 0x02014B50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 20, true);
      view.setUint16(8, 0x0800, true);
      view.setUint16(10, entry.method, true);
      view.setUint32(16, entry.crc32, true);
      view.setUint32(20, entry.compressedSize, true);
      view.setUint32(24, entry.uncompressedSize, true);
      view.setUint16(28, entry.nameBytes.byteLength, true);
      view.setUint16(30, 0, true);
      view.setUint16(32, 0, true);
      view.setUint16(34, 0, true);
      view.setUint32(42, entry.localOffset, true);
    });
    centralParts.push(central, entry.nameBytes);
  }
  const central = concat(centralParts);
  const eocd = header(22, (view) => {
    view.setUint32(0, 0x06054B50, true);
    view.setUint16(8, built.length, true);
    view.setUint16(10, built.length, true);
    view.setUint32(12, central.byteLength, true);
    view.setUint32(16, localOffset, true);
  });
  return concat([...localParts, central, eocd]);
}

export function createReadableXlsxFile(bytes: Uint8Array, name = 'fixture.xlsx'): File {
  const file = new File([bytes], name, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  Object.defineProperty(file, 'slice', {
    value(start = 0, end = bytes.byteLength) {
      const part = bytes.slice(start, end);
      const blob = new Blob([part]);
      Object.defineProperties(blob, {
        arrayBuffer: {
          value: async () => {
            const buffer = new ArrayBuffer(part.byteLength);
            new Uint8Array(buffer).set(part);
            return buffer;
          },
        },
        stream: {
          value: () => new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(part);
              controller.close();
            },
          }),
        },
      });
      return blob;
    },
  });
  return file;
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
</Types>`;

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

const WORKBOOK = `<?xml version="1.0" encoding="UTF-8"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <workbookPr date1904="1"/>
  <sheets><sheet name="Data &amp; IDs" sheetId="1" state="visible" r:id="rId1"/></sheets>
</workbook>`;

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLink" Target="https://example.invalid/book.xlsx" TargetMode="External"/>
</Relationships>`;

const SHARED_STRINGS = `<?xml version="1.0" encoding="UTF-8"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="2" uniqueCount="2">
  <si><t>Hello &amp; local</t></si><si><t>=2+2</t></si>
</sst>`;

const STYLES = '<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cellXfs count="1"><xf numFmtId="0"/></cellXfs></styleSheet>';

const WORKSHEET = `<?xml version="1.0" encoding="UTF-8"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:B3"/>
  <sheetData>
    <row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>
    <row r="2"><c r="A2"><v>900719925474099312345</v></c><c r="B2" t="str"><f>CONCAT("=",2,"+",2)</f><v>=2+2</v></c></row>
    <row r="3"><c r="A3" t="b"><v>1</v></c><c r="B3"><f>NOW()</f></c></row>
  </sheetData>
</worksheet>`;

export interface XlsxFixtureOptions {
  deflate?: boolean
  workbook?: string
  worksheet?: string
  worksheetDeclaredSize?: number
  rootRelationshipsDeclaredSize?: number
  corruptRootRelationshipsCrc?: boolean
  includeMacro?: boolean
}

export function createXlsxFixture(options: XlsxFixtureOptions = {}): Uint8Array {
  const entries: FixtureEntry[] = [
    { name: '[Content_Types].xml', content: CONTENT_TYPES, deflate: options.deflate },
    { name: '_rels/.rels', content: ROOT_RELS, deflate: options.deflate, declaredUncompressedSize: options.rootRelationshipsDeclaredSize, corruptCrc: options.corruptRootRelationshipsCrc },
    { name: 'xl/workbook.xml', content: options.workbook ?? WORKBOOK, deflate: options.deflate },
    { name: 'xl/_rels/workbook.xml.rels', content: WORKBOOK_RELS, deflate: options.deflate },
    { name: 'xl/sharedStrings.xml', content: SHARED_STRINGS, deflate: options.deflate },
    { name: 'xl/styles.xml', content: STYLES, deflate: options.deflate },
    { name: 'xl/worksheets/sheet1.xml', content: options.worksheet ?? WORKSHEET, deflate: options.deflate, declaredUncompressedSize: options.worksheetDeclaredSize },
  ];
  if (options.includeMacro) {
    entries.push({ name: 'xl/vbaProject.bin', content: new Uint8Array([1, 2, 3]) });
  }
  return createStoredZip(entries);
}
