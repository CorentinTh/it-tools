/// <reference lib="webworker" />

import { calculateNextCronRuns, formatCronRuns } from './cron-next-runs.service';
import {
  CRON_ERROR_MESSAGES,
  CRON_MAX_OUTPUT_BYTES,
  parseCronTask,
} from './cron-next-runs.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface CronWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleCronWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseCronTask);
    const output = formatCronRuns(calculateNextCronRuns(task), task.timeZone);
    const result = createBoundedTextResult(output, CRON_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: CRON_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError
      && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: CRON_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as CronWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleCronWorkerRequest(event.data)));
