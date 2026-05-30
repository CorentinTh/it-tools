export type MarkdownTableAlignment = 'left' | 'center' | 'right';

export interface MarkdownTable {
  headers: string[]
  alignments: MarkdownTableAlignment[]
  rows: string[][]
}

const alignmentSeparators: Record<MarkdownTableAlignment, string> = {
  left: ':---',
  center: ':---:',
  right: '---:',
};

export function createMarkdownTable({ rows = 2, columns = 3 }: { rows?: number; columns?: number } = {}): MarkdownTable {
  return {
    headers: Array.from({ length: columns }, (_, index) => `Column ${index + 1}`),
    alignments: Array.from({ length: columns }, () => 'left'),
    rows: Array.from({ length: rows }, () => Array.from({ length: columns }, () => '')),
  };
}

export function escapeMarkdownTableCell(value: string): string {
  return value
    .replace(/\|/g, '\\|')
    .replace(/\r\n|\r|\n/g, '<br>')
    .trim();
}

function getColumnCount(table: MarkdownTable): number {
  return Math.max(
    table.headers.length,
    table.alignments.length,
    ...table.rows.map(row => row.length),
  );
}

function getCells(cells: string[], columns: number): string[] {
  return Array.from({ length: columns }, (_, index) => escapeMarkdownTableCell(cells[index] ?? ''));
}

function formatRow(cells: string[]): string {
  return `| ${cells.join(' | ')} |`;
}

export function generateMarkdownTable(table: MarkdownTable): string {
  const columns = getColumnCount(table);

  if (columns === 0) {
    return '';
  }

  const headers = getCells(table.headers, columns);
  const separators = Array.from(
    { length: columns },
    (_, index) => alignmentSeparators[table.alignments[index] ?? 'left'],
  );
  const rows = table.rows.map(row => formatRow(getCells(row, columns)));

  return [
    formatRow(headers),
    formatRow(separators),
    ...rows,
  ].join('\n');
}
