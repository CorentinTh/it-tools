import {
  REGEX_TASK_TIMEOUT_MS,
  type RegexMatchTask,
  type RegexSampleTask,
  type RegexTask,
  RegexTaskError,
  type RegexWorkerMessage,
  type RegexWorkerRequest,
  parseRegexTask,
  parseRegexWorkerMessage,
  toRegexTaskError,
} from './regex-tester.worker.protocol';
import type { RegexMatchExecutionResult } from './regex-tester.service';
import { TerminateAndReplaceWorkerTask, type WorkerTaskEvent, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';

export type RegexWorkerHandle = WorkerTaskHandle<RegexWorkerRequest>;
export type RegexWorkerFactory = () => RegexWorkerHandle;
export type RegexTaskResult<T> = WorkerTaskResult<T>;

type RegexResultMessage = Extract<RegexWorkerMessage, { type: 'result' }>;
type RegexWireErrorCode = Extract<RegexWorkerMessage, { type: 'error' }>['code'];

function createWorker(): RegexWorkerHandle {
  return new Worker(new URL('./regex-tester.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-regex-task',
  });
}

function decodeMessage(value: unknown): WorkerTaskEvent<RegexResultMessage, RegexWireErrorCode> {
  const message = parseRegexWorkerMessage(value);
  if (message.type === 'result') {
    return { jobId: message.jobId, type: 'result', result: message };
  }
  return message;
}

export class RegexWorkerClient {
  private readonly runner: TerminateAndReplaceWorkerTask<
    RegexTask,
    RegexResultMessage,
    RegexMatchExecutionResult | string,
    RegexWireErrorCode,
    RegexTaskError
  >;

  constructor(
    workerFactory: RegexWorkerFactory = createWorker,
    timeoutMs = REGEX_TASK_TIMEOUT_MS,
  ) {
    this.runner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: 'A newer regular expression operation replaced this one.',
        unavailable: 'Regular expression workers are not available in this browser.',
        timeout: task => `Regular expression ${task.operation} exceeded the ${timeoutMs / 1000}-second time limit.`,
        crash: 'The regular expression worker stopped unexpectedly.',
        postMessageFailure: 'The regular expression operation could not be started.',
      },
      decodeMessage,
      resolveResult: (result, expectedTask) => {
        if (result.operation !== expectedTask.operation) {
          throw new RegexTaskError('worker', 'The regular expression worker returned a result for the wrong operation.');
        }
        return result.value;
      },
      createError: (code, message, elapsedMs) => new RegexTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toRegexTaskError(error, 'worker');
        return new RegexTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(task: RegexMatchTask): Promise<RegexTaskResult<RegexMatchExecutionResult>>;
  run(task: RegexSampleTask): Promise<RegexTaskResult<string>>;
  run(task: RegexTask): Promise<RegexTaskResult<RegexMatchExecutionResult | string>>;
  run(task: RegexTask): Promise<RegexTaskResult<RegexMatchExecutionResult | string>> {
    this.cancel('A newer regular expression operation replaced this one.');
    let validatedTask: RegexTask;
    try {
      validatedTask = parseRegexTask(task);
    }
    catch (error) {
      return Promise.reject(toRegexTaskError(error, 'validation'));
    }
    return this.runner.run(validatedTask);
  }

  cancel(message = 'Regular expression operation cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    this.cancel('Regular expression operation cancelled because the tool was closed.');
  }
}
