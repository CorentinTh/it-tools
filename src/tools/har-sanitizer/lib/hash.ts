export type HashMap = Record<string, string[]>;

export function toHashString(obj: HashMap): string {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, stringArr]) => {
    stringArr.forEach((value) => {
      params.append(key, value);
    });
  });
  return `#${params.toString()}`;
}

export function getHashMap(hash: string): HashMap {
  const existingParams = new URLSearchParams(hash.replace('#', ''));
  return Object.fromEntries(
    [...existingParams.keys()].map(key => [key, existingParams.getAll(key)]),
  );
}
