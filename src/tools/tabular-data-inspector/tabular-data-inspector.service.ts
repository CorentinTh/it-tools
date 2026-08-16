import { type TableDelimiter, parseTabular } from '../markdown-table-generator/markdown-table-generator.service';

export type TabularOutputFormat = 'inspect' | 'json-strings' | 'json-inferred' | 'csv' | 'tsv';
export type EmptyCellMode = 'empty-string' | 'null';

export interface TabularDataTask {
  source: string
  delimiter: TableDelimiter
  firstRowHeader: boolean
  trimCells: boolean
  outputFormat: TabularOutputFormat
  emptyCellMode: EmptyCellMode
  protectSpreadsheetFormulas: boolean
}

function normalizeHeaders(row: string[], columns: number, trim: boolean) {
  const counts = new Map<string, number>();
  return Array.from({ length: columns }, (_, index) => {
    const base = (trim ? row[index]?.trim() : row[index]) || `Column ${index + 1}`;
    const count = (counts.get(base) ?? 0) + 1;
    counts.set(base, count);
    return count === 1 ? base : `${base} (${count})`;
  });
}

function normalizeCell(value: string, trim: boolean) {
  return trim ? value.trim() : value;
}

function inferCell(value: string, emptyCellMode: EmptyCellMode): string | number | boolean | null {
  if (value === '') {
    return emptyCellMode === 'null' ? null : '';
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/u.test(value)) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && (!Number.isInteger(numeric) || Number.isSafeInteger(numeric))) {
      return numeric;
    }
  }
  return value;
}

function spreadsheetSafe(value: string) {
  return /^[=+\-@\t\r]/u.test(value) ? `'${value}` : value;
}

function quoteCell(value: string, delimiter: ',' | '\t') {
  return value.includes(delimiter) || /["\r\n]/u.test(value) ? `"${value.replace(/"/gu, '""')}"` : value;
}

function renderDelimited(rows: string[][], delimiter: ',' | '\t', trim: boolean, protect: boolean) {
  const columns = Math.max(...rows.map(row => row.length));
  return rows.map(row => Array.from({ length: columns }, (_, index) => {
    const normalized = normalizeCell(row[index] ?? '', trim);
    return quoteCell(protect ? spreadsheetSafe(normalized) : normalized, delimiter);
  }).join(delimiter)).join('\r\n');
}

function renderInspection(rows: string[][], firstRowHeader: boolean, trim: boolean) {
  const columns = Math.max(...rows.map(row => row.length));
  const header = normalizeHeaders(firstRowHeader ? rows[0] : [], columns, trim);
  const data = firstRowHeader ? rows.slice(1) : rows;
  let emptyCells = 0;
  let raggedRows = 0;
  const typeCounts = header.map(() => ({ empty: 0, boolean: 0, number: 0, string: 0 }));
  data.forEach((row) => {
    if (row.length !== columns) {
      raggedRows += 1;
    }
    for (let index = 0; index < columns; index += 1) {
      const value = normalizeCell(row[index] ?? '', trim);
      if (!value) {
        emptyCells += 1;
      }
      const inferred = inferCell(value, 'empty-string');
      const type = value === '' ? 'empty' : typeof inferred;
      typeCounts[index][type as 'empty' | 'boolean' | 'number' | 'string'] += 1;
    }
  });
  const preview = data.slice(0, 20).map((row, rowIndex) => `${rowIndex + 1}: ${Array.from({ length: columns }, (_, index) => normalizeCell(row[index] ?? '', trim).replace(/[\r\n\t]/gu, character => character === '\t' ? '\\t' : '\\n').slice(0, 120)).join(' | ')}`);
  return [
    `Data rows: ${data.length}`,
    `Columns: ${columns}`,
    `Total data cells (rectangular projection): ${data.length * columns}`,
    `Empty cells: ${emptyCells}`,
    `Ragged rows: ${raggedRows}`,
    '',
    'Column profiles (conservative JavaScript-number inference):',
    ...header.map((name, index) => `${index + 1}. ${name}: empty=${typeCounts[index].empty}, boolean=${typeCounts[index].boolean}, number=${typeCounts[index].number}, string=${typeCounts[index].string}`),
    '',
    `Preview (${Math.min(20, data.length)} rows; cells truncated to 120 characters):`,
    ...preview,
  ].join('\n');
}

export function processTabularData(task: TabularDataTask) {
  const rows = parseTabular(task.source.replace(/^\uFEFF/u, ''), task.delimiter, { preserveTrailingEmptyRows: true });
  const columns = Math.max(...rows.map(row => row.length));
  if (task.outputFormat === 'inspect') {
    return renderInspection(rows, task.firstRowHeader, task.trimCells);
  }
  if (task.outputFormat === 'csv' || task.outputFormat === 'tsv') {
    return renderDelimited(rows, task.outputFormat === 'csv' ? ',' : '\t', task.trimCells, task.protectSpreadsheetFormulas);
  }
  const header = normalizeHeaders(task.firstRowHeader ? rows[0] : [], columns, task.trimCells);
  const data = task.firstRowHeader ? rows.slice(1) : rows;
  const objects = data.map(row => Object.fromEntries(header.map((name, index) => {
    const value = normalizeCell(row[index] ?? '', task.trimCells);
    return [name, task.outputFormat === 'json-inferred' ? inferCell(value, task.emptyCellMode) : value];
  })));
  return JSON.stringify(objects, null, 2);
}
