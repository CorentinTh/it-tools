import { CRON_DIALECTS, type CronNextRunsOptions } from './cron-next-runs.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const CRON_MAX_EXPRESSION_BYTES = 256;
export const CRON_MAX_OUTPUT_BYTES = 16 * 1024;
export const CRON_TASK_TIMEOUT_MS = 8_000;

export const CRON_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Check the cron expression, dialect, timezone, start instant, and result count.',
  'input-limit': `Cron expressions are limited to ${CRON_MAX_EXPRESSION_BYTES} UTF-8 bytes.`,
  'output-limit': `Cron next-run output is limited to ${CRON_MAX_OUTPUT_BYTES.toLocaleString('en-US')} UTF-8 bytes.`,
  'processing': 'Next runs could not be calculated for this cron expression.',
};

export function parseCronTask(value: unknown): CronNextRunsOptions {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'afterIso,count,dialect,expression,timeZone'
    || typeof value.expression !== 'string'
    || value.expression.trim() === ''
    || typeof value.dialect !== 'string'
    || !CRON_DIALECTS.includes(value.dialect as CronNextRunsOptions['dialect'])
    || typeof value.timeZone !== 'string'
    || value.timeZone.length < 1
    || value.timeZone.length > 100
    || typeof value.afterIso !== 'string'
    || value.afterIso.length < 1
    || value.afterIso.length > 64
    || typeof value.count !== 'number'
    || !Number.isSafeInteger(value.count)
    || value.count < 1
    || value.count > 25
  ) {
    throw new BoundedTextTaskError('validation', CRON_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.expression, CRON_MAX_EXPRESSION_BYTES)) {
    throw new BoundedTextTaskError('input-limit', CRON_ERROR_MESSAGES['input-limit']);
  }
  return {
    expression: value.expression,
    dialect: value.dialect as CronNextRunsOptions['dialect'],
    timeZone: value.timeZone,
    afterIso: value.afterIso,
    count: value.count,
  };
}
