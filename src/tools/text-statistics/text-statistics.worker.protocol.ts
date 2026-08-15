import type { TextStatistics } from './text-statistics.service';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';

export const TEXT_STATISTICS_LIVE_MAX_BYTES = 256 * 1024;
export const TEXT_STATISTICS_MAX_INPUT_BYTES = 4 * 1024 * 1024;
export const TEXT_STATISTICS_TASK_TIMEOUT_MS = 4_000;

export interface TextStatisticsTask {
  source: string
}

export interface TextStatisticsWorkerRequest {
  jobId: number
  task: TextStatisticsTask
}

export type TextStatisticsWorkerMessage =
  | { jobId: number; type: 'result'; result: TextStatistics }
  | { jobId: number; type: 'error'; code: 'validation' | 'input-limit' | 'processing'; message: string };

export const TEXT_STATISTICS_ERRORS = {
  'validation': 'Enter text to analyze.',
  'input-limit': `Text analysis is limited to ${TEXT_STATISTICS_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'processing': 'Text statistics could not be computed.',
} as const;

export function parseTextStatisticsTask(value: unknown): TextStatisticsTask {
  if (!isUnknownRecord(value) || Object.keys(value).join(',') !== 'source' || typeof value.source !== 'string' || value.source === '') {
    throw new BoundedTextTaskError('validation', TEXT_STATISTICS_ERRORS.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, TEXT_STATISTICS_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', TEXT_STATISTICS_ERRORS['input-limit']);
  }
  return { source: value.source };
}

export function parseTextStatisticsWorkerMessage(value: unknown): TextStatisticsWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new BoundedTextTaskError('worker', 'The text statistics worker returned an invalid message.');
  }
  if (value.type === 'result' && isUnknownRecord(value.result)) {
    const result = value.result;
    const valid = ['byteSize', 'characterCount', 'lineCount', 'wordCount']
      .every(key => Number.isSafeInteger(result[key]) && Number(result[key]) >= 0);
    if (valid && Object.keys(result).sort().join(',') === 'byteSize,characterCount,lineCount,wordCount') {
      return {
        jobId: value.jobId,
        type: 'result',
        result: {
          byteSize: Number(result.byteSize),
          characterCount: Number(result.characterCount),
          lineCount: Number(result.lineCount),
          wordCount: Number(result.wordCount),
        },
      };
    }
  }
  if (
    value.type === 'error'
    && (value.code === 'validation' || value.code === 'input-limit' || value.code === 'processing')
    && value.message === TEXT_STATISTICS_ERRORS[value.code]
  ) {
    return { jobId: value.jobId, type: 'error', code: value.code, message: String(value.message) };
  }
  throw new BoundedTextTaskError('worker', 'The text statistics worker returned an invalid message.');
}
