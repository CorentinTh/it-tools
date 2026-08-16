import xmlFormat from 'xml-formatter';

export type SamlBinding = 'auto' | 'base64' | 'redirect';
export type EnterpriseTimestampOperation = 'filetime-to-iso' | 'iso-to-filetime' | 'ldap-to-iso' | 'iso-to-ldap';

const MAX_SAML_ENCODED_CHARACTERS = 768 * 1024;
const MAX_SAML_DECODED_BYTES = 2 * 1024 * 1024;
const FILETIME_UNIX_EPOCH_TICKS = 116_444_736_000_000_000n;
const TICKS_PER_MILLISECOND = 10_000n;

function extractSamlParameter(source: string): string {
  const trimmed = source.trim();
  if (/^https?:\/\//iu.test(trimmed)) {
    const url = new URL(trimmed);
    const value = url.searchParams.get('SAMLRequest') ?? url.searchParams.get('SAMLResponse');
    if (!value) {
      throw new Error('The URL does not contain a SAMLRequest or SAMLResponse parameter.');
    }
    return value;
  }
  return trimmed;
}

export function decodeSamlBase64(source: string): Uint8Array {
  const extracted = extractSamlParameter(source);
  if (!extracted || extracted.length > MAX_SAML_ENCODED_CHARACTERS) {
    throw new Error('Encoded SAML input must be between 1 byte and 768 KiB of text.');
  }
  const normalized = extracted.replace(/\s+/gu, '').replace(/-/gu, '+').replace(/_/gu, '/');
  if (!/^[A-Za-z0-9+/]*={0,2}$/u.test(normalized) || normalized.length % 4 === 1) {
    throw new Error('The SAML message is not valid Base64 or Base64url.');
  }
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  let decoded: string;
  try {
    decoded = atob(padded);
  }
  catch {
    throw new Error('The SAML message is not valid Base64 or Base64url.');
  }
  if (decoded.length > MAX_SAML_DECODED_BYTES) {
    throw new Error('Decoded SAML output is limited to 2 MiB.');
  }
  return Uint8Array.from(decoded, character => character.charCodeAt(0));
}

async function inflateRawBounded(bytes: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === 'undefined') {
    throw new TypeError('Raw DEFLATE decoding is not available in this browser. Use a Base64 POST-binding message instead.');
  }
  let stream: DecompressionStream;
  try {
    stream = new DecompressionStream('deflate-raw' as CompressionFormat);
  }
  catch {
    throw new Error('Raw DEFLATE decoding is not available in this browser. Use a Base64 POST-binding message instead.');
  }
  const reader = new Blob([bytes]).stream().pipeThrough(stream).getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      length += value.byteLength;
      if (length > MAX_SAML_DECODED_BYTES) {
        await reader.cancel();
        throw new Error('Inflated SAML output is limited to 2 MiB.');
      }
      chunks.push(value);
    }
  }
  catch (error) {
    if (error instanceof Error && error.message === 'Inflated SAML output is limited to 2 MiB.') {
      throw error;
    }
    throw new Error('The SAML message could not be decoded as raw DEFLATE data.');
  }
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function decodeUtf8(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  catch {
    throw new Error('The decoded SAML message is not valid UTF-8 text.');
  }
}

function attribute(xml: string, name: string): string | undefined {
  return new RegExp(`\\s${name}\\s*=\\s*["']([^"']+)["']`, 'iu').exec(xml)?.[1];
}

function elementText(xml: string, localName: string): string | undefined {
  return new RegExp(`<(?:[A-Za-z_][\\w.-]*:)?${localName}\\b[^>]*>([^<]*)<\\/(?:[A-Za-z_][\\w.-]*:)?${localName}>`, 'iu').exec(xml)?.[1]?.trim();
}

function inspectXml(xml: string): string {
  const trimmed = xml.trim();
  if (!trimmed.startsWith('<') || /<!DOCTYPE|<!ENTITY/iu.test(trimmed)) {
    throw new Error('Decoded content must be XML without DTD or entity declarations.');
  }
  let formatted: string;
  try {
    formatted = xmlFormat(trimmed, { indentation: '  ', collapseContent: true, lineSeparator: '\n' });
  }
  catch {
    throw new Error('The decoded SAML content is not well-formed XML.');
  }
  const root = /^\s*(?:<\?xml[^>]*>\s*)?<((?:[A-Za-z_][\w.-]*:)?[A-Za-z_][\w.-]*)\b/u.exec(trimmed)?.[1] ?? 'Unknown';
  return [
    'Signature verification: NOT PERFORMED',
    'Trust decision: decode-only; validate XML signatures, certificates, audience, recipient, destination, and time conditions in your SAML implementation.',
    `Root element: ${root}`,
    `ID: ${attribute(trimmed, 'ID') ?? 'not present'}`,
    `Version: ${attribute(trimmed, 'Version') ?? 'not present'}`,
    `IssueInstant: ${attribute(trimmed, 'IssueInstant') ?? 'not present'}`,
    `Destination: ${attribute(trimmed, 'Destination') ?? 'not present'}`,
    `Issuer: ${elementText(trimmed, 'Issuer') ?? 'not present'}`,
    '',
    'Decoded XML:',
    formatted,
  ].join('\n');
}

