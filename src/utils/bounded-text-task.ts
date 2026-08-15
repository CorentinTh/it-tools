import type { WorkerTaskRequest } from './worker-protocol';
import { isUnknownRecord, isWorkerJobId } from './worker-protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskHandle,
  type WorkerTaskResult,
} from './worker-task';
import { hasPlausibleUtf8ByteLength } from './utf8';

export type BoundedTextWorkerErrorCode = 'validation' | 'input-limit' | 'output-limit' | 'processing';
export type BoundedTextTaskErrorCode =
  | BoundedTextWorkerErrorCode
  | 'worker'
  | 'timeout'
  | 'cancelled'
  | 'unavailable';

export interface BoundedTextResult {
  byteLength: number
  value: string
}

export type BoundedTextWorkerMessage =
  | { jobId: number; type: 'result'; result: BoundedTextResult }
  | { jobId: number; type: 'error'; code: BoundedTextWorkerErrorCode; message: string };

export type BoundedTextErrorMessages = Record<BoundedTextWorkerErrorCode, string>;

export class BoundedTextTaskError extends Error {
  override readonly name = 'BoundedTextTaskError';

  constructor(
    public readonly code: BoundedTextTaskErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

export function parseBoundedTextWorkerJobId(value: unknown): number {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new BoundedTextTaskError('worker', 'The text worker returned an invalid job identifier.');
  }
  return value.jobId;
}

export function parseBoundedTextWorkerRequest<TTask>(
  value: unknown,
  parseTask: (task: unknown) => TTask,
): WorkerTaskRequest<TTask> {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['jobId', 'task'])) {
    throw new BoundedTextTaskError('validation', 'The text worker received an invalid request.');
  }
  return { jobId: parseBoundedTextWorkerJobId(value), task: parseTask(value.task) };
}

export function parseBoundedTextWorkerMessage(
  value: unknown,
  maxOutputBytes: number,
  errorMessages: BoundedTextErrorMessages,
): BoundedTextWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new BoundedTextTaskError('worker', 'The text worker returned an invalid message.');
  }

  if (
    value.type === 'result'
    && hasExactKeys(value, ['jobId', 'result', 'type'])
    && isUnknownRecord(value.result)
    && hasExactKeys(value.result, ['byteLength', 'value'])
    && typeof value.result.value === 'string'
    && hasPlausibleUtf8ByteLength(value.result.value, value.result.byteLength, maxOutputBytes)
  ) {
    return {
      jobId: value.jobId,
      type: 'result',
      result: { byteLength: value.result.byteLength, value: value.result.value },
    };
  }

  if (
    value.type === 'error'
    && hasExactKeys(value, ['code', 'jobId', 'message', 'type'])
    && (value.code === 'validation'
      || value.code === 'input-limit'
      || value.code === 'output-limit'
      || value.code === 'processing')
    && value.message === errorMessages[value.code]
  ) {
    return { jobId: value.jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new BoundedTextTaskError('worker', 'The text worker returned an invalid message.');
}

export function createBoundedTextResult(value: string, maxOutputBytes: number): BoundedTextResult | undefined {
  const byteLength = new TextEncoder().encode(value).byteLength;
  return byteLength <= maxOutputBytes ? { byteLength, value } : undefined;
}

export interface BoundedTextWorkerClientOptions<TTask> {
  errorMessages: BoundedTextErrorMessages
  maxOutputBytes: number
  taskName: string
  timeoutMs: number
  validateTask: (value: unknown) => TTask
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<TTask>>
}

export class BoundedTextWorkerClient<TTask> {
  private readonly taskRunner: TerminateAndReplaceWorkerTask<
    TTask,
    BoundedTextResult,
    string,
    BoundedTextWorkerErrorCode,
    BoundedTextTaskError
  >;

  constructor(private readonly options: BoundedTextWorkerClientOptions<TTask>) {
    const { errorMessages, maxOutputBytes, taskName } = options;
    this.taskRunner = new TerminateAndReplaceWorkerTask({
      workerFactory: options.workerFactory,
      timeoutMs: options.timeoutMs,
      messages: {
        replacement: `A newer ${taskName} task replaced this one.`,
        unavailable: `${taskName} workers are not available in this browser.`,
        timeout: (_task, deadlineMs) => `${taskName} exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: `The ${taskName} worker stopped unexpectedly.`,
        postMessageFailure: `${taskName} could not be started.`,
      },
      decodeMessage: value => parseBoundedTextWorkerMessage(value, maxOutputBytes, errorMessages),
      resolveResult: result => result.value,
      createError: (code, message, elapsedMs) => new BoundedTextTaskError(code, message, elapsedMs),
      protocolError: (_error, elapsedMs) => new BoundedTextTaskError(
        'worker',
        `The ${taskName} worker returned an invalid message.`,
        elapsedMs,
      ),
    });
  }

  run(task: TTask): Promise<WorkerTaskResult<string>> {
    this.cancel();
    try {
      return this.taskRunner.run(this.options.validateTask(task));
    }
    catch (error) {
      return Promise.reject(error instanceof BoundedTextTaskError
        ? error
        : new BoundedTextTaskError('validation', this.options.errorMessages.validation));
    }
  }

  cancel(message = `The ${this.options.taskName} task was cancelled.`): void {
    this.taskRunner.cancel(message);
  }

  dispose(): void {
    this.cancel(`The ${this.options.taskName} task was cancelled because the tool was closed.`);
  }
}
