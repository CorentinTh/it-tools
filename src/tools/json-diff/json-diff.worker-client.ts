import type { DiffReport } from './json-diff.types';
import {
  JSON_DIFF_TASK_TIMEOUT_MS,
  type JsonDiffTask,
  JsonDiffTaskError,
  type JsonDiffWorkerErrorCode,
  type JsonDiffWorkerMessage,
  type JsonDiffWorkerRequest,
  parseJsonDiffTask,
  parseJsonDiffWorkerMessage,
  toJsonDiffTaskError,
} from './json-diff.worker.protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
  type WorkerTaskResult,
} from '@/utils/worker-task';

export type JsonDiffWorkerHandle = WorkerTaskHandle<JsonDiffWorkerRequest>;
export type JsonDiffWorkerFactory = () => JsonDiffWorkerHandle;
export type JsonDiffTaskResult = WorkerTaskResult<DiffReport>;

function createWorker(): JsonDiffWorkerHandle {
  return new Worker(new URL('./json-diff.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-json-diff',
  });
}

function decodeWorkerMessage(value: unknown): WorkerTaskEvent<DiffReport, JsonDiffWorkerErrorCode> {
  const message: JsonDiffWorkerMessage = parseJsonDiffWorkerMessage(value);
  return message.type === 'result'
    ? { jobId: message.jobId, type: 'result', result: message.result }
    : message;
}

export class JsonDiffWorkerClient {
  private readonly taskRunner: TerminateAndReplaceWorkerTask<
    JsonDiffTask,
    DiffReport,
    DiffReport,
    JsonDiffWorkerErrorCode,
    JsonDiffTaskError
  >;

  constructor(
    workerFactory: JsonDiffWorkerFactory = createWorker,
    timeoutMs = JSON_DIFF_TASK_TIMEOUT_MS,
  ) {
    this.taskRunner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: 'A newer JSON comparison replaced this one.',
        unavailable: 'JSON comparison workers are not available in this browser.',
        timeout: (_task, deadlineMs) => `JSON comparison exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: 'The JSON comparison worker stopped unexpectedly.',
        postMessageFailure: 'JSON comparison could not be started.',
      },
      decodeMessage: decodeWorkerMessage,
      resolveResult: result => result,
      createError: (code, message, elapsedMs) => new JsonDiffTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toJsonDiffTaskError(error, 'worker');
        return new JsonDiffTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(task: JsonDiffTask): Promise<JsonDiffTaskResult> {
    this.cancel('A newer JSON comparison replaced this one.');
    try {
      return this.taskRunner.run(parseJsonDiffTask(task));
    }
    catch (error) {
      return Promise.reject(toJsonDiffTaskError(error, 'validation'));
    }
  }

  cancel(message = 'JSON comparison cancelled.'): void {
    this.taskRunner.cancel(message);
  }

  dispose(): void {
    this.cancel('JSON comparison cancelled because the tool was closed.');
  }
}
