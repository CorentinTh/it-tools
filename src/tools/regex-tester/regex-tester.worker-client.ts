import {
  REGEX_TASK_TIMEOUT_MS,
  type RegexMatchTask,
  type RegexSampleTask,
  type RegexTask,
  RegexTaskError,
  type RegexWorkerRequest,
  parseRegexTask,
  parseRegexWorkerMessage,
  toRegexTaskError,
} from './regex-tester.worker.protocol';
import type { RegexMatchExecutionResult } from './regex-tester.service';

export interface RegexWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null
  onerror: ((event: ErrorEvent) => void) | null
  postMessage: (message: RegexWorkerRequest) => void
  terminate: () => void
}

export type RegexWorkerFactory = () => RegexWorkerHandle;

export interface RegexTaskResult<T> {
  value: T
  elapsedMs: number
}

interface ActiveTask {
  cancel: (code: 'cancelled' | 'timeout', message: string) => void
}

function createWorker(): RegexWorkerHandle {
  return new Worker(new URL('./regex-tester.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-regex-task',
  });
}

export class RegexWorkerClient {
  private activeTask: ActiveTask | undefined;
  private nextJobId = 0;

  constructor(
    private readonly workerFactory: RegexWorkerFactory = createWorker,
    private readonly timeoutMs = REGEX_TASK_TIMEOUT_MS,
  ) {}

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

    let worker: RegexWorkerHandle;
    try {
      worker = this.workerFactory();
    }
    catch {
      return Promise.reject(new RegexTaskError('unavailable', 'Regular expression workers are not available in this browser.'));
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
          `Regular expression ${validatedTask.operation} exceeded the ${this.timeoutMs / 1000}-second time limit.`,
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
          // Settlement must not depend on a second successful termination.
        }

        if (this.activeTask === activeTask) {
          this.activeTask = undefined;
        }
      };
      const fail = (error: RegexTaskError) => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        reject(error);
      };
      const succeed = (value: RegexMatchExecutionResult | string) => {
        if (settled) {
          return;
        }

        settled = true;
        const elapsedMs = elapsed();
        cleanup();
        resolve({ value, elapsedMs });
      };

      activeTask = {
        cancel: (code, message) => fail(new RegexTaskError(code, message, elapsed())),
      };
      this.activeTask = activeTask;

      worker.onmessage = (event) => {
        let message;
        try {
          message = parseRegexWorkerMessage(event.data);
        }
        catch (error) {
          fail(toRegexTaskError(error, 'worker'));
          return;
        }

        if (message.jobId !== jobId) {
          return;
        }

        if (message.type === 'error') {
          fail(new RegexTaskError(message.code, message.message, elapsed()));
          return;
        }

        if (message.operation !== validatedTask.operation) {
          fail(new RegexTaskError('worker', 'The regular expression worker returned a result for the wrong operation.', elapsed()));
          return;
        }

        succeed(message.value);
      };
      worker.onerror = (event) => {
        event.preventDefault();
        fail(new RegexTaskError('worker', 'The regular expression worker stopped unexpectedly.', elapsed()));
      };

      try {
        worker.postMessage({ jobId, task: validatedTask });
      }
      catch {
        fail(new RegexTaskError('worker', 'The regular expression operation could not be started.', elapsed()));
      }
    });
  }

  cancel(message = 'Regular expression operation cancelled.'): void {
    this.activeTask?.cancel('cancelled', message);
  }

  dispose(): void {
    this.cancel('Regular expression operation cancelled because the tool was closed.');
  }
}
