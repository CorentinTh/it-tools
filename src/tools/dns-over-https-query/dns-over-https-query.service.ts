import { inspectIdn } from '../idn-safety-converter/idn-safety-converter.service';

export const DNS_MESSAGE_MAX_BYTES = 65_535;
export const DNS_RECORD_MAX_COUNT = 256;
export const DNS_NAME_MAX_WIRE_BYTES = 255;
export const DNS_NAME_MAX_CHARACTERS = 1_024;
export const DNS_REPORT_MAX_BYTES = 256 * 1_024;

export const DNS_QUERY_TYPES = [
  { label: 'A — IPv4 address', mnemonic: 'A', value: 1 },
  { label: 'AAAA — IPv6 address', mnemonic: 'AAAA', value: 28 },
  { label: 'CNAME — canonical name', mnemonic: 'CNAME', value: 5 },
  { label: 'MX — mail exchanger', mnemonic: 'MX', value: 15 },
  { label: 'TXT — text record', mnemonic: 'TXT', value: 16 },
  { label: 'NS — authoritative name server', mnemonic: 'NS', value: 2 },
  { label: 'SOA — zone authority', mnemonic: 'SOA', value: 6 },
  { label: 'PTR — reverse lookup', mnemonic: 'PTR', value: 12 },
  { label: 'SRV — service location', mnemonic: 'SRV', value: 33 },
  { label: 'CAA — certificate authority authorization', mnemonic: 'CAA', value: 257 },
] as const;

export type DnsQueryType = typeof DNS_QUERY_TYPES[number]['mnemonic'];

export interface DnsQuestion {
  name: string
  type: number
  typeName: string
  class: number
  className: string
}

export type DnsSection = 'answer' | 'authority' | 'additional';

export interface DnsRecord {
  section: DnsSection
  name: string
  type: number
  typeName: string
  class: number
  className: string
  ttl: number
  value: string
}

export interface ParsedDnsMessage {
  id: number
  opcode: number
  opcodeName: string
  rcode: number
  rcodeName: string
  flags: string[]
  question: DnsQuestion
  answers: DnsRecord[]
  authorities: DnsRecord[]
  additionals: DnsRecord[]
  wireBytes: number
}

export interface EncodedDnsQuery {
  bytes: Uint8Array
  canonicalName: string
  type: number
  typeName: DnsQueryType
}

interface ReadNameResult {
  name: string
  nextOffset: number
}

const encoder = new TextEncoder();
const TYPE_NAMES = new Map<number, string>(DNS_QUERY_TYPES.map(({ mnemonic, value }) => [value, mnemonic]));
const CLASS_NAMES = new Map<number, string>([[1, 'IN'], [41, 'OPT']]);
const OPCODE_NAMES = ['QUERY', 'IQUERY', 'STATUS', 'RESERVED', 'NOTIFY', 'UPDATE'];
const RCODE_NAMES = new Map<number, string>([
  [0, 'NOERROR'], [1, 'FORMERR'], [2, 'SERVFAIL'], [3, 'NXDOMAIN'], [4, 'NOTIMP'], [5, 'REFUSED'],
  [6, 'YXDOMAIN'], [7, 'YXRRSET'], [8, 'NXRRSET'], [9, 'NOTAUTH'], [10, 'NOTZONE'], [16, 'BADVERS'],
]);

function fail(message: string): never {
  throw new TypeError(message);
}

function readUint16(bytes: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 2 > bytes.length) {
    fail('The DNS message is truncated.');
  }
  return (bytes[offset]! << 8) | bytes[offset + 1]!;
}

function readUint32(bytes: Uint8Array, offset: number): number {
  if (offset < 0 || offset + 4 > bytes.length) {
    fail('The DNS message is truncated.');
  }
  return (bytes[offset]! * 0x1_00_00_00) + (bytes[offset + 1]! << 16) + (bytes[offset + 2]! << 8) + bytes[offset + 3]!;
}

function writeUint16(bytes: Uint8Array, offset: number, value: number) {
  bytes[offset] = (value >>> 8) & 0xFF;
  bytes[offset + 1] = value & 0xFF;
}

