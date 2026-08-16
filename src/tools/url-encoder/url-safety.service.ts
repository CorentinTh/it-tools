export const URL_WORKSPACE_MAX_BYTES = 64 * 1024;
const FIELD_MAX_LENGTH = 256;

const TRACKING_PARAMETER_NAMES = new Set([
  '_ga',
  '_gl',
  'dclid',
  'fbclid',
  'gclid',
  'gbraid',
  'igshid',
  'mc_cid',
  'mc_eid',
  'msclkid',
  'ref_src',
  's_cid',
  'twclid',
  'wbraid',
]);

export interface TrackerRemovalResult {
  url: string
  removedParameters: string[]
}

export interface UtmCampaign {
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
}

export interface TextFragmentParts {
  start: string
  end?: string
  prefix?: string
  suffix?: string
}

function utf8Bytes(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function assertBounded(value: string, label: string, maxBytes = URL_WORKSPACE_MAX_BYTES): void {
  if (utf8Bytes(value) > maxBytes) {
    throw new Error(`${label} is limited to ${maxBytes.toLocaleString('en-US')} UTF-8 bytes.`);
  }
}

function parseHttpUrl(value: string): URL {
  assertBounded(value, 'URL');
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  }
  catch {
    throw new Error('Enter an absolute HTTP or HTTPS URL.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are supported.');
  }
  if (parsed.username || parsed.password) {
    throw new Error('URLs containing embedded credentials are rejected.');
  }
  return parsed;
}

function validateField(value: string, label: string, required = false): string {
  const normalized = value.trim();
  if (required && normalized === '') {
    throw new Error(`${label} is required.`);
  }
  if (normalized.length > FIELD_MAX_LENGTH) {
    throw new Error(`${label} is limited to ${FIELD_MAX_LENGTH} characters.`);
  }
  return normalized;
}

function isTrackingParameter(name: string): boolean {
  const normalized = name.toLowerCase();
  return normalized.startsWith('utm_') || TRACKING_PARAMETER_NAMES.has(normalized);
}

export function removeTrackingParameters(value: string): TrackerRemovalResult {
  const parsed = parseHttpUrl(value);
  const removedParameters: string[] = [];
  for (const name of [...parsed.searchParams.keys()]) {
    if (isTrackingParameter(name)) {
      removedParameters.push(name);
      parsed.searchParams.delete(name);
    }
  }
  return {
    url: parsed.toString(),
    removedParameters: [...new Set(removedParameters)],
  };
}

export function defangUrl(value: string): string {
  const parsed = parseHttpUrl(value);
  const scheme = parsed.protocol === 'https:' ? 'hxxps:' : 'hxxp:';
  const hostname = parsed.hostname.includes(':')
    ? parsed.hostname
    : parsed.hostname.replace(/\./g, '[.]');
  const port = parsed.port ? `:${parsed.port}` : '';
  return `${scheme}//${hostname}${port}${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function refangUrl(value: string): string {
  assertBounded(value, 'URL');
  const normalized = value.trim()
    .replace(/^hxxps:\/\//i, 'https://')
    .replace(/^hxxp:\/\//i, 'http://')
    .replace(/\[\.\]/g, '.');
  return parseHttpUrl(normalized).toString();
}

export function buildUtmUrl(baseUrl: string, campaign: UtmCampaign): string {
  const parsed = parseHttpUrl(baseUrl);
  const fields: Array<[keyof UtmCampaign, string, boolean]> = [
    ['source', 'UTM source', true],
    ['medium', 'UTM medium', true],
    ['campaign', 'UTM campaign', true],
    ['term', 'UTM term', false],
    ['content', 'UTM content', false],
  ];
  for (const [field, label, required] of fields) {
    const normalized = validateField(campaign[field] ?? '', label, required);
    const parameter = `utm_${field}`;
    if (normalized) {
      parsed.searchParams.set(parameter, normalized);
    }
    else {
      parsed.searchParams.delete(parameter);
    }
  }
  return parsed.toString();
}

export function buildTextFragmentUrl(baseUrl: string, parts: TextFragmentParts): string {
  const parsed = parseHttpUrl(baseUrl);
  const start = validateField(parts.start, 'Start text', true);
  const end = validateField(parts.end ?? '', 'End text');
  const prefix = validateField(parts.prefix ?? '', 'Prefix');
  const suffix = validateField(parts.suffix ?? '', 'Suffix');
  const selection = [
    prefix ? `${encodeURIComponent(prefix)}-,` : '',
    encodeURIComponent(start),
    end ? `,${encodeURIComponent(end)}` : '',
    suffix ? `,-${encodeURIComponent(suffix)}` : '',
  ].join('');
  const existingFragment = parsed.hash.slice(1).split(':~:')[0];
  parsed.hash = `${existingFragment ? `${existingFragment}:~:` : ':~:'}text=${selection}`;
  return parsed.toString();
}