export async function inspectSamlMessage(source: string, binding: SamlBinding): Promise<string> {
  const decoded = decodeSamlBase64(source);
  if (binding !== 'redirect') {
    try {
      const directlyDecoded = decodeUtf8(decoded).trimStart();
      if (binding === 'base64' || directlyDecoded.startsWith('<')) {
        return inspectXml(directlyDecoded);
      }
    }
    catch (error) {
      if (binding === 'base64') {
        throw error;
      }
    }
  }
  return inspectXml(decodeUtf8(await inflateRawBounded(decoded)));
}

function parseIso(value: string): Date {
  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(Z|[+-]\d{2}:\d{2})$/u.exec(trimmed);
  if (!match || !hasValidCalendarFields(match)) {
    throw new TypeError('Enter an ISO 8601 date-time with an explicit UTC offset or Z suffix.');
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Enter an ISO 8601 date-time with an explicit UTC offset or Z suffix.');
  }
  return date;
}

function hasValidCalendarFields(match: RegExpExecArray): boolean {
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const zone = match[8];
  const zoneHours = zone === 'Z' ? 0 : Number(zone.slice(1, 3));
  const zoneMinutes = zone === 'Z' ? 0 : Number(zone.slice(4, 6));
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  return month >= 1
    && month <= 12
    && day >= 1
    && calendarDate.getUTCFullYear() === year
    && calendarDate.getUTCMonth() === month - 1
    && calendarDate.getUTCDate() === day
    && hour <= 23
    && minute <= 59
    && second <= 59
    && zoneHours <= 23
    && zoneMinutes <= 59;
}

function dateFromUnixMilliseconds(milliseconds: bigint): Date {
  const numeric = Number(milliseconds);
  if (!Number.isSafeInteger(numeric) || Math.abs(numeric) > 8_640_000_000_000_000) {
    throw new Error('The timestamp is outside the JavaScript Date range.');
  }
  return new Date(numeric);
}

export function convertEnterpriseTimestamp(operation: EnterpriseTimestampOperation, source: string): string {
  const trimmed = source.trim();
  if (operation === 'filetime-to-iso') {
    if (!/^\d+$/u.test(trimmed)) {
      throw new Error('FILETIME must be an unsigned integer count of 100-nanosecond ticks.');
    }
    const ticks = BigInt(trimmed);
    const unixTicks = ticks - FILETIME_UNIX_EPOCH_TICKS;
    let unixMilliseconds = unixTicks / TICKS_PER_MILLISECOND;
    let remainderTicks = unixTicks % TICKS_PER_MILLISECOND;
    if (remainderTicks < 0n) {
      unixMilliseconds -= 1n;
      remainderTicks += TICKS_PER_MILLISECOND;
    }
    return [
      `ISO UTC: ${dateFromUnixMilliseconds(unixMilliseconds).toISOString()}`,
      `Unix milliseconds: ${unixMilliseconds}`,
      `Sub-millisecond 100 ns ticks: ${remainderTicks}`,
      '',
      'Epoch: 1601-01-01T00:00:00Z; one FILETIME unit is 100 ns. Active Directory integer timestamps use the same scale, but attribute-specific sentinel values may have special meanings.',
    ].join('\n');
  }
  if (operation === 'iso-to-filetime') {
    const date = parseIso(trimmed);
    const ticks = BigInt(date.getTime()) * TICKS_PER_MILLISECOND + FILETIME_UNIX_EPOCH_TICKS;
    return [`FILETIME / AD ticks: ${ticks}`, `ISO UTC: ${date.toISOString()}`, '', 'Input precision is limited to JavaScript Date milliseconds.'].join('\n');
  }
  if (operation === 'ldap-to-iso') {
    const match = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:\.(\d+))?(Z|[+-]\d{4})$/u.exec(trimmed);
    if (!match) {
      throw new Error('Use LDAP GeneralizedTime such as 20260816043000Z or 20260816063000+0200.');
    }
    const fraction = (match[7] ?? '').slice(0, 3).padEnd(3, '0');
    const zone = match[8] === 'Z' ? 'Z' : `${match[8].slice(0, 3)}:${match[8].slice(3)}`;
    const iso = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}.${fraction}${zone}`;
    const date = parseIso(iso);
    return [`ISO UTC: ${date.toISOString()}`, `Unix milliseconds: ${date.getTime()}`, '', `Source offset: ${match[8]}`].join('\n');
  }
  const date = parseIso(trimmed);
  const ldap = `${date.getUTCFullYear().toString().padStart(4, '0')}${(date.getUTCMonth() + 1).toString().padStart(2, '0')}${date.getUTCDate().toString().padStart(2, '0')}${date.getUTCHours().toString().padStart(2, '0')}${date.getUTCMinutes().toString().padStart(2, '0')}${date.getUTCSeconds().toString().padStart(2, '0')}.${date.getUTCMilliseconds().toString().padStart(3, '0')}Z`;
  return [`LDAP GeneralizedTime: ${ldap}`, `ISO UTC: ${date.toISOString()}`, '', 'Output is normalized to UTC and millisecond precision.'].join('\n');
}
