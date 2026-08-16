import { isUnknownRecord } from '@/utils/worker-protocol';

export const SANITIZER_MODES = ['auto', 'text', 'json', 'har'] as const;
export type SanitizerMode = typeof SANITIZER_MODES[number];

export interface SanitizerOptions {
  source: string
  mode: SanitizerMode
  maskEmails: boolean
  maskIpAddresses: boolean
}

export interface SanitizerResult {
  output: string
  replacements: number
  detectedMode: Exclude<SanitizerMode, 'auto'>
}

const REDACTED = '[REDACTED]';
const MAX_DEPTH = 64;
const MAX_NODES = 100_000;
const SENSITIVE_KEY = /^(?:authorization|proxyauthorization|cookie|setcookie|password|passwd|passphrase|secret|clientsecret|token|accesstoken|refreshtoken|idtoken|apikey|privatekey|session|sessionid|jwt|csrf|xsrf)$/;
const SENSITIVE_QUERY_KEY = /^(?:access_token|api_key|apikey|auth|authorization|code|key|password|secret|session|signature|sig|token)$/i;
const PRIVATE_KEY_PATTERN = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g;
const AUTHORIZATION_PATTERN = /\b((?:proxy-)?authorization\s*:\s*)(?:basic|bearer)\s+[^\s,;]+/gi;
const ASSIGNMENT_PATTERN = /\b((?:api[-_]?key|access[-_]?token|refresh[-_]?token|client[-_]?secret|password|passwd|session[-_]?id|jwt)\s*[:=]\s*)(["']?)([^\s,"';&}]+)\2/gi;
const JWT_PATTERN = /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const IPV4_PATTERN = /\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/g;

function normalizedKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function isSensitiveKey(value: string): boolean {
  return SENSITIVE_KEY.test(normalizedKey(value));
}

function replaceAndCount(
  source: string,
  pattern: RegExp,
  replacement: string | ((...matches: string[]) => string),
): { value: string; count: number } {
  let count = 0;
  const value = source.replace(pattern, (...matches: string[]) => {
    count++;
    return typeof replacement === 'string' ? replacement : replacement(...matches);
  });
  return { value, count };
}

export function sanitizePlainText(source: string, maskEmails: boolean, maskIpAddresses: boolean): { value: string; replacements: number } {
  let value = source;
  let replacements = 0;
  const apply = (pattern: RegExp, replacement: string | ((...matches: string[]) => string)) => {
    const result = replaceAndCount(value, pattern, replacement);
    value = result.value;
    replacements += result.count;
  };

  apply(PRIVATE_KEY_PATTERN, REDACTED);
  apply(AUTHORIZATION_PATTERN, (...matches) => `${matches[1]}${REDACTED}`);
  apply(ASSIGNMENT_PATTERN, (...matches) => `${matches[1]}${matches[2]}${REDACTED}${matches[2]}`);
  apply(JWT_PATTERN, REDACTED);
  if (maskEmails) {
    apply(EMAIL_PATTERN, REDACTED);
  }
  if (maskIpAddresses) {
    apply(IPV4_PATTERN, REDACTED);
  }
  return { value, replacements };
}

function sanitizeUrl(source: string): { value: string; replacements: number } {
  try {
    const url = new URL(source);
    let replacements = 0;
    for (const key of Array.from(url.searchParams.keys())) {
      if (SENSITIVE_QUERY_KEY.test(key)) {
        const values = url.searchParams.getAll(key);
        url.searchParams.delete(key);
        for (const _value of values) {
          url.searchParams.append(key, REDACTED);
          replacements++;
        }
      }
    }
    if (url.hash.length > 1) {
      url.hash = REDACTED;
      replacements++;
    }
    return { value: url.toString(), replacements };
  }
  catch {
    return { value: source, replacements: 0 };
  }
}

interface WalkState {
  nodes: number
  replacements: number
  options: Pick<SanitizerOptions, 'maskEmails' | 'maskIpAddresses'>
}

function sanitizeJsonValue(value: unknown, state: WalkState, depth: number): unknown {
  state.nodes++;
  if (depth > MAX_DEPTH || state.nodes > MAX_NODES) {
    throw new Error('The structured document is too deeply nested or contains too many values.');
  }
  if (Array.isArray(value)) {
    return value.map(item => sanitizeJsonValue(item, state, depth + 1));
  }
  if (!isUnknownRecord(value)) {
    if (typeof value !== 'string') {
      return value;
    }
    const text = sanitizePlainText(value, state.options.maskEmails, state.options.maskIpAddresses);
    state.replacements += text.replacements;
    return text.value;
  }

  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (isSensitiveKey(key)) {
      output[key] = REDACTED;
      state.replacements++;
      continue;
    }
    if (key === 'url' && typeof child === 'string') {
      const url = sanitizeUrl(child);
      output[key] = url.value;
      state.replacements += url.replacements;
      continue;
    }
    if (key === 'value' && typeof child === 'string' && typeof value.name === 'string' && isSensitiveKey(value.name)) {
      output[key] = REDACTED;
      state.replacements++;
      continue;
    }
    if (key === 'text' && typeof child === 'string' && value.encoding !== 'base64') {
      try {
        const nested: unknown = JSON.parse(child);
        output[key] = JSON.stringify(sanitizeJsonValue(nested, state, depth + 1));
      }
      catch {
        const text = sanitizePlainText(child, state.options.maskEmails, state.options.maskIpAddresses);
        output[key] = text.value;
        state.replacements += text.replacements;
      }
      continue;
    }
    output[key] = sanitizeJsonValue(child, state, depth + 1);
  }
  return output;
}

function parseStructured(source: string, requireHar: boolean): unknown {
  const parsed: unknown = JSON.parse(source);
  if (requireHar && (!isUnknownRecord(parsed) || !isUnknownRecord(parsed.log) || !Array.isArray(parsed.log.entries))) {
    throw new Error('The document is not a valid HAR object with log.entries.');
  }
  return parsed;
}

export function sanitizeSensitiveData(options: SanitizerOptions): SanitizerResult {
  if (!SANITIZER_MODES.includes(options.mode)) {
    throw new Error('Select a supported sanitizer mode.');
  }
  if (options.source.trim() === '') {
    throw new Error('Enter text, JSON, or HAR content to sanitize.');
  }

  let detectedMode: Exclude<SanitizerMode, 'auto'> = options.mode === 'auto' ? 'text' : options.mode;
  let parsed: unknown;
  if (options.mode === 'json' || options.mode === 'har') {
    parsed = parseStructured(options.source, options.mode === 'har');
  }
  else if (options.mode === 'auto') {
    try {
      parsed = parseStructured(options.source, false);
      detectedMode = isUnknownRecord(parsed) && isUnknownRecord(parsed.log) && Array.isArray(parsed.log.entries)
        ? 'har'
        : 'json';
    }
    catch {
      detectedMode = 'text';
    }
  }

  if (detectedMode === 'text') {
    const sanitized = sanitizePlainText(options.source, options.maskEmails, options.maskIpAddresses);
    return { output: sanitized.value, replacements: sanitized.replacements, detectedMode };
  }

  const state: WalkState = {
    nodes: 0,
    replacements: 0,
    options,
  };
  const sanitized = sanitizeJsonValue(parsed, state, 0);
  return {
    output: JSON.stringify(sanitized, null, 2),
    replacements: state.replacements,
    detectedMode,
  };
}
