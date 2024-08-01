import { type MaybeRef, get } from '@vueuse/core';
import JSON5 from 'json5';

export { sortObjectKeys, sortObjectValues, formatJson };

function sortObjectKeys<T>(obj: T, sortMethod: string): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(value => sortObjectKeys(value, sortMethod)) as unknown as T;
  }

  return Object.keys(obj)
    .sort((a, b) => sortMethod === 'key_name' ? a.localeCompare(b) : b.localeCompare(a))
    .reduce((sortedObj, key) => {
      sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key], sortMethod);
      return sortedObj;
    }, {} as Record<string, unknown>) as T;
}

function sortObjectValues<T>(obj: T, sortMethod: string, keyName: string): T {
  if (Array.isArray(obj)) {
    return obj.sort((a, b) => {
      const valueA = a[keyName];
      const valueB = b[keyName];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortMethod === 'key_val' ? valueA - valueB : valueB - valueA;
      }
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortMethod === 'key_val' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      return 0;
    });
  }

  if (typeof obj === 'object' && obj !== null) {
    const sortedKeys = Object.keys(obj).sort((a, b) => {
      if (sortMethod === 'key_val') {
        return a.localeCompare(b);
      }
      return b.localeCompare(a);
    });

    return sortedKeys.reduce((sortedObj, key) => {
      sortedObj[key] = sortObjectValues((obj as Record<string, unknown>)[key], sortMethod, keyName);
      return sortedObj;
    }, {} as Record<string, unknown>) as T;
  }

  return obj;
}

function formatJson({
  rawJson,
  sortMethod = 'key_name',
  keyName = '',
  indentSize = 3,
}: {
  rawJson: MaybeRef<string>
  sortMethod: MaybeRef<string>
  keyName: MaybeRef<string>
  indentSize?: MaybeRef<number>
}) {
  const parsedObject = JSON5.parse(get(rawJson));

  if (['key_name', 'key_name_desc'].includes(get(sortMethod))) {
    return JSON.stringify(sortObjectKeys(parsedObject, get(sortMethod)), null, get(indentSize));
  }

  return JSON.stringify(sortObjectValues(parsedObject, get(sortMethod), get(keyName)), null, get(indentSize));
}
