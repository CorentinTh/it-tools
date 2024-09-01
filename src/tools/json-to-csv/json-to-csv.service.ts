import { flatten } from 'flatten-anything';

export { getHeaders, convertArrayToCsv };

function getHeaders({ array }: { array: Record<string, unknown>[] }): string[] {
  const headers = new Set<string>();

  array.forEach(item => Object.keys(flatten(item)).forEach(key => headers.add(key)));

  return Array.from(headers);
}

function serializeValue(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return '';
  }

  const valueAsString = String(value).replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/"/g, '\\"');

  if (valueAsString.includes(',')) {
    return `"${valueAsString}"`;
  }

  return valueAsString;
}

function convertArrayToCsv({ arrayOrObject }: { arrayOrObject: Record<string, unknown>[] | Record<string, unknown> }): string {
  const array = !Array.isArray(arrayOrObject) ? [arrayOrObject] : arrayOrObject;

  const headers = getHeaders({ array });

  const rows = array.map(item => headers.map(header => serializeValue(flatten(item)[header])));

  return [headers.join(','), ...rows].join('\n');
}
