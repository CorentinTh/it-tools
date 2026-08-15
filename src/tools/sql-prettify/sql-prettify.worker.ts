import { format } from 'sql-formatter';
import {
  SQL_ERROR_MESSAGES,
  SQL_MAX_OUTPUT_BYTES,
  parseSqlFormatTask,
} from './sql-prettify.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface SqlWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleSqlWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseSqlFormatTask);
    const result = createBoundedTextResult(format(task.source, task.options), SQL_MAX_OUTPUT_BYTES);
    return result === undefined
      ? { jobId, type: 'error', code: 'output-limit', message: SQL_ERROR_MESSAGES['output-limit'] }
      : { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: SQL_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as SqlWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleSqlWorkerRequest(event.data)));
