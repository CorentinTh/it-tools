import { parseDocument, stringify } from 'yaml';
import { parse as parseToml } from 'iarna-toml-esm';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const DEVOPS_CONFIG_MODES = ['dockerfile-lint', 'compose-normalize', 'nginx-format', 'properties-to-yaml', 'yaml-to-properties', 'structured-to-env'] as const;
export type DevopsConfigMode = typeof DEVOPS_CONFIG_MODES[number];
export const DEVOPS_CONFIG_FORMATS = ['yaml', 'json', 'toml'] as const;
export type DevopsConfigFormat = typeof DEVOPS_CONFIG_FORMATS[number];

export interface DevopsConfigTask {
  mode: DevopsConfigMode
  source: string
  format?: DevopsConfigFormat
  path?: string
  prefix?: string
}

const MAX_LINES = 50_000;
const MAX_NODES = 100_000;
const MAX_DEPTH = 64;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function lintDockerfile(source: string): string {
  const lines = source.split(/\r?\n/);
  if (lines.length > MAX_LINES) {
    throw new Error(`Dockerfiles are limited to ${MAX_LINES.toLocaleString('en-US')} lines.`);
  }
  const issues: string[] = [];
  let hasUser = false;
  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (line === '' || line.startsWith('#')) {
      return;
    }
    const [instruction = '', ...rest] = line.split(/\s+/);
    const argument = rest.join(' ');
    const upper = instruction.toUpperCase();
    if (upper === 'FROM' && /(?:^|\s)[^@\s:]+(?::latest)?(?:\s|$)/i.test(argument) && !argument.includes('@sha256:')) {
      issues.push(`Line ${index + 1}: pin FROM to a version or immutable digest instead of an implicit/latest tag.`);
    }
    if (upper === 'ADD' && /^https?:\/\//i.test(argument)) {
      issues.push(`Line ${index + 1}: remote ADD hides download verification; prefer RUN with checksum validation.`);
    }
    if (upper === 'RUN' && /apt-get\s+update/i.test(argument) && !/apt-get\s+install/i.test(argument)) {
      issues.push(`Line ${index + 1}: combine apt-get update and install in one layer.`);
    }
    if (upper === 'RUN' && /curl\b[^|;&]*(?:\||&&)\s*(?:sh|bash)\b/i.test(argument)) {
      issues.push(`Line ${index + 1}: piping a remote script into a shell needs explicit integrity verification.`);
    }
    if (upper === 'USER') {
      hasUser = true;
    }
  });
  if (!hasUser) {
    issues.push('Image runs as its inherited/default user; add an explicit non-root USER when the workload permits it.');
  }
  return issues.length === 0 ? 'No issues found by the bounded static checks.' : issues.map(issue => `- ${issue}`).join('\n');
}

function countNodes(value: unknown, depth = 0, state = { count: 0 }): void {
  state.count += 1;
  if (depth > MAX_DEPTH || state.count > MAX_NODES) {
    throw new Error('The document is too deeply nested or contains too many values.');
  }
  if (Array.isArray(value)) {
    value.forEach(child => countNodes(child, depth + 1, state));
  }
  else if (isUnknownRecord(value)) {
    Object.values(value).forEach(child => countNodes(child, depth + 1, state));
  }
}

function normalizeCompose(source: string): string {
  const document = parseDocument(source, { prettyErrors: false });
  if (document.errors.length > 0) {
    throw new Error('The Compose YAML is invalid.');
  }
  const value: unknown = document.toJS({ maxAliasCount: 100 });
  countNodes(value);
  if (!isUnknownRecord(value) || !isUnknownRecord(value.services) || Object.keys(value.services).length === 0) {
    throw new Error('A Compose document must contain a non-empty services mapping.');
  }
  const normalized = { ...value };
  delete normalized.version;
  return stringify(normalized, { lineWidth: 0, sortMapEntries: false });
}

