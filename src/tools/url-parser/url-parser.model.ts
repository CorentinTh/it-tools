export const URL_PROPERTY_DEFINITIONS = [
  { title: 'Protocol', key: 'protocol' },
  { title: 'Username', key: 'username' },
  { title: 'Password', key: 'password' },
  { title: 'Hostname', key: 'hostname' },
  { title: 'Port', key: 'port' },
  { title: 'Path', key: 'pathname' },
  { title: 'Params', key: 'search' },
  { title: 'Fragment', key: 'hash' },
] as const satisfies ReadonlyArray<{ title: string; key: keyof URL }>;

export interface UrlProperty {
  title: string
  key: typeof URL_PROPERTY_DEFINITIONS[number]['key']
  value: string
}

export interface UrlQueryParameter {
  id: string
  name: string
  value: string
}

export function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  }
  catch {
    return undefined;
  }
}

export function getUrlProperties(url: URL | undefined): UrlProperty[] {
  return URL_PROPERTY_DEFINITIONS.map(({ title, key }) => ({
    title,
    key,
    value: url?.[key] ?? '',
  }));
}

export function getUrlQueryParameters(url: URL | undefined): UrlQueryParameter[] {
  if (!url) {
    return [];
  }

  return Array.from(url.searchParams.entries(), ([name, value], index) => ({
    id: `${index}:${name}`,
    name,
    value,
  }));
}
