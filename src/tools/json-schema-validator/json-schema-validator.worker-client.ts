import {
  JSON_SCHEMA_TASK_TIMEOUT_MS,
  JsonSchemaTaskError,
  type JsonSchemaValidationResult,
  type JsonSchemaValidationTask,
  type JsonSchemaWorkerErrorCode,
  type JsonSchemaWorkerMessage,
  type JsonSchemaWorkerRequest,
  parseJsonSchemaTask,
  parseJsonSchemaWorkerMessage,
  toJsonSchemaTaskError,
} from './json-schema-validator.worker.protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
  type WorkerTaskResult,
} from '@/utils/worker-task';

export type JsonSchemaWorkerHandle = WorkerTaskHandle<JsonSchemaWorkerRequest>;
export type JsonSchemaWorkerFactory = () => JsonSchemaWorkerHandle;
export type JsonSchemaTaskResult = WorkerTaskResult<JsonSchemaValidationResult>;

const REPLACEMENT_MESSAGE = 'A newer JSON Schema validation replaced this one.';

function createWorker(): JsonSchemaWorkerHandle {
  return new Worker(new URL('./json-schema-validator.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-json-schema-validator',
  });
}

function decodeWorkerMessage(
  value: unknown,
): WorkerTaskEvent<JsonSchemaValidationResult, JsonSchemaWorkerErrorCode> {
  const message: JsonSchemaWorkerMessage = parseJsonSchemaWorkerMessage(value);
  return message.type === 'result'
    ? { jobId: message.jobId, type: 'result', result: message.result }
    : message;
}

export class JsonSchemaWorkerClient {
  private readonly taskRunner: TerminateAndReplaceWorkerTask<
    JsonSchemaValidationTask,
    JsonSchemaValidationResult,
    JsonSchemaValidationResult,
    JsonSchemaWorkerErrorCode,
    JsonSchemaTaskError
  >;

  constructor(
    workerFactory: JsonSchemaWorkerFactory = createWorker,
    timeoutMs = JSON_SCHEMA_TASK_TIMEOUT_MS,
  ) {
    this.taskRunner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: REPLACEMENT_MESSAGE,
        unavailable: 'JSON Schema validation workers are not available in this browser.',
        timeout: (_task, deadlineMs) => `JSON Schema validation exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: 'The JSON Schema validation worker stopped unexpectedly.',
        postMessageFailure: 'JSON Schema validation could not be started.',
      },
      decodeMessage: decodeWorkerMessage,
      resolveResult: result => result,
      createError: (code, message, elapsedMs) => new JsonSchemaTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toJsonSchemaTaskError(error, 'worker');
        return new JsonSchemaTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(task: JsonSchemaValidationTask): Promise<JsonSchemaTaskResult> {
    this.cancel(REPLACEMENT_MESSAGE);

    let validatedTask: JsonSchemaValidationTask;
    try {
      validatedTask = parseJsonSchemaTask(task);
    }
    catch (error) {
      return Promise.reject(toJsonSchemaTaskError(error, 'validation'));
    }

    return this.taskRunner.run(validatedTask);
  }

  cancel(message = 'JSON Schema validation cancelled.'): void {
    this.taskRunner.cancel(message);
  }

  dispose(): void {
    this.cancel('JSON Schema validation cancelled because the tool was closed.');
  }
}
