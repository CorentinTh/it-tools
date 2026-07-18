import {
  BCRYPT_TASK_TIMEOUT_MS,
  type BcryptCompareTask,
  type BcryptHashTask,
  type BcryptTask,
  BcryptTaskError,
  type BcryptWorkerRequest,
  parseBcryptTask,
  parseBcryptWorkerMessage,
  toBcryptTaskError,
} from './bcrypt.worker.protocol';

export interface BcryptWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null
  onerror: ((event: ErrorEvent) => void) | null
  postMessage: (message: BcryptWorkerRequest) => void
  terminate: () => void
}

export type BcryptWorkerFactory = () => BcryptWorkerHandle;

export interface BcryptTaskResult<T extends string | boolean> {
  value: T
  elapsedMs: number
}

interface ActiveTask {
  cancel: (code: 'cancelled' | 'timeout', message: string) => void
}

function createWorker(): BcryptWorkerHandle {
  return new Worker(new URL('./bcrypt.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-bcrypt',
  });
}

export class BcryptWorkerClient {
  private activeTask: ActiveTask | undefined;
  private nextJobId = 0;

  constructor(
    private readonly workerFactory: BcryptWorkerFactory = createWorker,
    private readonly timeoutMs = BCRYPT_TASK_TIMEOUT_MS,
  ) {}

  run(task: BcryptHashTask, onProgress?: (progress: number) => void): Promise<BcryptTaskResult<string>>;
  run(task: BcryptCompareTask, onProgress?: (progress: number) => void): Promise<BcryptTaskResult<boolean>>;
  run(task: BcryptTask, onProgress?: (progress: number) => void): Promise<BcryptTaskResult<string | boolean>>;
  run(task: BcryptTask, onProgress?: (progress: number) => void): Promise<BcryptTaskResult<string | boolean>> {
    let validatedTask: BcryptTask;
    try {
      validatedTask = parseBcryptTask(task);
    }
    catch (error) {
      return Promise.reject(toBcryptTaskError(error, 'validation'));
    }

    this.cancel('A newer bcrypt operation replaced this one.');

    let worker: BcryptWorkerHandle;
    try {
      worker = this.workerFactory();
    }
    catch {
      return Promise.reject(new BcryptTaskError('unavailable', 'Bcrypt workers are not available in this browser.'));
    }

    this.nextJobId = this.nextJobId === Number.MAX_SAFE_INTEGER ? 1 : this.nextJobId + 1;
    const jobId = this.nextJobId;
    const startedAt = performance.now();

    return new Promise((resolve, reject) => {
      let activeTask: ActiveTask;
      let settled = false;
      const timeout = window.setTimeout(() => {
        activeTask.cancel('timeout', `Bcrypt exceeded the ${this.timeoutMs / 1000}-second time limit.`);
      }, this.timeoutMs);

      const elapsed = () => Math.max(0, performance.now() - startedAt);
      const cleanup = () => {
        window.clearTimeout(timeout);
        worker.onmessage = null;
        worker.onerror = null;
        try {
          worker.terminate();
        }
        catch {
          // The worker is already unavailable; task settlement must still complete.
        }
        if (this.activeTask === activeTask) {
          this.activeTask = undefined;
        }
      };
      const fail = (error: BcryptTaskError) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        reject(error);
      };
      const succeed = (value: string | boolean) => {
        if (settled) {
          return;
        }

        settled = true;
        const elapsedMs = elapsed();
        cleanup();
        resolve({ value, elapsedMs });
      };
      activeTask = {
        cancel: (code, message) => fail(new BcryptTaskError(code, message, elapsed())),
      };

      this.activeTask = activeTask;
      worker.onmessage = (event) => {
        let message;
        try {
          message = parseBcryptWorkerMessage(event.data);
        }
        catch (error) {
          fail(toBcryptTaskError(error, 'worker'));
          return;
        }

        if (message.jobId !== jobId) {
          return;
        }

        if (message.type === 'progress') {
          onProgress?.(message.progress);
          return;
        }

        if (message.type === 'error') {
          fail(new BcryptTaskError(message.code, message.message, elapsed()));
          return;
        }

        if (message.operation !== validatedTask.operation) {
          fail(new BcryptTaskError('worker', 'The bcrypt worker returned a result for the wrong operation.', elapsed()));
          return;
        }

        succeed(message.value);
      };
      worker.onerror = (event) => {
        event.preventDefault();
        fail(new BcryptTaskError('worker', 'The bcrypt worker stopped unexpectedly.', elapsed()));
      };

      try {
        worker.postMessage({ jobId, task: validatedTask });
      }
      catch {
        fail(new BcryptTaskError('worker', 'The bcrypt operation could not be started.', elapsed()));
      }
    });
  }

  cancel(message = 'Bcrypt operation cancelled.'): void {
    this.activeTask?.cancel('cancelled', message);
  }

  dispose(): void {
    this.cancel('Bcrypt operation cancelled because the tool was closed.');
  }
}