function formatNginx(source: string): string {
  const output: string[] = [];
  let buffer = '';
  let indent = 0;
  let quote = '';
  let escaped = false;
  const flush = (suffix = '') => {
    const value = buffer.trim();
    if (value || suffix) {
      output.push(`${'  '.repeat(indent)}${value}${suffix}`.trimEnd());
    }
    buffer = '';
  };
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (escaped) {
      buffer += character;
      escaped = false;
      continue;
    }
    if (character === '\\') {
      buffer += character;
      escaped = true;
      continue;
    }
    if (quote) {
      buffer += character;
      if (character === quote) {
        quote = '';
      }
      continue;
    }
    if (character === '"' || character === '\'') {
      quote = character;
      buffer += character;
    }
    else if (character === '#') {
      let end = source.indexOf('\n', index);
      if (end < 0) {
        end = source.length;
      }
      buffer += source.slice(index, end).trimEnd();
      flush();
      index = end;
    }
    else if (character === '{') {
      flush(' {');
      indent += 1;
      if (indent > MAX_DEPTH) {
        throw new Error('Nginx block nesting exceeds the supported depth.');
      }
    }
    else if (character === '}') {
      flush();
      indent -= 1;
      if (indent < 0) {
        throw new Error('Nginx configuration contains an unmatched closing brace.');
      }
      output.push(`${'  '.repeat(indent)}}`);
    }
    else if (character === ';') {
      flush(';');
    }
    else if (!/\s/.test(character) || (buffer && !buffer.endsWith(' '))) {
      buffer += /\s/.test(character) ? ' ' : character;
    }
  }
  if (quote) {
    throw new Error('Nginx configuration contains an unterminated quote.');
  }
  flush();
  if (indent !== 0) {
    throw new Error('Nginx configuration contains an unclosed block.');
  }
  return output.join('\n');
}

function decodeProperty(value: string): string {
  return value.replace(/\\u([0-9a-f]{4})/gi, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\([:=\\ ])/g, '$1');
}

function propertiesToYaml(source: string): string {
  const root: Record<string, unknown> = {};
  const lines = source.split(/\r?\n/);
  if (lines.length > MAX_LINES) {
    throw new Error(`Properties input is limited to ${MAX_LINES.toLocaleString('en-US')} lines.`);
  }
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('!')) {
      continue;
    }
    const separator = line.search(/(?<!\\)[=:]/);
    const key = decodeProperty((separator < 0 ? line : line.slice(0, separator)).trim());
    const value = decodeProperty(separator < 0 ? '' : line.slice(separator + 1).trim());
    const path = key.split('.');
    if (path.some(part => !part || FORBIDDEN_KEYS.has(part))) {
      throw new Error(`Property key "${key}" is not safe to expand.`);
    }
    let target = root;
    path.forEach((part, index) => {
      if (index === path.length - 1) {
        target[part] = value;
      }
      else {
        if (target[part] === undefined) {
          target[part] = {};
        }
        if (!isUnknownRecord(target[part])) {
          throw new Error(`Property key "${key}" conflicts with an existing scalar.`);
        }
        target = target[part] as Record<string, unknown>;
      }
    });
  }
  countNodes(root);
  return stringify(root, { lineWidth: 0 });
}

function escapeProperty(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/([:=])/g, '\\$1');
}

function yamlToProperties(source: string): string {
  const document = parseDocument(source, { prettyErrors: false });
  if (document.errors.length > 0) {
    throw new Error('The YAML is invalid.');
  }
  const value: unknown = document.toJS({ maxAliasCount: 100 });
  countNodes(value);
  if (!isUnknownRecord(value)) {
    throw new Error('The YAML root must be a mapping.');
  }
  const output: string[] = [];
  const visit = (child: unknown, path: string[], depth: number) => {
    if (depth > MAX_DEPTH) {
      throw new Error('The YAML is too deeply nested.');
    }
    if (isUnknownRecord(child)) {
      for (const [key, nested] of Object.entries(child)) {
        if (FORBIDDEN_KEYS.has(key)) {
          throw new Error(`YAML key "${key}" is not safe to flatten.`);
        }
        visit(nested, [...path, key], depth + 1);
      }
    }
    else if (Array.isArray(child)) {
      child.forEach((nested, index) => visit(nested, [...path, String(index)], depth + 1));
    }
    else {
      output.push(`${path.join('.')}=${escapeProperty(child === null ? '' : String(child))}`);
    }
  };
  visit(value, [], 0);
  return output.join('\n');
}

function decodePointerToken(value: string): string {
  if (/~(?:[^01]|$)/.test(value)) {
    throw new Error('The selected path contains an invalid JSON Pointer escape.');
  }
  return value.replace(/~1/g, '/').replace(/~0/g, '~');
}

