import { describe, expect, it } from 'vitest';
import { processTabularData } from './tabular-data-inspector.service';

const base = {
  delimiter: 'comma' as const,
  firstRowHeader: true,
  trimCells: false,
  emptyCellMode: 'empty-string' as const,
  protectSpreadsheetFormulas: true,
};

describe('tabular data inspector', () => {
  it('preserves quoted newlines, escaped quotes, empty cells, and duplicate headers', () => {
    const result = processTabularData({ ...base, outputFormat: 'json-strings', source: 'name,name,empty\r\n"A\nB","x""y",\r\n,,' });
    expect(JSON.parse(result)).toEqual([
      { 'name': 'A\nB', 'name (2)': 'x"y', 'empty': '' },
      { 'name': '', 'name (2)': '', 'empty': '' },
    ]);
  });

  it('infers only bounded primitive values and preserves ambiguous identifiers', () => {
    const result = processTabularData({ ...base, outputFormat: 'json-inferred', emptyCellMode: 'null', source: 'a,b,c,d,e\ntrue,42,001,9007199254740992,' });
    expect(JSON.parse(result)).toEqual([{ a: true, b: 42, c: '001', d: '9007199254740992', e: null }]);
  });

  it('protects spreadsheet formulas only when explicitly requested', () => {
    const source = 'value\n=1+1';
    expect(processTabularData({ ...base, source, outputFormat: 'csv' })).toBe('value\r\n\'=1+1');
    expect(processTabularData({ ...base, source, outputFormat: 'csv', protectSpreadsheetFormulas: false })).toBe('value\r\n=1+1');
  });

  it('reports bounded dimensions, empty cells, profiles, and preview', () => {
    const output = processTabularData({ ...base, source: 'name,count\nalpha,1\nbeta,', outputFormat: 'inspect' });
    expect(output).toContain('Data rows: 2');
    expect(output).toContain('Empty cells: 1');
    expect(output).toContain('count: empty=1, boolean=0, number=1, string=0');
  });

  it('rejects total-cell amplification before rendering output', () => {
    const source = Array.from({ length: 1564 }, () => ','.repeat(127)).join('\n');
    expect(() => processTabularData({ ...base, source, firstRowHeader: false, outputFormat: 'inspect' })).toThrow('200,000 total cells');
  });
});
