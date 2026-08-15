export { getHeaders, convertArrayToCsv };

export class CsvOutputLimitError extends Error {
  override readonly name = 'CsvOutputLimitError';
}

function getHeaders({ array }: { array: Record<string, unknown>[] }): string[] {
  const headers = new Set<string>();

  array.forEach(item => Object.keys(item).forEach(key => headers.add(key)));

  return Array.from(headers);
}

function serializeValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return '';
  }

  const valueAsString = String(value);

  if (/[",\r\n]/.test(valueAsString)) {
    return `"${valueAsString.replace(/"/g, '""')}"`;
  }

  return valueAsString;
}

function convertArrayToCsv({
  array,
  maxOutputBytes = Number.MAX_SAFE_INTEGER,
}: {
  array: Record<string, unknown>[]
  maxOutputBytes?: number
}): string {
  if (!Number.isSafeInteger(maxOutputBytes) || maxOutputBytes < 0) {
    throw new RangeError('maxOutputBytes must be a non-negative safe integer.');
  }

  const headers = getHeaders({ array });
  const encoder = new TextEncoder();
  const chunks: string[] = [];
  let byteLength = 0;

  function append(chunk: string): void {
    byteLength += encoder.encode(chunk).byteLength;
    if (byteLength > maxOutputBytes) {
      throw new CsvOutputLimitError('CSV output exceeds its byte limit.');
    }
    chunks.push(chunk);
  }

  headers.forEach((header, index) => {
    if (index > 0) {
      append(',');
    }
    append(serializeValue(header));
  });

  array.forEach((item) => {
    append('\n');
    headers.forEach((header, index) => {
      if (index > 0) {
        append(',');
      }
      append(serializeValue(item[header]));
    });
  });

  return chunks.join('');
}
