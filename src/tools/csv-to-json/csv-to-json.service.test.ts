import { describe, expect, it } from 'vitest';
import { parseCsv } from './csv-to-json.service';

const base = { delimiter: ',', hasHeaders: true, inferTypes: true, trimFields: true };

describe('csv-to-json: basic parsing', () => {
  it('parses a simple table with headers', () => {
    const result = parseCsv('name,age\nAlice,30\nBob,25', base);
    expect(result.headers).toEqual(['name', 'age']);
    expect(result.records).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });

  it('parses without headers, generating column names', () => {
    const result = parseCsv('Alice,30\nBob,25', { ...base, hasHeaders: false });
    expect(result.headers).toEqual(['column_1', 'column_2']);
    expect(result.records).toEqual([
      { column_1: 'Alice', column_2: 30 },
      { column_1: 'Bob', column_2: 25 },
    ]);
  });

  it('handles empty input', () => {
    expect(parseCsv('', base)).toEqual({ headers: [], records: [] });
  });
});

describe('csv-to-json: RFC 4180 quoting', () => {
  it('keeps delimiters inside quoted fields', () => {
    const result = parseCsv('name,quote\nSmith,"a, b"', base);
    expect(result.records[0]).toEqual({ name: 'Smith', quote: 'a, b' });
  });

  it('unescapes doubled quotes', () => {
    const result = parseCsv('quote\n"He said ""hi"""', base);
    expect(result.records[0]?.quote).toBe('He said "hi"');
  });

  it('supports newlines inside quoted fields', () => {
    const result = parseCsv('name,text\nline1,"two\nlines"', base);
    expect(result.records[0]?.text).toBe('two\nlines');
    expect(result.records).toHaveLength(1);
  });

  it('supports CRLF line endings', () => {
    const result = parseCsv('a,b\r\n1,2\r\n', base);
    expect(result.records).toEqual([{ a: 1, b: 2 }]);
  });

  it('drops the trailing empty record from a final newline', () => {
    const result = parseCsv('a,b\n1,2\n\n', base);
    expect(result.records).toHaveLength(1);
  });
});

describe('csv-to-json: options', () => {
  it('supports custom delimiters', () => {
    const result = parseCsv('a;b\n1;2', { ...base, delimiter: ';' });
    expect(result.records).toEqual([{ a: 1, b: 2 }]);
  });

  it('keeps everything as strings when type inference is off', () => {
    const result = parseCsv('n,b,x\n42,true,null', { ...base, inferTypes: false });
    expect(result.records[0]).toEqual({ n: '42', b: 'true', x: 'null' });
  });

  it('infers numbers, booleans and null', () => {
    const result = parseCsv('n,b,x,e\n42,true,null,', base);
    expect(result.records[0]).toEqual({ n: 42, b: true, x: null, e: null });
  });

  it('trims unquoted fields but not quoted ones', () => {
    const result = parseCsv('a,b\n  spaced , " kept  "', base);
    expect(result.records[0]).toEqual({ a: 'spaced', b: ' kept  ' });
  });

  it('fills missing trailing fields with null', () => {
    const result = parseCsv('a,b,c\n1,2', base);
    expect(result.records[0]).toEqual({ a: 1, b: 2, c: null });
  });
});
