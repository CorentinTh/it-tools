import {
  YAML_TASK_TIMEOUT_MS,
  type YamlFormatTask,
  YamlTaskError,
  type YamlWorkerRequest,
  parseYamlTask,
  parseYamlWorkerMessage,
  toYamlTaskError,
} from './yaml-viewer.worker.protocol';

export interface YamlWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null
  onerror: ((event: ErrorEvent) => void) | null
  postMessage: (message: YamlWorkerRequest) => void
  terminate: () => void
}

export type YamlWorkerFactory = () => YamlWorkerHandle;

export interface YamlTaskResult {
  value: string
  elapsedMs: number
}

interface ActiveTask {
  cancel: (code: 'cancelled' | 'timeout', message: string) => void
}

function createWorker(): YamlWorkerHandle {
  return new Worker(new URL('./yaml-viewer.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-yaml-format',
  });
}

export class YamlWorkerClient {
  private activeTask: ActiveTask | undefined;
  private nextJobId = 0;

  constructor(
    private readonly workerFactory: YamlWorkerFactory = createWorker,
    private readonly timeoutMs = YAML_TASK_TIMEOUT_MS,
  ) {}

  run(task: YamlFormatTask): Promise<YamlTaskResult> {
    this.cancel('A newer YAML formatting operation replaced this one.');

    let validatedTask: YamlFormatTask;
    try {
      validatedTask = parseYamlTask(task);
    }
    catch (error) {
      return Promise.reject(toYamlTaskError(error, 'validation'));
    }

    let worker: YamlWorkerHandle;
    try {
      worker = this.workerFactory();
    }
    catch {
      return Promise.reject(new YamlTaskError('unavailable', 'YAML formatting workers are not available in this browser.'));
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
          `YAML formatting exceeded the ${this.timeoutMs / 1000}-second time limit.`,
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
      const fail = (error: YamlTaskError) => {
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
        cancel: (code, message) => fail(new YamlTaskError(code, message, elapsed())),
      };
      this.activeTask = activeTask;

      worker.onmessage = (event) => {
        let message;
        try {
          message = parseYamlWorkerMessage(event.data);
        }
        catch (error) {
          fail(toYamlTaskError(error, 'worker'));
          return;
        }

        if (message.jobId !== jobId) {
          return;
        }

        if (message.type === 'error') {
          fail(new YamlTaskError(message.code, message.message, elapsed()));
          return;
        }

        if (message.operation !== validatedTask.operation) {
          fail(new YamlTaskError('worker', 'The YAML worker returned a result for the wrong operation.', elapsed()));
          return;
        }

        succeed(message.value);
      };
      worker.onerror = (event) => {
        event.preventDefault();
        fail(new YamlTaskError('worker', 'The YAML worker stopped unexpectedly.', elapsed()));
      };

      try {
        worker.postMessage({ jobId, task: validatedTask });
      }
      catch {
        fail(new YamlTaskError('worker', 'YAML formatting could not be started.', elapsed()));
      }
    });
  }

  cancel(message = 'YAML formatting cancelled.'): void {
    this.activeTask?.cancel('cancelled', message);
  }

  dispose(): void {
    this.cancel('YAML formatting cancelled because the tool was closed.');
  }
}
