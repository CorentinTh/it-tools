import {
  MATH_ERROR_MESSAGES,
  MATH_MAX_OUTPUT_BYTES,
  MATH_TASK_TIMEOUT_MS,
  type MathEvaluationTask,
  parseMathEvaluationTask,
} from './math-evaluator.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';

export function createMathWorkerClient(): BoundedTextWorkerClient<MathEvaluationTask> {
  return new BoundedTextWorkerClient({
    errorMessages: MATH_ERROR_MESSAGES,
    maxOutputBytes: MATH_MAX_OUTPUT_BYTES,
    taskName: 'math evaluation',
    timeoutMs: MATH_TASK_TIMEOUT_MS,
    validateTask: parseMathEvaluationTask,
    workerFactory: () => new Worker(new URL('./math-evaluator.worker.ts', import.meta.url), {
      type: 'module',
      name: 'it-tools-math-evaluator',
    }),
  });
}
