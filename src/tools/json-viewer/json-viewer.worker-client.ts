import {
  JSON_TASK_TIMEOUT_MS,
  type JsonFormatTask,
  JsonTaskError,
  type JsonWorkerMessage,
  type JsonWorkerRequest,
  parseJsonTask,
  parseJsonWorkerMessage,
  toJsonTaskError,
} from './json-viewer.worker.protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
} from '@/utils/worker-task';

export type JsonWorkerHandle = WorkerTaskHandle<JsonWorkerRequest>;
export type JsonWorkerFactory = () => JsonWorkerHandle;

export interface JsonTaskResult {
  value: string
  elapsedMs: number
}

type JsonWorkerErrorCode = Extract<JsonWorkerMessage, { type: 'error' }>['code'];
type JsonWorkerResult = Extract<JsonWorkerMessage, { type: 'result' }>;

const REPLACEMENT_MESSAGE = 'A newer JSON formatting operation replaced this one.';

function createWorker(): JsonWorkerHandle {
  return new Worker(new URL('./json-viewer.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-json-format',
  });
}

function decodeWorkerMessage(
  value: unknown,
): WorkerTaskEvent<JsonWorkerResult, JsonWorkerErrorCode> {
  const message = parseJsonWorkerMessage(value);

  if (message.type === 'error') {
    return message;
  }

  return { jobId: message.jobId, type: 'result', result: message };
}

function resolveWorkerResult(result: JsonWorkerResult, expectedTask: JsonFormatTask): string {
  if (result.operation !== expectedTask.operation || result.mode !== expectedTask.mode) {
    throw new JsonTaskError('worker', 'The JSON worker returned a result for the wrong operation.');
  }

  return result.value;
}

export class JsonWorkerClient {
  private readonly taskRunner: TerminateAndReplaceWorkerTask<
    JsonFormatTask,
    JsonWorkerResult,
    string,
    JsonWorkerErrorCode,
    JsonTaskError
  >;

  constructor(
    workerFactory: JsonWorkerFactory = createWorker,
    timeoutMs = JSON_TASK_TIMEOUT_MS,
  ) {
    this.taskRunner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: REPLACEMENT_MESSAGE,
        unavailable: 'JSON formatting workers are not available in this browser.',
        timeout: (_task, deadlineMs) => `JSON formatting exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: 'The JSON worker stopped unexpectedly.',
        postMessageFailure: 'JSON formatting could not be started.',
      },
      decodeMessage: decodeWorkerMessage,
      resolveResult: resolveWorkerResult,
      createError: (code, message, elapsedMs) => new JsonTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toJsonTaskError(error, 'worker');
        return new JsonTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(task: JsonFormatTask): Promise<JsonTaskResult> {
    // JSON formatting is latest-input-wins even when the replacement is
    // invalid, so cancel before validating the new task.
    this.cancel(REPLACEMENT_MESSAGE);

    let validatedTask: JsonFormatTask;
    try {
      validatedTask = parseJsonTask(task);
    }
    catch (error) {
      return Promise.reject(toJsonTaskError(error, 'validation'));
    }

    return this.taskRunner.run(validatedTask);
  }

  cancel(message = 'JSON formatting cancelled.'): void {
    this.taskRunner.cancel(message);
  }

  dispose(): void {
    this.cancel('JSON formatting cancelled because the tool was closed.');
  }
}
