export { convertArrayToCsv, getHeaders };

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

  return escapeField(String(value));
}

// RFC 4180: a field that contains a comma, a double quote, or a line break is enclosed in double quotes,
// and a double quote inside the field is doubled.
function escapeField(field: string): string {
  if (/[",\r\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }

  return field;
}

function convertArrayToCsv({ array }: { array: Record<string, unknown>[] }): string {
  const headers = getHeaders({ array });

  const headerRow = headers.map(escapeField).join(',');
  const rows = array.map(item => headers.map(header => serializeValue(item[header])).join(','));

  return [headerRow, ...rows].join('\r\n');
}
