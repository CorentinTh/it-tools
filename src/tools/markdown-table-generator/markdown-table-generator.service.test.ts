import { describe, expect, it } from 'vitest';
import { generateMarkdownTable, parseTabular } from './markdown-table-generator.service';

describe('Markdown table generator', () => {
  it('parses quoted CSV, escaped quotes, and embedded newlines', () => {
    expect(parseTabular('Name,Note\nAlice,"hello, ""world"""\nBob,"two\nlines"', 'comma')).toEqual([
      ['Name', 'Note'], ['Alice', 'hello, "world"'], ['Bob', 'two\nlines'],
    ]);
  });

  it('renders escaped Markdown with per-column alignment patterns', () => {
    expect(generateMarkdownTable({ source: 'Name\tValue\nA|B\t 10 ', delimiter: 'tab', firstRowHeader: true, trimCells: true, alignmentPattern: 'left,right' })).toBe([
      '| Name | Value |', '| :--- | ---: |', '| A\\|B | 10 |',
    ].join('\n'));
  });

  it('creates headers when needed and rejects invalid or excessive shapes', () => {
    expect(generateMarkdownTable({ source: 'a,b', delimiter: 'comma', firstRowHeader: false, trimCells: false, alignmentPattern: 'center' })).toContain('| Column 1 | Column 2 |');
    expect(() => generateMarkdownTable({ source: 'a,b', delimiter: 'comma', firstRowHeader: true, trimCells: true, alignmentPattern: 'sideways' })).toThrow(/left, center, or right/u);
    expect(() => parseTabular(`"${'x'.repeat(32 * 1024 + 1)}"`, 'comma')).toThrow(/32 KiB/u);
    const tooManyHeaderlessRows = Array.from({ length: 10_001 }, () => 'value').join('\n');
    expect(() => generateMarkdownTable({ source: tooManyHeaderlessRows, delimiter: 'comma', firstRowHeader: false, trimCells: true, alignmentPattern: 'left' })).toThrow(/10,000 data rows/u);
  });
});
