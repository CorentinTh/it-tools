export type TableDelimiter = 'auto' | 'comma' | 'tab';
export type TableAlignment = 'left' | 'center' | 'right';

export interface MarkdownTableTask {
  source: string
  delimiter: TableDelimiter
  firstRowHeader: boolean
  trimCells: boolean
  alignmentPattern: string
}

const MAX_ROWS = 10_000;
const MAX_COLUMNS = 128;
const MAX_CELL_CHARACTERS = 32 * 1024;
const MAX_TOTAL_CELLS = 200_000;

function resolveDelimiter(source: string, requested: TableDelimiter): ',' | '\t' {
  if (requested === 'comma') {
    return ',';
  }
  if (requested === 'tab') {
    return '\t';
  }
  const firstPhysicalLine = source.split(/\r?\n/u, 1)[0];
  return firstPhysicalLine.includes('\t') ? '\t' : ',';
}

export function parseTabular(source: string, requestedDelimiter: TableDelimiter, { preserveTrailingEmptyRows = false }: { preserveTrailingEmptyRows?: boolean } = {}): string[][] {
  const delimiter = resolveDelimiter(source, requestedDelimiter);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  let totalCells = 0;
  const pushCell = () => {
    if (cell.length > MAX_CELL_CHARACTERS) {
      throw new RangeError('Each table cell is limited to 32 KiB of text.');
    }
    row.push(cell);
    totalCells += 1;
    if (totalCells > MAX_TOTAL_CELLS) {
      throw new RangeError('Tables are limited to 200,000 total cells.');
    }
    cell = '';
    if (row.length > MAX_COLUMNS) {
      throw new RangeError('Tables are limited to 128 columns.');
    }
  };
  const pushRow = () => {
    pushCell();
    rows.push(row);
    row = [];
    if (rows.length > MAX_ROWS + 1) {
      throw new RangeError('Tables are limited to 10,000 data rows.');
    }
  };
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      }
      else if (character === '"') {
        quoted = false;
      }
      else {
        cell += character;
      }
      continue;
    }
    if (character === '"') {
      if (cell) {
        throw new TypeError('A quoted field must start at the beginning of a cell.');
      }
      quoted = true;
    }
    else if (character === delimiter) {
      pushCell();
    }
    else if (character === '\n' || character === '\r') {
      if (character === '\r' && source[index + 1] === '\n') {
        index += 1;
      }
      pushRow();
    }
    else {
      cell += character;
    }
  }
  if (quoted) {
    throw new TypeError('The final quoted field is not closed.');
  }
  if (cell || row.length > 0) {
    pushRow();
  }
  if (!preserveTrailingEmptyRows) {
    while (rows.length > 0 && rows.at(-1)?.every(value => !value)) {
      rows.pop();
    }
  }
  if (rows.length === 0) {
    throw new TypeError('Enter at least one CSV or TSV row.');
  }
  return rows;
}

function parseAlignments(pattern: string, columns: number): TableAlignment[] {
  const parts = pattern.split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
  if (parts.length === 0) {
    parts.push('left');
  }
  if (parts.some(value => value !== 'left' && value !== 'center' && value !== 'right')) {
    throw new TypeError('Column alignments must be a comma-separated list of left, center, or right.');
  }
  return Array.from({ length: columns }, (_, index) => (parts[index] ?? parts.at(-1)) as TableAlignment);
}

function escapeCell(value: string, trim: boolean): string {
  const normalized = trim ? value.trim() : value;
  return normalized.replace(/\\/gu, '\\\\').replace(/\|/gu, '\\|').replace(/\r?\n|\r/gu, '<br>');
}

export function generateMarkdownTable(task: MarkdownTableTask): string {
  const rows = parseTabular(task.source, task.delimiter);
  const dataRowCount = task.firstRowHeader ? rows.length - 1 : rows.length;
  if (dataRowCount > MAX_ROWS) {
    throw new RangeError('Tables are limited to 10,000 data rows.');
  }
  const columns = Math.max(...rows.map(row => row.length));
  const normalized = rows.map(row => Array.from({ length: columns }, (_, index) => escapeCell(row[index] ?? '', task.trimCells)));
  const header = task.firstRowHeader ? normalized.shift()! : Array.from({ length: columns }, (_, index) => `Column ${index + 1}`);
  const alignments = parseAlignments(task.alignmentPattern, columns);
  const marker = (alignment: TableAlignment) => alignment === 'center' ? ':---:' : alignment === 'right' ? '---:' : ':---';
  const render = (row: string[]) => `| ${row.join(' | ')} |`;
  return [render(header), render(alignments.map(marker)), ...normalized.map(render)].join('\n');
}
