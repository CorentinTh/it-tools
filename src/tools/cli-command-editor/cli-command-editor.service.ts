export type CliDialect = 'posix' | 'powershell';
export type CliTokenKind = 'word' | 'operator';
export type CliTokenRole = 'executable' | 'option' | 'argument' | 'operator' | 'redirection-target';

export interface CliToken {
  id: number
  kind: CliTokenKind
  value: string
  raw: string
  originalValue: string
}

export interface CliDocument {
  dialect: CliDialect
  source: string
  originalTokenCount: number
  tokens: CliToken[]
}

export const CLI_COMMAND_MAX_BYTES = 64 * 1024;
export const CLI_COMMAND_MAX_TOKENS = 2_000;

const POSIX_SAFE = /^[A-Za-z0-9_@%+=:,./-]+$/;
const POWERSHELL_SAFE = /^[A-Za-z0-9_@%+=:,./\\-]+$/;
const OPERATORS = ['2>&1', '2>>', '2>', '>>', '&&', '||', '|&', '|', '>', '<', ';'] as const;
const COMMAND_BOUNDARIES = new Set(['|', '|&', '&&', '||', ';']);
const REDIRECTIONS = new Set(['2>&1', '2>>', '2>', '>>', '>', '<']);

function utf8Bytes(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function operatorAt(source: string, offset: number): string | undefined {
  return OPERATORS.find(operator => source.startsWith(operator, offset));
}

function parsePosixWord(source: string, start: number): { end: number; value: string } {
  let offset = start;
  let value = '';
  while (offset < source.length && !/\s/.test(source[offset]) && !operatorAt(source, offset)) {
    const character = source[offset];
    if (character === '\\') {
      if (offset + 1 >= source.length) {
        throw new Error('A trailing backslash does not escape a character.');
      }
      value += source[offset + 1];
      offset += 2;
      continue;
    }
    if (character === '\'') {
      const close = source.indexOf('\'', offset + 1);
      if (close < 0) {
        throw new Error('An opened POSIX single quote is not closed.');
      }
      value += source.slice(offset + 1, close);
      offset = close + 1;
      continue;
    }
    if (character === '"') {
      offset += 1;
      let closed = false;
      while (offset < source.length) {
        if (source[offset] === '"') {
          offset += 1;
          closed = true;
          break;
        }
        if (source[offset] === '\\' && offset + 1 < source.length) {
          value += source[offset + 1];
          offset += 2;
        }
        else {
          value += source[offset];
          offset += 1;
        }
      }
      if (!closed) {
        throw new Error('An opened POSIX double quote is not closed.');
      }
      continue;
    }
    value += character;
    offset += 1;
  }
  return { end: offset, value };
}

function parsePowerShellWord(source: string, start: number): { end: number; value: string } {
  let offset = start;
  let value = '';
  while (offset < source.length && !/\s/.test(source[offset]) && !operatorAt(source, offset)) {
    const character = source[offset];
    if (character === '`') {
      if (offset + 1 >= source.length) {
        throw new Error('A trailing PowerShell backtick does not escape a character.');
      }
      value += source[offset + 1];
      offset += 2;
      continue;
    }
    if (character === '\'') {
      offset += 1;
      let closed = false;
      while (offset < source.length) {
        if (source[offset] === '\'' && source[offset + 1] === '\'') {
          value += '\'';
          offset += 2;
        }
        else if (source[offset] === '\'') {
          offset += 1;
          closed = true;
          break;
        }
        else {
          value += source[offset];
          offset += 1;
        }
      }
      if (!closed) {
        throw new Error('An opened PowerShell single quote is not closed.');
      }
      continue;
    }
    if (character === '"') {
      offset += 1;
      let closed = false;
      while (offset < source.length) {
        if (source[offset] === '"') {
          offset += 1;
          closed = true;
          break;
        }
        if (source[offset] === '`' && offset + 1 < source.length) {
          value += source[offset + 1];
          offset += 2;
        }
        else {
          value += source[offset];
          offset += 1;
        }
      }
      if (!closed) {
        throw new Error('An opened PowerShell double quote is not closed.');
      }
      continue;
    }
    value += character;
    offset += 1;
  }
  return { end: offset, value };
}

export function parseCliCommand(source: string, dialect: CliDialect): CliDocument {
  if (utf8Bytes(source) > CLI_COMMAND_MAX_BYTES) {
    throw new Error(`Commands are limited to ${CLI_COMMAND_MAX_BYTES.toLocaleString('en-US')} UTF-8 bytes.`);
  }

  const tokens: CliToken[] = [];
  let offset = 0;
  while (offset < source.length) {
    if (/\s/.test(source[offset])) {
      offset += 1;
      continue;
    }
    const operator = operatorAt(source, offset);
    if (operator) {
      tokens.push({ id: tokens.length + 1, kind: 'operator', value: operator, raw: operator, originalValue: operator });
      offset += operator.length;
    }
    else {
      const start = offset;
      const parsed = dialect === 'posix' ? parsePosixWord(source, start) : parsePowerShellWord(source, start);
      if (parsed.end === start) {
        throw new Error(`The command could not be parsed near character ${start + 1}.`);
      }
      const raw = source.slice(start, parsed.end);
      tokens.push({ id: tokens.length + 1, kind: 'word', value: parsed.value, raw, originalValue: parsed.value });
      offset = parsed.end;
    }
    if (tokens.length > CLI_COMMAND_MAX_TOKENS) {
      throw new Error(`Commands are limited to ${CLI_COMMAND_MAX_TOKENS.toLocaleString('en-US')} tokens.`);
    }
  }
  if (tokens.length === 0) {
    throw new Error('Enter a command to parse.');
  }
  return { dialect, source, originalTokenCount: tokens.length, tokens };
}

export function quoteCliWord(value: string, dialect: CliDialect): string {
  if (value !== '' && (dialect === 'posix' ? POSIX_SAFE : POWERSHELL_SAFE).test(value)) {
    return value;
  }
  return dialect === 'posix'
    ? `'${value.replace(/'/g, '\'"\'"\'')}'`
    : `'${value.replace(/'/g, '\'\'')}'`;
}

export function renderCliCommand(document: CliDocument): string {
  const unchanged = document.tokens.length === document.originalTokenCount
    && document.tokens.length > 0
    && document.tokens.every((token, index) => token.id === index + 1
      && token.value === token.originalValue
      && token.raw.length > 0);
  if (unchanged) {
    return document.source;
  }
  return document.tokens.map(token => token.kind === 'operator'
    ? token.value
    : quoteCliWord(token.value, document.dialect)).join(' ');
}

export function getCliTokenRole(tokens: CliToken[], index: number): CliTokenRole {
  const token = tokens[index];
  if (token.kind === 'operator') {
    return 'operator';
  }
  const previous = tokens[index - 1];
  if (previous?.kind === 'operator' && REDIRECTIONS.has(previous.value) && previous.value !== '2>&1') {
    return 'redirection-target';
  }
  let boundaryIndex = -1;
  for (let candidateIndex = index - 1; candidateIndex >= 0; candidateIndex -= 1) {
    const candidate = tokens[candidateIndex];
    if (candidate.kind === 'operator' && COMMAND_BOUNDARIES.has(candidate.value)) {
      boundaryIndex = candidateIndex;
      break;
    }
  }
  const firstWordIndex = tokens.findIndex((candidate, candidateIndex) => candidateIndex > boundaryIndex && candidate.kind === 'word');
  if (firstWordIndex === index) {
    return 'executable';
  }
  return token.value.startsWith('-') ? 'option' : 'argument';
}

export function appendCliArgument(document: CliDocument): void {
  const nextId = Math.max(0, ...document.tokens.map(token => token.id)) + 1;
  document.tokens.push({ id: nextId, kind: 'word', value: '', raw: '', originalValue: '\0' });
}
