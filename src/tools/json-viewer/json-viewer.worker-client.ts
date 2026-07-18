import {
  JSON_TASK_TIMEOUT_MS,
  type JsonFormatTask,
  JsonTaskError,
  type JsonWorkerRequest,
  parseJsonTask,
  parseJsonWorkerMessage,
  toJsonTaskError,
} from './json-viewer.worker.protocol';

export interface JsonWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null
  onerror: ((event: ErrorEvent) => void) | null
  postMessage: (message: JsonWorkerRequest) => void
  terminate: () => void
}

export type JsonWorkerFactory = () => JsonWorkerHandle;

export interface JsonTaskResult {
  value: string
  elapsedMs: number
}

interface ActiveTask {
  cancel: (code: 'cancelled' | 'timeout', message: string) => void
}

function createWorker(): JsonWorkerHandle {
  return new Worker(new URL('./json-viewer.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-json-format',
  });
}

export class JsonWorkerClient {
  private activeTask: ActiveTask | undefined;
  private nextJobId = 0;

  constructor(
    private readonly workerFactory: JsonWorkerFactory = createWorker,
    private readonly timeoutMs = JSON_TASK_TIMEOUT_MS,
  ) {}

  run(task: JsonFormatTask): Promise<JsonTaskResult> {
    this.cancel('A newer JSON formatting operation replaced this one.');

    let validatedTask: JsonFormatTask;
    try {
      validatedTask = parseJsonTask(task);
    }
    catch (error) {
      return Promise.reject(toJsonTaskError(error, 'validation'));
    }

    let worker: JsonWorkerHandle;
    try {
      worker = this.workerFactory();
    }
    catch {
      return Promise.reject(new JsonTaskError('unavailable', 'JSON formatting workers are not available in this browser.'));
    }

    this.nextJobId = this.nextJobId === Number.MAX_SAFE_INTEGER ? 1 : this.nextJobId + 1;
    const jobId = this.nextJobId;
    const startedAt = performance.now();

    return new Promise((resolve, reject) => {
      let activeTask: ActiveTask;
      let settled = false;
      const elapsed = () => Math.max(0, performance.now() - startedAt);
      const timeout = globalThis.setTimeout(() => {
        activeTask.cancel(
          'timeout',
          `JSON formatting exceeded the ${this.timeoutMs / 1000}-second time limit.`,
        );
      }, this.timeoutMs);

      const cleanup = () => {
        globalThis.clearTimeout(timeout);
        worker.onmessage = null;
        worker.onerror = null;
        try {
          worker.terminate();
        }
        catch {
          // A second termination failure must not prevent task settlement.
        }

        if (this.activeTask === activeTask) {
          this.activeTask = undefined;
        }
      };
      const fail = (error: JsonTaskError) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        reject(error);
      };
      const succeed = (value: string) => {
        if (settled) {
          return;
        }

        settled = true;
        const elapsedMs = elapsed();
        cleanup();
        resolve({ value, elapsedMs });
      };

      activeTask = {
        cancel: (code, message) => fail(new JsonTaskError(code, message, elapsed())),
      };
      this.activeTask = activeTask;

      worker.onmessage = (event) => {
        let message;
        try {
          message = parseJsonWorkerMessage(event.data);
        }
        catch (error) {
          fail(toJsonTaskError(error, 'worker'));
          return;
        }

        if (message.jobId !== jobId) {
          return;
        }

        if (message.type === 'error') {
          fail(new JsonTaskError(message.code, message.message, elapsed()));
          return;
        }

        if (message.operation !== validatedTask.operation || message.mode !== validatedTask.mode) {
          fail(new JsonTaskError('worker', 'The JSON worker returned a result for the wrong operation.', elapsed()));
          return;
        }

        succeed(message.value);
      };
      worker.onerror = (event) => {
        event.preventDefault();
        fail(new JsonTaskError('worker', 'The JSON worker stopped unexpectedly.', elapsed()));
      };

      try {
        worker.postMessage({ jobId, task: validatedTask });
      }
      catch {
        fail(new JsonTaskError('worker', 'JSON formatting could not be started.', elapsed()));
      }
    });
  }

  cancel(message = 'JSON formatting cancelled.'): void {
    this.activeTask?.cancel('cancelled', message);
  }

  dispose(): void {
    this.cancel('JSON formatting cancelled because the tool was closed.');
  }
}
