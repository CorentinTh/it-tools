export interface ParseOptions {
  /** Field separator, e.g. ',', ';', '\t'. */
  delimiter: string
  /** Treat the first row as column names instead of data. */
  hasHeaders: boolean
  /** Convert '42', 'true', 'false', 'null' and empty fields to typed JSON values. */
  inferTypes: boolean
  /** Remove spaces around unquoted fields. */
  trimFields: boolean
}

export interface ParseResult {
  headers: string[]
  records: Record<string, unknown>[]
}

function inferValue(raw: string): unknown {
  if (raw === '') {
    return null;
  }
  if (raw === 'true') {
    return true;
  }
  if (raw === 'false') {
    return false;
  }
  if (raw === 'null') {
    return null;
  }
  if (/^-?\d+(\.\d+)?$/.test(raw)) {
    const asNumber = Number(raw);
    if (Number.isFinite(asNumber)) {
      return asNumber;
    }
  }
  return raw;
}

/** RFC 4180 state machine: quoted fields may contain the delimiter, escaped
 *  double quotes (""), and newlines; unquoted fields end at the delimiter or
 *  any line break. */
export function parseCsv(csv: string, options: ParseOptions): ParseResult {
  const delimiter = options.delimiter.length === 1 ? options.delimiter : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let started = false;

  for (let index = 0; index < csv.length; index++) {
    const char = csv[index]!;

    if (inQuotes) {
      if (char === '"') {
        if (csv[index + 1] === '"') {
          field += '"';
          index++;
        }
        else {
          inQuotes = false;
        }
      }
      else {
        field += char;
      }
      continue;
    }

    if (char === '"' && (field === '' || (options.trimFields && field.trim() === ''))) {
      // relaxed RFC 4180: tolerate whitespace before the opening quote
      inQuotes = true;
      started = true;
      field = '';
      continue;
    }

    if (char === delimiter) {
      row.push(options.trimFields && !started ? field.trim() : field);
      field = '';
      started = false;
      continue;
    }

    if (char === '\n' || char === '\r') {
      if (char === '\r' && csv[index + 1] === '\n') {
        index++;
      }
      row.push(options.trimFields && !started ? field.trim() : field);
      rows.push(row);
      row = [];
      field = '';
      started = false;
      // skip trailing empty record caused by a final newline
      const atEnd = index + 1 >= csv.length;
      if (atEnd && row.length === 0) {
        break;
      }
      continue;
    }

    field += char;
  }

  if (field !== '' || row.length > 0 || started) {
    row.push(options.trimFields && !started ? field.trim() : field);
    rows.push(row);
  }

  // drop fully-empty trailing rows
  while (rows.length > 0 && rows[rows.length - 1]!.every(value => value === '')) {
    rows.pop();
  }

  if (rows.length === 0) {
    return { headers: [], records: [] };
  }

  const [firstRow, ...dataRows] = rows;
  const headers = options.hasHeaders
    ? firstRow!.map((header, index) => header || `column_${index + 1}`)
    : firstRow!.map((_value, index) => `column_${index + 1}`);

  const allDataRows = options.hasHeaders ? dataRows : rows;
  const records = allDataRows.map(dataRow =>
    Object.fromEntries(headers.map((header, index) => {
      const raw = dataRow[index] ?? '';
      return [header, options.inferTypes ? inferValue(raw) : raw];
    })),
  );

  return { headers, records };
}
