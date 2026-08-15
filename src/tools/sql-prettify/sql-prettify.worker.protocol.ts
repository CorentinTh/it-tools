import type { FormatOptionsWithLanguage } from 'sql-formatter';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const SQL_LIVE_MAX_BYTES = 64 * 1024;
export const SQL_MAX_INPUT_BYTES = 1024 * 1024;
export const SQL_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const SQL_TASK_TIMEOUT_MS = 8_000;

const LANGUAGES = ['bigquery', 'db2', 'hive', 'mariadb', 'mysql', 'n1ql', 'plsql', 'postgresql', 'redshift', 'spark', 'sql', 'sqlite', 'tsql'] as const;
const KEYWORD_CASES = ['upper', 'lower', 'preserve'] as const;
const INDENT_STYLES = ['standard', 'tabularLeft', 'tabularRight'] as const;

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === 'string' && options.includes(value as T);
}

export interface SqlFormatTask {
  options: FormatOptionsWithLanguage
  source: string
}

export const SQL_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter a SQL query and select valid formatting options.',
  'input-limit': `SQL formatting is limited to ${SQL_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `Formatted SQL is limited to ${SQL_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'processing': 'The SQL query could not be formatted.',
};

export function parseSqlFormatTask(value: unknown): SqlFormatTask {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'options,source'
    || typeof value.source !== 'string'
    || value.source.trim() === ''
    || !isUnknownRecord(value.options)
    || Object.keys(value.options).sort().join(',') !== 'indentStyle,keywordCase,language,tabulateAlias,useTabs'
    || !isOneOf(value.options.language, LANGUAGES)
    || !isOneOf(value.options.keywordCase, KEYWORD_CASES)
    || !isOneOf(value.options.indentStyle, INDENT_STYLES)
    || typeof value.options.useTabs !== 'boolean'
    || typeof value.options.tabulateAlias !== 'boolean'
  ) {
    throw new BoundedTextTaskError('validation', SQL_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, SQL_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', SQL_ERROR_MESSAGES['input-limit']);
  }
  return {
    source: value.source,
    options: {
      indentStyle: value.options.indentStyle,
      keywordCase: value.options.keywordCase,
      language: value.options.language,
      tabulateAlias: value.options.tabulateAlias,
      useTabs: value.options.useTabs,
    },
  };
}
