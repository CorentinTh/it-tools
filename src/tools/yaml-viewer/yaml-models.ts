import { type MaybeRef, get } from '@vueuse/core';
import JSON5 from 'json5';

export { sortObjectKeys, formatYaml };

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

function formatYaml({
                        rawYaml,
                        sortKeys = false,
                        stripComments = false,
                        indentSize = 3,
                    }: {
    rawYaml: MaybeRef<string>
    sortKeys?: MaybeRef<boolean>
    stripComments?: MaybeRef<boolean>
    indentSize?: MaybeRef<number>
}) {
    const parsedObject = JSON5.parse(get(rawYaml));

    return JSON.stringify(get(sortKeys) ? sortObjectKeys(parsedObject) : parsedObject, null, get(indentSize));
}
