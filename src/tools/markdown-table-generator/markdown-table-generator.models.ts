/**
 * Escape pipe characters in cell content so they don't break the table structure.
 */
export function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

export type MarkdownTableOptions = {
  /** include the `| --- |` separator row */
  includeSeparator?: boolean;
  /** pad cells to equal width for readability */
  alignColumns?: boolean;
};

/**
 * Convert a 2D array of cells into a GFM (GitHub Flavored Markdown) table.
 * The first row is treated as the header.
 */
export function generateMarkdownTable(rows: string[][], options: MarkdownTableOptions = {}): string {
  const { includeSeparator = true, alignColumns = true } = options;

  const cleaned = rows.length > 0 ? rows : [['', '']];

  const escaped = cleaned.map(row => row.map(escapeCell));
  const columnCount = Math.max(...escaped.map(row => row.length));

  const normalized = escaped.map(row => {
    const copy = [...row];
    while (copy.length < columnCount) {
      copy.push('');
    }
    return copy;
  });

  const widths = Array.from({ length: columnCount }, (_, col) =>
    Math.max(3, ...normalized.map(row => row[col].length)),
  );

  const formatRow = (row: string[]) =>
    `| ${row.map((cell, col) => (alignColumns ? cell.padEnd(widths[col]) : cell)).join(' | ')} |`;

  const separator = `| ${widths.map(width => '-'.repeat(alignColumns ? width : 3)).join(' | ')} |`;

  const lines = [formatRow(normalized[0])];

  if (includeSeparator) {
    lines.push(separator);
  }

  for (const row of normalized.slice(1)) {
    lines.push(formatRow(row));
  }

  return lines.join('\n');
}
