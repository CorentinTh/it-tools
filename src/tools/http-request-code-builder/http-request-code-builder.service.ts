import { parseCliCommand, quoteCliWord } from '../cli-command-editor/cli-command-editor.service';

export type HttpCodeTarget = 'curl' | 'fetch';

export interface HttpRequestDraft {
  method: string
  url: string
  headers: string
  query: string
  body: string
  target: HttpCodeTarget
  revealSecrets: boolean
}

export interface ImportedCurlDraft {
  method: string
  url: string
  headers: string
  query: string
  body: string
  warnings: string[]
}

export const HTTP_BUILDER_MAX_TEXT_BYTES = 64 * 1024;
export const HTTP_BUILDER_MAX_URL_CHARACTERS = 8_192;
export const HTTP_BUILDER_MAX_ENTRIES = 100;

const HEADER_NAME = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/u;
const METHOD = /^[A-Z]+$/u;
const SENSITIVE_NAME = /(?:authorization|cookie|set-cookie|api[-_]?key|token|secret|password|passwd|signature|credential)/iu;

function utf8Length(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function assertTextLimit(value: string, label: string): void {
  if (utf8Length(value) > HTTP_BUILDER_MAX_TEXT_BYTES) {
    throw new RangeError(`${label} is limited to 64 KiB of UTF-8 text.`);
  }
}

function parseLines(value: string, separator: ':' | '=', label: 'header' | 'query'): Array<[string, string]> {
  const lines = value.split(/\r?\n|\r/u).filter(line => line.trim());
  if (lines.length > HTTP_BUILDER_MAX_ENTRIES) {
    throw new RangeError(`${label === 'header' ? 'Headers' : 'Query fields'} are limited to 100 entries.`);
  }
  return lines.map((line, index) => {
    if (line.length > 8 * 1024) {
      throw new RangeError(`${label === 'header' ? 'Header' : 'Query'} line ${index + 1} exceeds 8 KiB.`);
    }
    const delimiter = line.indexOf(separator);
    if (delimiter <= 0) {
      throw new TypeError(`${label === 'header' ? 'Header' : 'Query'} line ${index + 1} must use ${separator === ':' ? 'Name: value' : 'name=value'}.`);
    }
    const name = line.slice(0, delimiter).trim();
    const fieldValue = line.slice(delimiter + 1).trim();
    if (label === 'header') {
      if (!HEADER_NAME.test(name)) {
        throw new TypeError(`Header line ${index + 1} has an invalid field name.`);
      }
      if (/[^\t\x20-\x7E]/u.test(fieldValue)) {
        throw new TypeError(`Header line ${index + 1} contains a control or non-ASCII value.`);
      }
    }
    else if (/[\0\r\n]/u.test(name) || /[\0\r\n]/u.test(fieldValue)) {
      throw new TypeError(`Query line ${index + 1} contains a forbidden control character.`);
    }
    return [name, fieldValue];
  });
}

function validateUrl(value: string): URL {
  if (!value || value.length > HTTP_BUILDER_MAX_URL_CHARACTERS) {
    throw new RangeError('URL is required and limited to 8,192 characters.');
  }
  let parsed: URL;
  try {
    parsed = new URL(value);
  }
  catch {
    throw new TypeError('Enter an absolute HTTP or HTTPS URL.');
  }
  if ((parsed.protocol !== 'http:' && parsed.protocol !== 'https:') || parsed.username || parsed.password) {
    throw new TypeError('Only HTTP(S) URLs without embedded credentials are supported.');
  }
  return parsed;
}

function redactEntries(entries: Array<[string, string]>, reveal: boolean): Array<[string, string]> {
  return entries.map(([name, value]) => [name, !reveal && SENSITIVE_NAME.test(name) ? '<redacted>' : value]);
}

function redactBody(body: string, reveal: boolean, headers: Array<[string, string]>): string {
  if (reveal || !body.trim()) {
    return body;
  }
  try {
    const visit = (value: unknown): unknown => {
      if (Array.isArray(value)) {
        return value.map(visit);
      }
      if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, SENSITIVE_NAME.test(key) ? '<redacted>' : visit(entry)]));
      }
      return value;
    };
    return JSON.stringify(visit(JSON.parse(body)), null, 2);
  }
  catch {
    const contentType = headers.find(([name]) => name.toLowerCase() === 'content-type')?.[1] ?? '';
    if (/^application\/x-www-form-urlencoded(?:;|$)/iu.test(contentType)) {
      const parameters = new URLSearchParams(body);
      const redacted = new URLSearchParams();
      parameters.forEach((value, name) => redacted.append(name, SENSITIVE_NAME.test(name) ? '<redacted>' : value));
      return redacted.toString();
    }
    return body;
  }
}

function normalizeDraft(draft: HttpRequestDraft): { method: string; url: string; headers: Array<[string, string]>; body: string } {
  assertTextLimit(draft.headers, 'Headers');
  assertTextLimit(draft.query, 'Query fields');
  assertTextLimit(draft.body, 'Body');
  const method = draft.method.trim().toUpperCase();
  if (!METHOD.test(method) || method.length > 32) {
    throw new TypeError('HTTP method must contain 1–32 ASCII letters.');
  }
  if ((method === 'GET' || method === 'HEAD') && draft.body) {
    throw new TypeError(`${method} requests cannot include a body in this builder.`);
  }
  const url = validateUrl(draft.url);
  const query = redactEntries(parseLines(draft.query, '=', 'query'), draft.revealSecrets);
  for (const [name, value] of query) {
    url.searchParams.append(name, value);
  }
  const parsedHeaders = parseLines(draft.headers, ':', 'header');
  const headers = redactEntries(parsedHeaders, draft.revealSecrets);
  const body = redactBody(draft.body, draft.revealSecrets, parsedHeaders);
  return { method, url: url.toString(), headers, body };
}

