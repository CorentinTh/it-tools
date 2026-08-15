import { getTextStatistics } from './text-statistics.service';
import {
  TEXT_STATISTICS_ERRORS,
  type TextStatisticsWorkerMessage,
  parseTextStatisticsTask,
} from './text-statistics.worker.protocol';
import {
  BoundedTextTaskError,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface StatisticsWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: TextStatisticsWorkerMessage) => void
}

export function handleTextStatisticsWorkerRequest(value: unknown): TextStatisticsWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseTextStatisticsTask);
    return { jobId, type: 'result', result: getTextStatistics(task.source) };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: TEXT_STATISTICS_ERRORS[code] };
  }
}

const workerScope = globalThis as unknown as StatisticsWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleTextStatisticsWorkerRequest(event.data)));
