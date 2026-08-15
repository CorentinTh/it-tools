import { evaluate } from 'mathjs/number';
import {
  MATH_ERROR_MESSAGES,
  MATH_MAX_OUTPUT_BYTES,
  parseMathEvaluationTask,
} from './math-evaluator.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface MathWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleMathWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseMathEvaluationTask);
    const result = createBoundedTextResult(String(evaluate(task.expression) ?? ''), MATH_MAX_OUTPUT_BYTES);
    return result === undefined
      ? { jobId, type: 'error', code: 'output-limit', message: MATH_ERROR_MESSAGES['output-limit'] }
      : { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: MATH_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as MathWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleMathWorkerRequest(event.data)));