function renderCurl(request: ReturnType<typeof normalizeDraft>): string {
  const tokens = ['curl', '--request', request.method, '--url', request.url];
  for (const [name, value] of request.headers) {
    tokens.push('--header', `${name}: ${value}`);
  }
  if (request.body) {
    tokens.push('--data-raw', request.body);
  }
  return tokens.map(token => quoteCliWord(token, 'posix')).join(' ');
}

function renderFetch(request: ReturnType<typeof normalizeDraft>): string {
  const options = [
    `  method: ${JSON.stringify(request.method)},`,
    ...(request.headers.length ? [`  headers: new Headers(${JSON.stringify(request.headers, null, 2).replace(/^/gmu, '  ').trimStart()}),`] : []),
    ...(request.body ? [`  body: ${JSON.stringify(request.body)},`] : []),
  ];
  return [
    `const response = await fetch(${JSON.stringify(request.url)}, {`,
    ...options,
    '});',
    '',
    'if (!response.ok) {',
    '  throw new Error(\'HTTP \' + response.status);',
    '}',
  ].join('\n');
}

export function buildHttpRequestCode(draft: HttpRequestDraft): string {
  const request = normalizeDraft(draft);
  const output = draft.target === 'curl' ? renderCurl(request) : renderFetch(request);
  if (utf8Length(output) > 256 * 1024) {
    throw new RangeError('Generated request code is limited to 256 KiB.');
  }
  return output;
}

function takeValue(tokens: string[], index: number, flag: string): { value: string; nextIndex: number } {
  const value = tokens[index + 1];
  if (value === undefined) {
    throw new TypeError(`${flag} requires a value.`);
  }
  return { value, nextIndex: index + 1 };
}

export function importCurlCommand(source: string): ImportedCurlDraft {
  assertTextLimit(source, 'cURL command');
  const document = parseCliCommand(source, 'posix');
  if (document.tokens.some(token => token.kind === 'operator')) {
    throw new TypeError('Pipelines, redirections, and chained commands are not supported for cURL import.');
  }
  const tokens = document.tokens.map(token => token.value);
  const executable = tokens.shift() ?? '';
  if (!/(?:^|\/)curl$/u.test(executable)) {
    throw new TypeError('The imported command must invoke curl directly.');
  }
  let method = '';
  let url = '';
  const headers: string[] = [];
  const data: string[] = [];
  const warnings: string[] = [];
  let positional = false;
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === '--') {
      positional = true;
      continue;
    }
    const longAssignment = /^(--(?:request|header|data|data-raw|data-binary|url))=(.*)$/su.exec(token);
    if (longAssignment) {
      tokens.splice(index, 1, longAssignment[1], longAssignment[2]);
      index -= 1;
      continue;
    }
    if (!positional && (token === '-X' || token === '--request')) {
      const taken = takeValue(tokens, index, token);
      method = taken.value.toUpperCase();
      index = taken.nextIndex;
    }
    else if (!positional && /^-X.+/su.test(token)) {
      method = token.slice(2).toUpperCase();
    }
    else if (!positional && (token === '-H' || token === '--header')) {
      const taken = takeValue(tokens, index, token);
      headers.push(taken.value);
      index = taken.nextIndex;
    }
    else if (!positional && /^-H.+/su.test(token)) {
      headers.push(token.slice(2));
    }
    else if (!positional && ['-d', '--data', '--data-raw', '--data-binary'].includes(token)) {
      const taken = takeValue(tokens, index, token);
      data.push(taken.value);
      index = taken.nextIndex;
    }
    else if (!positional && /^-d.+/su.test(token)) {
      data.push(token.slice(2));
    }
    else if (!positional && token === '--url') {
      const taken = takeValue(tokens, index, token);
      if (url) {
        throw new TypeError('Only one request URL is supported.');
      }
      url = taken.value;
      index = taken.nextIndex;
    }
    else if (!positional && ['--compressed', '-s', '--silent', '-S', '--show-error', '-L', '--location'].includes(token)) {
      warnings.push(`${token} is transport behavior and was omitted from generated code.`);
    }
    else if (!positional && token.startsWith('-')) {
      throw new TypeError(`Unsupported cURL option: ${token}`);
    }
    else if (!url) {
      url = token;
    }
    else {
      throw new TypeError('Only one positional request URL is supported.');
    }
  }
  const normalizedUrl = validateUrl(url).toString();
  parseLines(headers.join('\n'), ':', 'header');
  const body = data.join('&');
  assertTextLimit(body, 'Imported body');
  method ||= body ? 'POST' : 'GET';
  if (!METHOD.test(method) || method.length > 32) {
    throw new TypeError('Imported HTTP method is invalid.');
  }
  return { method, url: normalizedUrl, headers: headers.join('\n'), query: '', body, warnings };
}
