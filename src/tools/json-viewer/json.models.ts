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

function unescapeJson(jsonString: string): string {
  try {
    // First, try to handle double-escaped scenarios
    let result = jsonString.trim();

    // If the string starts and ends with quotes, and contains escaped quotes inside,
    // it might be a JSON string that needs to be unescaped
    if ((result.startsWith('"') && result.endsWith('"'))
        || (result.startsWith('\'') && result.endsWith('\''))) {
      // Remove outer quotes first
      result = result.slice(1, -1);
    }

    // Handle common escape sequences
    result = result
      .replace(/\\"/g, '"') // Unescape quotes
      .replace(/\\\\/g, '\\') // Unescape backslashes (do this after quotes!)
      .replace(/\\n/g, '\n') // Unescape newlines
      .replace(/\\r/g, '\r') // Unescape carriage returns
      .replace(/\\t/g, '\t') // Unescape tabs
      .replace(/\\f/g, '\f') // Unescape form feeds
      .replace(/\\b/g, '\b') // Unescape backspaces
      .replace(/\\\//g, '/'); // Unescape forward slashes

    return result;
  }
  catch {
    return jsonString;
  }
}

function formatJson({
  rawJson,
  sortKeys = true,
  indentSize = 3,
  autoUnescape = false,
}: {
  rawJson: MaybeRef<string>
  sortKeys?: MaybeRef<boolean>
  indentSize?: MaybeRef<number>
  autoUnescape?: MaybeRef<boolean>
}) {
  let jsonString = get(rawJson);

  if (get(autoUnescape)) {
    jsonString = unescapeJson(jsonString);
  }

  const parsedObject = JSON5.parse(jsonString);

  return JSON.stringify(get(sortKeys) ? sortObjectKeys(parsedObject) : parsedObject, null, get(indentSize));
}
