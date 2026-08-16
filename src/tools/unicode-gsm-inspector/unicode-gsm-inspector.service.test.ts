import { describe, expect, it } from 'vitest';
import { inspectUnicodeText } from './unicode-gsm-inspector.service';

describe('Unicode and GSM-7 inspector', () => {
  it('distinguishes code points, UTF-16 units, UTF-8 bytes, and graphemes', () => {
    const result = inspectUnicodeText('A😀e\u0301', 'U+1F600');
    expect(result).toMatchObject({ codePointCount: 4, utf16Units: 5, utf8Bytes: 8, matches: 1, smsEncoding: 'UCS-2', smsUnits: 5, smsSegments: 1 });
    expect(result.graphemeCount).toBe(3);
    expect(result.report).toContain('U+1F600');
  });

  it('counts GSM-7 extension characters as two septets and estimates concatenation', () => {
    expect(inspectUnicodeText('^'.repeat(80))).toMatchObject({ smsEncoding: 'GSM-7', smsUnits: 160, smsSegments: 1 });
    expect(inspectUnicodeText('^'.repeat(81))).toMatchObject({ smsEncoding: 'GSM-7', smsUnits: 162, smsSegments: 2 });
  });

  it('normalizes literal search and enforces code-point limits', () => {
    expect(inspectUnicodeText('é e\u0301', 'é').matches).toBe(2);
    expect(() => inspectUnicodeText('a'.repeat(4_097))).toThrow(/4,096 Unicode code points/u);
  });
});
