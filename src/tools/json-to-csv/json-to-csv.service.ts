export { getHeaders, convertArrayToCsv };

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

function convertArrayToCsv({ array }: { array: Record<string, unknown>[] }): string {
  const headers = getHeaders({ array });

  const rows = array.map(item => headers.map(header => serializeValue(item[header])));

  return [headers.map(serializeValue).join(','), ...rows].join('\n');
}
