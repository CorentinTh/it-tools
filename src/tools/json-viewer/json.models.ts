import { type MaybeRef, get } from '@vueuse/core';
import JSON5 from 'json5';

export { sortObjectKeys, formatJson };

function sortObjectKeys<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys) as unknown as T;
  }

  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((sortedObj, key) => {
      sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
      return sortedObj;
    }, {} as Record<string, unknown>) as T;
}

/** JSON5.parse rounds integers above 2^53 (e.g. snowflake or transaction ids)
 *  to the nearest float. Quoting every integer literal longer than 15 digits
 *  before parsing keeps them exact, and stringify keeps the quotes only for
 *  the values we wrapped (they carry a marker key that is stripped after). */
function preserveBigNumbers(json: string): string {
  return json.replace(
    /(?<![\A-Za-z0-9_."])(-?\d{16,})(?!\.?\d)/g,
    '"__bigint__$1__bigint__"',
  );
}

function restoreBigNumbers(value: unknown): unknown {
  if (typeof value === 'string') {
    const match = value.match(/^__bigint__(-?\d{16,})__bigint__$/);
    if (match) {
      return match[1];
    }
  }
  if (Array.isArray(value)) {
    return value.map(restoreBigNumbers);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, restoreBigNumbers(val)]));
  }
  return value;
}

function formatJson({
  rawJson,
  sortKeys = true,
  indentSize = 3,
}: {
  rawJson: MaybeRef<string>
  sortKeys?: MaybeRef<boolean>
  indentSize?: MaybeRef<number>
}) {
  const parsedObject = restoreBigNumbers(JSON5.parse(preserveBigNumbers(get(rawJson))));

  return JSON.stringify(get(sortKeys) ? sortObjectKeys(parsedObject) : parsedObject, null, get(indentSize));
}
