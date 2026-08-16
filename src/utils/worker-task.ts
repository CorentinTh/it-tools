import { type WorkerTaskRequest, nextWorkerJobId } from './worker-protocol';

export type WorkerTransportErrorCode = 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export interface WorkerTaskHandle<TRequest> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null
  onmessageerror?: ((event: MessageEvent<unknown>) => void) | null
  onerror: ((event: ErrorEvent) => void) | null
  postMessage: (request: TRequest) => void
  terminate: () => void
}

export interface WorkerTaskResult<TValue> {
  value: TValue
  elapsedMs: number
}

export type WorkerTaskEvent<TDecodedResult, TWireErrorCode extends string, TProgress = never> =
  | { jobId: number; type: 'result'; result: TDecodedResult }
  | { jobId: number; type: 'error'; code: TWireErrorCode; message: string }
  | { jobId: number; type: 'progress'; progress: TProgress };

export interface WorkerTaskRunOptions<TProgress> {
  onProgress?: (progress: TProgress) => void
}

export interface WorkerTaskMessages<TTask> {
  replacement: string
  unavailable: string
  timeout: (task: TTask, timeoutMs: number) => string
  crash: string
  postMessageFailure: string
  progressHandlerFailure?: string
}

export interface TerminateAndReplaceWorkerTaskOptions<
  TTask,
  TDecodedResult,
  TValue,
  TWireErrorCode extends string,
  TError extends Error,
  TProgress = never,
> {
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<TTask>>
  timeoutMs: number
  messages: WorkerTaskMessages<TTask>
  decodeMessage: (value: unknown) => WorkerTaskEvent<TDecodedResult, TWireErrorCode, TProgress>
  resolveResult: (result: TDecodedResult, expectedTask: TTask) => TValue
  createError: (
    code: WorkerTransportErrorCode | TWireErrorCode,
    message: string,
    elapsedMs: number,
  ) => TError
  protocolError: (error: unknown, elapsedMs: number) => TError
}

interface ActiveTask {
  cancel: (code: 'cancelled' | 'timeout', message: string) => void
}

export const MAX_WORKER_TASK_TIMEOUT_MS = 2_147_483_647;

export function assertWorkerTaskTimeout(timeoutMs: number): void {
  if (
    !Number.isSafeInteger(timeoutMs)
    || timeoutMs < 1
    || timeoutMs > MAX_WORKER_TASK_TIMEOUT_MS
  ) {
    throw new RangeError(`Worker task timeout must be a whole number between 1 and ${MAX_WORKER_TASK_TIMEOUT_MS}.`);
  }
}

export class TerminateAndReplaceWorkerTask<
  TTask,
  TDecodedResult,
  TValue,
  TWireErrorCode extends string,
  TError extends Error,
  TProgress = never,
> {
  private activeTask: ActiveTask | undefined;
  private nextJobId = 0;

  constructor(
    private readonly options: TerminateAndReplaceWorkerTaskOptions<
      TTask,
      TDecodedResult,
      TValue,
      TWireErrorCode,
      TError,
      TProgress
    >,
  ) {
    assertWorkerTaskTimeout(options.timeoutMs);
  }

  run(
    task: TTask,
    { onProgress }: WorkerTaskRunOptions<TProgress> = {},
  ): Promise<WorkerTaskResult<TValue>> {
    this.cancel(this.options.messages.replacement);

    let worker: WorkerTaskHandle<WorkerTaskRequest<TTask>>;
    try {
      worker = this.options.workerFactory();
    }
    catch {
      return Promise.reject(this.options.createError(
        'unavailable',
        this.options.messages.unavailable,
        0,
      ));
    }

    this.nextJobId = nextWorkerJobId(this.nextJobId);
    const jobId = this.nextJobId;
    const startedAt = globalThis.performance.now();

    return new Promise((resolve, reject) => {
      let activeTask: ActiveTask;
      let settled = false;
      const elapsed = () => Math.max(0, globalThis.performance.now() - startedAt);
      const timeout = globalThis.setTimeout(() => {
        activeTask.cancel(
          'timeout',
          this.options.messages.timeout(task, this.options.timeoutMs),
        );
      }, this.options.timeoutMs);

      const cleanup = () => {
        globalThis.clearTimeout(timeout);
        worker.onmessage = null;
        worker.onmessageerror = null;
        worker.onerror = null;
        try {
          worker.terminate();
        }
        catch {
          // Settlement must not depend on a second successful termination.
        }

        if (this.activeTask === activeTask) {
          this.activeTask = undefined;
        }
      };
      const fail = (error: TError) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        reject(error);
      };
      const succeed = (value: TValue) => {
        if (settled) {
          return;
        }

        settled = true;
        const elapsedMs = elapsed();
        cleanup();
        resolve({ value, elapsedMs });
      };

      activeTask = {
        cancel: (code, message) => fail(this.options.createError(code, message, elapsed())),
      };
      this.activeTask = activeTask;

      worker.onmessage = (event) => {
        let message: WorkerTaskEvent<TDecodedResult, TWireErrorCode, TProgress>;
        try {
          message = this.options.decodeMessage(event.data);
        }
        catch (error) {
          fail(this.options.protocolError(error, elapsed()));
          return;
        }

        if (message.jobId !== jobId) {
          return;
        }

        if (message.type === 'progress') {
          try {
            onProgress?.(message.progress);
          }
          catch {
            fail(this.options.createError(
              'worker',
              this.options.messages.progressHandlerFailure ?? 'Worker task progress handling failed.',
              elapsed(),
            ));
          }
          return;
        }

        if (message.type === 'error') {
          fail(this.options.createError(message.code, message.message, elapsed()));
          return;
        }

        let result: TValue;
        try {
          result = this.options.resolveResult(message.result, task);
        }
        catch (error) {
          fail(this.options.protocolError(error, elapsed()));
          return;
        }

        succeed(result);
      };
      worker.onerror = (event) => {
        event.preventDefault();
        fail(this.options.createError('worker', this.options.messages.crash, elapsed()));
      };
      worker.onmessageerror = (event) => {
        event.preventDefault();
        fail(this.options.createError('worker', this.options.messages.crash, elapsed()));
      };

      try {
        worker.postMessage({ jobId, task });
      }
      catch {
        fail(this.options.createError(
          'worker',
          this.options.messages.postMessageFailure,
          elapsed(),
        ));
      }
    });
  }

  cancel(message: string): void {
    this.activeTask?.cancel('cancelled', message);
  }
}
