import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const MATH_LIVE_MAX_BYTES = 2 * 1024;
export const MATH_MAX_INPUT_BYTES = 8 * 1024;
export const MATH_MAX_OUTPUT_BYTES = 64 * 1024;
export const MATH_TASK_TIMEOUT_MS = 2_000;

export interface MathEvaluationTask {
  expression: string
}

export const MATH_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter a math expression to evaluate.',
  'input-limit': `Math expressions are limited to ${MATH_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `Math results are limited to ${MATH_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'processing': 'The expression could not be evaluated.',
};

export function parseMathEvaluationTask(value: unknown): MathEvaluationTask {
  if (!isUnknownRecord(value) || Object.keys(value).length !== 1 || typeof value.expression !== 'string' || value.expression.trim() === '') {
    throw new BoundedTextTaskError('validation', MATH_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.expression, MATH_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', MATH_ERROR_MESSAGES['input-limit']);
  }
  return { expression: value.expression };
}