function selectJsonPointer(root: unknown, pointer: string): unknown {
  if (pointer === '') {
    return root;
  }
  if (!pointer.startsWith('/')) {
    throw new Error('The selected path must be an empty string or an RFC 6901 JSON Pointer.');
  }
  let current = root;
  for (const rawToken of pointer.slice(1).split('/')) {
    const token = decodePointerToken(rawToken);
    if (Array.isArray(current)) {
      if (!/^(0|[1-9]\d*)$/.test(token) || Number(token) >= current.length) {
        throw new Error('The selected path does not exist.');
      }
      current = current[Number(token)];
    }
    else if (isUnknownRecord(current) && Object.prototype.hasOwnProperty.call(current, token)) {
      current = current[token];
    }
    else {
      throw new Error('The selected path does not exist.');
    }
  }
  return current;
}

function envKeySegment(value: string): string {
  const normalized = value.normalize('NFKC').toUpperCase().replace(/[^A-Z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
  if (!normalized) {
    throw new Error('A selected key cannot be represented as a portable environment name.');
  }
  return normalized;
}

function quotePosixEnv(value: string): string {
  if (value.includes('\0')) {
    throw new Error('Environment values cannot contain NUL characters.');
  }
  const apostrophe = '\'';
  const escapedApostrophe = `${apostrophe}\\${apostrophe}${apostrophe}`;
  return `${apostrophe}${value.split(apostrophe).join(escapedApostrophe)}${apostrophe}`;
}

function structuredToEnv({ source, format = 'yaml', path = '', prefix = '' }: DevopsConfigTask): string {
  let root: unknown;
  if (format === 'json') {
    root = JSON.parse(source);
  }
  else if (format === 'toml') {
    root = parseToml(source);
  }
  else {
    const document = parseDocument(source, { prettyErrors: false });
    if (document.errors.length > 0) {
      throw new Error('The YAML is invalid.');
    }
    root = document.toJS({ maxAliasCount: 100 });
  }
  countNodes(root);
  const selected = selectJsonPointer(root, path);
  const normalizedPrefix = prefix.trim().toUpperCase();
  if (normalizedPrefix && !/^[A-Z_][A-Z0-9_]*$/.test(normalizedPrefix)) {
    throw new Error('The prefix must match [A-Z_][A-Z0-9_]*.');
  }

  const values = new Map<string, string>();
  const visit = (value: unknown, segments: string[], depth: number) => {
    if (depth > MAX_DEPTH) {
      throw new Error('The selected value is too deeply nested.');
    }
    if (Array.isArray(value)) {
      value.forEach((child, index) => visit(child, [...segments, String(index)], depth + 1));
      return;
    }
    if (isUnknownRecord(value)) {
      for (const [key, child] of Object.entries(value)) {
        if (FORBIDDEN_KEYS.has(key)) {
          throw new Error('The selected object contains a forbidden key.');
        }
        visit(child, [...segments, envKeySegment(key)], depth + 1);
      }
      return;
    }
    if (typeof value === 'number' && !Number.isFinite(value)) {
      throw new TypeError('Non-finite numbers cannot be exported.');
    }
    const parts = [...(normalizedPrefix ? [normalizedPrefix] : []), ...segments];
    if (parts.length === 0) {
      throw new Error('Select an object/array or provide a prefix for a scalar value.');
    }
    const key = parts.join('_');
    if (values.has(key)) {
      throw new Error(`Multiple source paths normalize to ${key}. Choose a narrower path or rename the source keys.`);
    }
    const text = value === null ? '' : typeof value === 'string' ? value : String(value);
    values.set(key, quotePosixEnv(text));
  };
  visit(selected, [], 0);
  if (values.size === 0) {
    throw new Error('The selected path contains no scalar values.');
  }
  return [...values.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([key, value]) => `${key}=${value}`).join('\n');
}

export function processDevopsConfig({ mode, source, format, path, prefix }: DevopsConfigTask): string {
  if (source.trim() === '') {
    throw new Error('Enter configuration content to process.');
  }
  switch (mode) {
    case 'dockerfile-lint': return lintDockerfile(source);
    case 'compose-normalize': return normalizeCompose(source);
    case 'nginx-format': return formatNginx(source);
    case 'properties-to-yaml': return propertiesToYaml(source);
    case 'yaml-to-properties': return yamlToProperties(source);
    case 'structured-to-env': return structuredToEnv({ mode, source, format, path, prefix });
  }
}
