import { describe, expect, it } from 'vitest';
import { escapeCell, generateMarkdownTable } from './markdown-table-generator.models';

describe('markdown-table-generator models', () => {
  it('generates a basic GFM table with header and separator', () => {
    const md = generateMarkdownTable([
      ['Header 1', 'Header 2'],
      ['a', 'b'],
    ]);
    expect(md.split('\n')).toEqual([
      '| Header 1 | Header 2 |',
      '| -------- | -------- |',
      '| a        | b        |',
    ]);
  });

  it('escapes pipes in cell content', () => {
    const md = generateMarkdownTable([['H'], ['a|b']]);
    expect(md).toContain('a\\|b');
  });

  it('normalizes ragged rows to the widest row', () => {
    const md = generateMarkdownTable([
      ['H1', 'H2', 'H3'],
      ['only'],
    ]);
    const lines = md.split('\n');
    expect(lines[2]).toBe('| only |     |     |');
  });

  it('omits the separator row when asked', () => {
    const md = generateMarkdownTable([['H'], ['x']], { includeSeparator: false });
    expect(md.split('\n')).toHaveLength(2);
    expect(md).not.toContain('---');
  });

  it('handles empty input', () => {
    expect(generateMarkdownTable([])).toBe('|     |     |\n| --- | --- |');
  });

  it('escapeCell converts newlines to <br>', () => {
    expect(escapeCell('line1\nline2')).toBe('line1<br>line2');
  });
});
