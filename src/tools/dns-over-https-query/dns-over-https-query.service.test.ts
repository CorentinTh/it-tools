import { describe, expect, it } from 'vitest';
import {
  DNS_MESSAGE_MAX_BYTES,
  DNS_RECORD_MAX_COUNT,
  encodeDnsQuery,
  formatDnsReport,
  parseDnsResponse,
} from './dns-over-https-query.service';

function concat(...parts: Uint8Array[]): Uint8Array {
  const output = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

function u16(value: number): Uint8Array {
  return Uint8Array.of((value >>> 8) & 0xFF, value & 0xFF);
}

function u32(value: number): Uint8Array {
  return Uint8Array.of((value >>> 24) & 0xFF, (value >>> 16) & 0xFF, (value >>> 8) & 0xFF, value & 0xFF);
}

function wireName(name: string): Uint8Array {
  if (name === '.') {
    return Uint8Array.of(0);
  }
  return concat(...name.replace(/\.$/u, '').split('.').map((label) => {
    const bytes = new TextEncoder().encode(label);
    return concat(Uint8Array.of(bytes.length), bytes);
  }), Uint8Array.of(0));
}

function record(type: number, value: Uint8Array, options: { owner?: Uint8Array; classValue?: number; ttl?: number } = {}): Uint8Array {
  return concat(
    options.owner ?? Uint8Array.of(0xC0, 0x0C),
    u16(type),
    u16(options.classValue ?? 1),
    u32(options.ttl ?? 300),
    u16(value.length),
    value,
  );
}

function responseFor(query: ReturnType<typeof encodeDnsQuery>, records: Uint8Array[], options: { flags?: number; authorityCount?: number; additionalCount?: number } = {}): Uint8Array {
  const authorityCount = options.authorityCount ?? 0;
  const additionalCount = options.additionalCount ?? 0;
  const answerCount = records.length - authorityCount - additionalCount;
  return concat(
    u16(0), u16(options.flags ?? 0x8180), u16(1), u16(answerCount), u16(authorityCount), u16(additionalCount),
    query.bytes.subarray(12),
    ...records,
  );
}

describe('DNS-over-HTTPS wire service', () => {
  it('encodes the RFC 8484 POST example with DNS ID zero', () => {
    const query = encodeDnsQuery('www.example.com', 'A');
    expect(Array.from(query.bytes)).toEqual([
      0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      3, 119, 119, 119, 7, 101, 120, 97, 109, 112, 108, 101, 3, 99, 111, 109, 0, 0, 1, 0, 1,
    ]);
    expect(query.canonicalName).toBe('www.example.com.');
  });

  it('normalizes IDNs, service labels, and the root while enforcing DNS name limits', () => {
    expect(encodeDnsQuery('münich.example', 'AAAA').canonicalName).toBe('xn--mnich-kva.example.');
    expect(encodeDnsQuery('_sip._tcp.Example.COM.', 'SRV').canonicalName).toBe('_sip._tcp.example.com.');
    expect(encodeDnsQuery('.', 'NS').bytes).toHaveLength(17);
    expect(() => encodeDnsQuery('https://example.com/private', 'A')).toThrow(/one DNS name/u);
    expect(() => encodeDnsQuery(`${'a'.repeat(64)}.example`, 'A')).toThrow(/63 bytes/u);
    expect(() => encodeDnsQuery(`_${'é'.repeat(4)}.example`, 'SRV')).toThrow(/service underscores/u);
    expect(() => encodeDnsQuery(`${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(62)}`, 'A')).toThrow(/253-byte/u);
  });

  it('parses bounded compressed responses and common record RDATA exactly', () => {
    const query = encodeDnsQuery('example.com', 'A');
    const records = [
      record(1, Uint8Array.of(192, 0, 2, 1), { ttl: 60 }),
      record(28, Uint8Array.of(0x20, 0x01, 0x0D, 0xB8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1)),
      record(5, wireName('alias.example.com.')),
      record(15, concat(u16(10), wireName('mail.example.com.'))),
      record(16, concat(Uint8Array.of(5), new TextEncoder().encode('hello'), Uint8Array.of(3), new TextEncoder().encode('a b'))),
      record(6, concat(wireName('ns.example.com.'), wireName('hostmaster.example.com.'), u32(42), u32(3600), u32(600), u32(86_400), u32(300))),
      record(33, concat(u16(1), u16(5), u16(443), wireName('service.example.com.'))),
      record(257, concat(Uint8Array.of(0, 5), new TextEncoder().encode('issue'), new TextEncoder().encode('ca.example'))),
      record(65_000, Uint8Array.of(0xDE, 0xAD)),
    ];
    const parsed = parseDnsResponse(responseFor(query, records), query);
    expect(parsed.rcodeName).toBe('NOERROR');
    expect(parsed.flags).toEqual(['qr', 'rd', 'ra']);
    expect(parsed.answers.map(item => item.value)).toEqual([
      '192.0.2.1',
      '2001:db8::1',
      'alias.example.com.',
      '10 mail.example.com.',
      '"hello" "a\\032b"',
      'ns.example.com. hostmaster.example.com. 42 3600 600 86400 300',
      '1 5 443 service.example.com.',
      '0 issue "ca\\046example"',
      '\\# 2 dead',
    ]);
  });

  it('keeps answer, authority, and additional sections distinct', () => {
    const query = encodeDnsQuery('missing.example', 'A');
    const authority = record(2, wireName('ns.example.'));
    const additional = record(41, Uint8Array.of(), { owner: wireName('.'), classValue: 1232, ttl: 0x0000_8000 });
    const parsed = parseDnsResponse(responseFor(query, [authority, additional], { flags: 0x8183, authorityCount: 1, additionalCount: 1 }), query);
    expect(parsed.rcodeName).toBe('NXDOMAIN');
    expect(parsed.answers).toHaveLength(0);
    expect(parsed.authorities[0]).toMatchObject({ typeName: 'NS', section: 'authority' });
    expect(parsed.additionals[0]).toMatchObject({ typeName: 'OPT', value: 'udp=1232 ext-rcode=0 version=0 flags=0x8000 data=-' });

    const badVersionOpt = record(41, Uint8Array.of(), { owner: wireName('.'), classValue: 1232, ttl: 0x0100_0000 });
    const badVersion = parseDnsResponse(responseFor(query, [badVersionOpt], { additionalCount: 1 }), query);
    expect(badVersion.rcode).toBe(16);
    expect(badVersion.rcodeName).toBe('BADVERS');
  });

  it('rejects mismatched questions, invalid headers, pointers, counts, truncation, and trailing bytes', () => {
    const query = encodeDnsQuery('example.com', 'A');
    const other = encodeDnsQuery('other.example', 'A');
    expect(() => parseDnsResponse(responseFor(other, []), query)).toThrow(/does not match/u);

    const badId = responseFor(query, []);
    badId[1] = 1;
    expect(() => parseDnsResponse(badId, query)).toThrow(/unexpected ID/u);

    const tooMany = responseFor(query, []);
    tooMany[6] = (DNS_RECORD_MAX_COUNT + 1) >>> 8;
    tooMany[7] = (DNS_RECORD_MAX_COUNT + 1) & 0xFF;
    expect(() => parseDnsResponse(tooMany, query)).toThrow(/at most 256/u);

    const forwardPointer = concat(u16(0), u16(0x8180), u16(1), u16(0), u16(0), u16(0), Uint8Array.of(0xC0, 0x0E, 0, 1, 0, 1));
    expect(() => parseDnsResponse(forwardPointer, query)).toThrow(/earlier message offset/u);

    const truncated = responseFor(query, [record(1, Uint8Array.of(192, 0, 2, 1))]).subarray(0, -1);
    expect(() => parseDnsResponse(truncated, query)).toThrow(/truncated/u);
    expect(() => parseDnsResponse(concat(responseFor(query, []), Uint8Array.of(1)), query)).toThrow(/trailing bytes/u);
    expect(() => parseDnsResponse(new Uint8Array(DNS_MESSAGE_MAX_BYTES + 1), query)).toThrow(/12–65,535/u);
  });

  it('formats an inert bounded dig-style report', () => {
    const query = encodeDnsQuery('example.com', 'A');
    const message = parseDnsResponse(responseFor(query, [record(1, Uint8Array.of(192, 0, 2, 1), { ttl: 60 })]), query);
    const report = formatDnsReport({ message, resolverLabel: 'Fixed resolver', requestBytes: query.bytes.length, elapsedMs: 12.6 });
    expect(report).toContain(';; Resolver: Fixed resolver');
    expect(report).toContain('status: NOERROR, id: 0');
    expect(report).toContain('example.com.\t60\tIN\tA\t192.0.2.1');
    expect(report).toContain('13 ms');
  });
});