function escapeDnsBytes(bytes: Uint8Array): string {
  let output = '';
  for (const byte of bytes) {
    if (byte >= 0x21 && byte <= 0x7E && byte !== 0x22 && byte !== 0x2E && byte !== 0x5C) {
      output += String.fromCharCode(byte);
    }
    else {
      output += `\\${byte.toString().padStart(3, '0')}`;
    }
  }
  return output;
}

function normalizeDnsName(source: string): string {
  const normalizedDots = source.trim().replace(/[。．｡]/gu, '.');
  if (!normalizedDots || normalizedDots.length > DNS_NAME_MAX_CHARACTERS || /[\s\p{Control}/@:?#\\]/u.test(normalizedDots)) {
    fail('Enter one DNS name without a URL scheme, path, port, whitespace, or control characters.');
  }
  if (normalizedDots === '.') {
    return '.';
  }

  const trailingDot = normalizedDots.endsWith('.');
  const unrooted = trailingDot ? normalizedDots.slice(0, -1) : normalizedDots;
  if (!unrooted || unrooted.includes('..')) {
    fail('DNS labels cannot be empty.');
  }

  let ascii: string;
  if (/^\p{ASCII}+$/u.test(unrooted)) {
    const labels = unrooted.split('.');
    for (const label of labels) {
      if (!/^[A-Za-z0-9_-]+$/u.test(label) || label.startsWith('-') || label.endsWith('-')) {
        fail('DNS labels may contain ASCII letters, digits, underscores, and interior hyphens.');
      }
      if (encoder.encode(label).length > 63) {
        fail('Each encoded DNS label is limited to 63 bytes.');
      }
    }
    ascii = labels.join('.').toLowerCase();
  }
  else {
    if (unrooted.includes('_')) {
      fail('Unicode DNS names with service underscores are not supported; enter canonical ASCII/Punycode labels.');
    }
    try {
      ascii = inspectIdn(unrooted).ascii.replace(/\.$/u, '').toLowerCase();
    }
    catch {
      fail('The Unicode DNS name could not be converted to canonical Punycode within DNS limits.');
    }
  }

  if (encoder.encode(ascii).length > 253) {
    fail('The encoded DNS name exceeds the 253-byte presentation limit.');
  }
  return `${ascii}.`;
}

function typeValue(typeName: DnsQueryType): number {
  const option = DNS_QUERY_TYPES.find(option => option.mnemonic === typeName);
  if (!option) {
    fail('The DNS query type is not supported.');
  }
  return option.value;
}

export function encodeDnsQuery(nameSource: string, typeName: DnsQueryType): EncodedDnsQuery {
  const canonicalName = normalizeDnsName(nameSource);
  const labels = canonicalName === '.' ? [] : canonicalName.slice(0, -1).split('.');
  const qnameLength = labels.reduce((total, label) => total + 1 + encoder.encode(label).length, 1);
  if (qnameLength > DNS_NAME_MAX_WIRE_BYTES) {
    fail('The encoded DNS name exceeds the 255-byte wire-format limit.');
  }
  const type = typeValue(typeName);
  const bytes = new Uint8Array(12 + qnameLength + 4);
  writeUint16(bytes, 0, 0);
  writeUint16(bytes, 2, 0x0100);
  writeUint16(bytes, 4, 1);
  let offset = 12;
  for (const label of labels) {
    const encodedLabel = encoder.encode(label);
    bytes[offset++] = encodedLabel.length;
    bytes.set(encodedLabel, offset);
    offset += encodedLabel.length;
  }
  bytes[offset++] = 0;
  writeUint16(bytes, offset, type);
  writeUint16(bytes, offset + 2, 1);
  return { bytes, canonicalName, type, typeName };
}

function readName(bytes: Uint8Array, startOffset: number): ReadNameResult {
  if (!Number.isSafeInteger(startOffset) || startOffset < 0 || startOffset >= bytes.length) {
    fail('A DNS name starts outside the message.');
  }
  const labels: string[] = [];
  const visited = new Set<number>();
  let cursor = startOffset;
  let nextOffset: number | undefined;
  let expandedBytes = 1;
  let pointerHops = 0;

  while (true) {
    if (cursor >= bytes.length) {
      fail('A DNS name is truncated.');
    }
    const length = bytes[cursor]!;
    if ((length & 0xC0) === 0xC0) {
      if (cursor + 1 >= bytes.length) {
        fail('A DNS compression pointer is truncated.');
      }
      const pointer = ((length & 0x3F) << 8) | bytes[cursor + 1]!;
      if (pointer >= cursor || pointer >= bytes.length) {
        fail('A DNS compression pointer must refer to an earlier message offset.');
      }
      if (visited.has(pointer) || ++pointerHops > 32) {
        fail('A DNS compression pointer loop was rejected.');
      }
      visited.add(pointer);
      nextOffset ??= cursor + 2;
      cursor = pointer;
      continue;
    }
    if ((length & 0xC0) !== 0) {
      fail('An unsupported DNS label encoding was rejected.');
    }
    cursor += 1;
    if (length === 0) {
      return { name: labels.length ? `${labels.join('.')}.` : '.', nextOffset: nextOffset ?? cursor };
    }
    if (length > 63 || cursor + length > bytes.length) {
      fail('A DNS label is invalid or truncated.');
    }
    expandedBytes += length + 1;
    if (expandedBytes > DNS_NAME_MAX_WIRE_BYTES) {
      fail('An expanded DNS name exceeds 255 bytes.');
    }
    labels.push(escapeDnsBytes(bytes.subarray(cursor, cursor + length)));
    cursor += length;
  }
}

function expectRdataEnd(offset: number, end: number) {
  if (offset !== end) {
    fail('A DNS record contains trailing or truncated RDATA.');
  }
}

function formatIpv6(bytes: Uint8Array): string {
  if (bytes.length !== 16) {
    fail('An AAAA record must contain exactly 16 address bytes.');
  }
  const groups = Array.from({ length: 8 }, (_, index) => readUint16(bytes, index * 2));
  let bestStart = -1;
  let bestLength = 0;
  for (let start = 0; start < groups.length;) {
    if (groups[start] !== 0) {
      start += 1;
      continue;
    }
    let end = start;
    while (end < groups.length && groups[end] === 0) {
      end += 1;
    }
    if (end - start >= 2 && end - start > bestLength) {
      bestStart = start;
      bestLength = end - start;
    }
    start = end;
  }
  const parts: string[] = [];
  for (let index = 0; index < groups.length; index += 1) {
    if (index === bestStart) {
      parts.push('');
      index += bestLength - 1;
      if (index === groups.length - 1) {
        parts.push('');
      }
    }
    else {
      parts.push(groups[index]!.toString(16));
    }
  }
  const value = parts.join(':');
  return value.startsWith(':') ? `:${value}` : value;
}

function formatTxt(bytes: Uint8Array, start: number, end: number): string {
  const chunks: string[] = [];
  let offset = start;
  while (offset < end) {
    const length = bytes[offset++]!;
    if (offset + length > end) {
      fail('A TXT character string is truncated.');
    }
    chunks.push(`"${escapeDnsBytes(bytes.subarray(offset, offset + length))}"`);
    offset += length;
  }
  return chunks.join(' ');
}

function formatHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function parseRdata(bytes: Uint8Array, type: number, classValue: number, ttl: number, start: number, end: number): string {
  const rdata = bytes.subarray(start, end);
  if (type === 1) {
    if (rdata.length !== 4) {
      fail('An A record must contain exactly 4 address bytes.');
    }
    return Array.from(rdata).join('.');
  }
  if (type === 28) {
    return formatIpv6(rdata);
  }
  if (type === 2 || type === 5 || type === 12) {
    const name = readName(bytes, start);
    expectRdataEnd(name.nextOffset, end);
    return name.name;
  }
  if (type === 15) {
    if (start + 2 > end) {
      fail('An MX record is truncated.');
    }
    const exchange = readName(bytes, start + 2);
    expectRdataEnd(exchange.nextOffset, end);
    return `${readUint16(bytes, start)} ${exchange.name}`;
  }
  if (type === 16) {
    return formatTxt(bytes, start, end);
  }
  if (type === 6) {
    const primary = readName(bytes, start);
    const responsible = readName(bytes, primary.nextOffset);
    if (responsible.nextOffset + 20 !== end) {
      fail('An SOA record is truncated or has trailing data.');
    }
    return `${primary.name} ${responsible.name} ${readUint32(bytes, responsible.nextOffset)} ${readUint32(bytes, responsible.nextOffset + 4)} ${readUint32(bytes, responsible.nextOffset + 8)} ${readUint32(bytes, responsible.nextOffset + 12)} ${readUint32(bytes, responsible.nextOffset + 16)}`;
  }
  if (type === 33) {
    if (start + 6 > end) {
      fail('An SRV record is truncated.');
    }
    const target = readName(bytes, start + 6);
    expectRdataEnd(target.nextOffset, end);
    return `${readUint16(bytes, start)} ${readUint16(bytes, start + 2)} ${readUint16(bytes, start + 4)} ${target.name}`;
  }
  if (type === 257) {
    if (start + 2 > end) {
      fail('A CAA record is truncated.');
    }
    const tagLength = bytes[start + 1]!;
    if (start + 2 + tagLength > end) {
      fail('A CAA tag is truncated.');
    }
    const tag = escapeDnsBytes(bytes.subarray(start + 2, start + 2 + tagLength));
    const value = escapeDnsBytes(bytes.subarray(start + 2 + tagLength, end));
    return `${bytes[start]} ${tag} "${value}"`;
  }
  if (type === 41) {
    if (classValue < 512 || rdata.length > DNS_MESSAGE_MAX_BYTES) {
      fail('An OPT record has invalid bounds.');
    }
    const extendedRcode = (ttl >>> 24) & 0xFF;
    const version = (ttl >>> 16) & 0xFF;
    const flags = ttl & 0xFFFF;
    return `udp=${classValue} ext-rcode=${extendedRcode} version=${version} flags=0x${flags.toString(16).padStart(4, '0')} data=${formatHex(rdata) || '-'}`;
  }
  return `\\# ${rdata.length} ${formatHex(rdata)}`;
}

function parseRecord(bytes: Uint8Array, startOffset: number, section: DnsSection): { record: DnsRecord; nextOffset: number } {
  const owner = readName(bytes, startOffset);
  if (owner.nextOffset + 10 > bytes.length) {
    fail('A DNS resource-record header is truncated.');
  }
  const type = readUint16(bytes, owner.nextOffset);
  const classValue = readUint16(bytes, owner.nextOffset + 2);
  const ttl = readUint32(bytes, owner.nextOffset + 4);
  const rdataLength = readUint16(bytes, owner.nextOffset + 8);
  const rdataStart = owner.nextOffset + 10;
  const rdataEnd = rdataStart + rdataLength;
  if (rdataEnd > bytes.length) {
    fail('DNS record data is truncated.');
  }
  if (type === 41 && (section !== 'additional' || owner.name !== '.')) {
    fail('An OPT pseudo-record is allowed only at the root of the additional section.');
  }
  return {
    record: {
      section,
      name: owner.name,
      type,
      typeName: TYPE_NAMES.get(type) ?? (type === 41 ? 'OPT' : `TYPE${type}`),
      class: classValue,
      className: type === 41 ? `UDP${classValue}` : CLASS_NAMES.get(classValue) ?? `CLASS${classValue}`,
      ttl,
      value: parseRdata(bytes, type, classValue, ttl, rdataStart, rdataEnd),
    },
    nextOffset: rdataEnd,
  };
}

function sameDnsName(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

export function parseDnsResponse(bytes: Uint8Array, expected: EncodedDnsQuery): ParsedDnsMessage {
  if (!(bytes instanceof Uint8Array) || bytes.length < 12 || bytes.length > DNS_MESSAGE_MAX_BYTES) {
    fail(`DNS responses must contain 12–${DNS_MESSAGE_MAX_BYTES.toLocaleString('en-US')} bytes.`);
  }
  const id = readUint16(bytes, 0);
  const flagsValue = readUint16(bytes, 2);
  const questionCount = readUint16(bytes, 4);
  const answerCount = readUint16(bytes, 6);
  const authorityCount = readUint16(bytes, 8);
  const additionalCount = readUint16(bytes, 10);
  const recordCount = answerCount + authorityCount + additionalCount;
  const opcode = (flagsValue >>> 11) & 0xF;
  const headerRcode = flagsValue & 0xF;
  if (id !== 0 || (flagsValue & 0x8000) === 0 || opcode !== 0 || (flagsValue & 0x0040) !== 0) {
    fail('The resolver returned a DNS message with an unexpected ID, direction, opcode, or reserved flag.');
  }
  if (questionCount !== 1 || recordCount > DNS_RECORD_MAX_COUNT) {
    fail(`The DNS response must contain one question and at most ${DNS_RECORD_MAX_COUNT} records.`);
  }

  const questionName = readName(bytes, 12);
  if (questionName.nextOffset + 4 > bytes.length) {
    fail('The DNS question is truncated.');
  }
  const questionType = readUint16(bytes, questionName.nextOffset);
  const questionClass = readUint16(bytes, questionName.nextOffset + 2);
  if (!sameDnsName(questionName.name, expected.canonicalName) || questionType !== expected.type || questionClass !== 1) {
    fail('The resolver response does not match the requested DNS question.');
  }

  let offset = questionName.nextOffset + 4;
  const answers: DnsRecord[] = [];
  const authorities: DnsRecord[] = [];
  const additionals: DnsRecord[] = [];
  const parseSection = (count: number, section: DnsSection, target: DnsRecord[]) => {
    for (let index = 0; index < count; index += 1) {
      const parsed = parseRecord(bytes, offset, section);
      target.push(parsed.record);
      offset = parsed.nextOffset;
    }
  };
  parseSection(answerCount, 'answer', answers);
  parseSection(authorityCount, 'authority', authorities);
  parseSection(additionalCount, 'additional', additionals);
  if (offset !== bytes.length) {
    fail('The DNS response contains trailing bytes.');
  }
  const optRecords = additionals.filter(record => record.type === 41);
  if (optRecords.length > 1) {
    fail('The DNS response contains more than one OPT pseudo-record.');
  }
  const rcode = headerRcode | (((optRecords[0]?.ttl ?? 0) >>> 24) << 4);

  const flags: string[] = [];
  const flagNames: Array<[number, string]> = [
    [0x8000, 'qr'], [0x0400, 'aa'], [0x0200, 'tc'], [0x0100, 'rd'], [0x0080, 'ra'], [0x0020, 'ad'], [0x0010, 'cd'],
  ];
  for (const [mask, label] of flagNames) {
    if ((flagsValue & mask) !== 0) {
      flags.push(label);
    }
  }
  return {
    id,
    opcode,
    opcodeName: OPCODE_NAMES[opcode] ?? `OPCODE${opcode}`,
    rcode,
    rcodeName: RCODE_NAMES.get(rcode) ?? `RCODE${rcode}`,
    flags,
    question: {
      name: questionName.name,
      type: questionType,
      typeName: TYPE_NAMES.get(questionType) ?? `TYPE${questionType}`,
      class: questionClass,
      className: CLASS_NAMES.get(questionClass) ?? `CLASS${questionClass}`,
    },
    answers,
    authorities,
    additionals,
    wireBytes: bytes.length,
  };
}

function formatSection(title: string, records: DnsRecord[]): string[] {
  const lines = [`;; ${title} SECTION (${records.length})`];
  if (records.length === 0) {
    lines.push('; (empty)');
  }
  else {
    for (const record of records) {
      lines.push(`${record.name}\t${record.ttl}\t${record.className}\t${record.typeName}\t${record.value}`);
    }
  }
  return lines;
}

export function formatDnsReport(options: {
  message: ParsedDnsMessage
  resolverLabel: string
  requestBytes: number
  elapsedMs: number
}): string {
  const { message } = options;
  const lines = [
    `;; Resolver: ${options.resolverLabel}`,
    `;; HTTP exchange: POST application/dns-message; ${options.requestBytes} request bytes; ${message.wireBytes} response bytes; ${Math.round(options.elapsedMs)} ms`,
    `;; ->>HEADER<<- opcode: ${message.opcodeName}, status: ${message.rcodeName}, id: ${message.id}`,
    `;; flags: ${message.flags.join(' ') || '-'}; QUERY: 1, ANSWER: ${message.answers.length}, AUTHORITY: ${message.authorities.length}, ADDITIONAL: ${message.additionals.length}`,
    '',
    ';; QUESTION SECTION',
    `;${message.question.name}\t${message.question.className}\t${message.question.typeName}`,
    '',
    ...formatSection('ANSWER', message.answers),
    '',
    ...formatSection('AUTHORITY', message.authorities),
    '',
    ...formatSection('ADDITIONAL', message.additionals),
  ];
  const report = `${lines.join('\n')}\n`;
  if (encoder.encode(report).length > DNS_REPORT_MAX_BYTES) {
    throw new RangeError('The formatted DNS report exceeds the 256 KiB output limit.');
  }
  return report;
}
