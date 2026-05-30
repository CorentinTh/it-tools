import { describe, expect, it } from 'vitest';
import { createMarkdownTable, escapeMarkdownTableCell, generateMarkdownTable } from './markdown-table-generator.service';

describe('markdown-table-generator service', () => {
  describe('createMarkdownTable', () => {
    it('creates a table with default headers and empty rows', () => {
      expect(createMarkdownTable({ rows: 1, columns: 2 })).toEqual({
        headers: ['Column 1', 'Column 2'],
        alignments: ['left', 'left'],
        rows: [['', '']],
      });
    });
  });

  describe('escapeMarkdownTableCell', () => {
    it('escapes pipes and converts line breaks to br tags', () => {
      expect(escapeMarkdownTableCell(' foo | bar\nbaz ')).toBe('foo \\| bar<br>baz');
    });
  });

  describe('generateMarkdownTable', () => {
    it('generates a markdown table with column alignment', () => {
      expect(generateMarkdownTable({
        headers: ['Name', 'Count', 'Notes'],
        alignments: ['left', 'right', 'center'],
        rows: [
          ['Alpha', '10', 'Ready'],
          ['Beta', '3', 'Needs review'],
        ],
      })).toMatchInlineSnapshot(`
        "| Name | Count | Notes |
        | :--- | ---: | :---: |
        | Alpha | 10 | Ready |
        | Beta | 3 | Needs review |"
      `);
    });

    it('pads uneven rows to keep the table shape valid', () => {
      expect(generateMarkdownTable({
        headers: ['Name'],
        alignments: ['left'],
        rows: [['Alpha', 'Extra']],
      })).toMatchInlineSnapshot(`
        "| Name |  |
        | :--- | :--- |
        | Alpha | Extra |"
      `);
    });
  });
});
