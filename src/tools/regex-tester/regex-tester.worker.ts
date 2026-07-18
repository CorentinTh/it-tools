import { type RegexMatchExecutionResult, matchRegexBounded } from './regex-tester.service';
import { generateRegexSample } from './regex-tester.sample.service';
import {
  type RegexTask,
  RegexTaskError,
  type RegexWorkerMessage,
  parseRegexWorkerRequest,
  toRegexTaskError,
} from './regex-tester.worker.protocol';

interface RegexWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: RegexWorkerMessage) => void
}

const workerScope = globalThis as unknown as RegexWorkerScope;

function executeTask(task: RegexTask): RegexMatchExecutionResult | string {
  if (task.operation === 'match') {
    return matchRegexBounded(task.pattern, task.text, task.flags);
  }

  return generateRegexSample(task);
}

workerScope.addEventListener('message', (event) => {
  let jobId = 1;

  try {
    const request = parseRegexWorkerRequest(event.data);
    jobId = request.jobId;
    const value = executeTask(request.task);

    if (request.task.operation === 'match' && typeof value !== 'string') {
      workerScope.postMessage({ jobId, type: 'result', operation: 'match', value });
      return;
    }

    if (request.task.operation === 'sample' && typeof value === 'string') {
      workerScope.postMessage({ jobId, type: 'result', operation: 'sample', value });
      return;
    }

    throw new RegexTaskError('operation', 'The regular expression worker produced an unexpected result.');
  }
  catch (error) {
    const taskError = toRegexTaskError(error);
    const code = taskError.code === 'validation'
      || taskError.code === 'syntax'
      || taskError.code === 'limit'
      ? taskError.code
      : 'operation';
    workerScope.postMessage({ jobId, type: 'error', code, message: taskError.message });
  }
});
