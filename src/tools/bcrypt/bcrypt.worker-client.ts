import {
  BCRYPT_TASK_TIMEOUT_MS,
  type BcryptCompareTask,
  type BcryptHashTask,
  type BcryptTask,
  BcryptTaskError,
  type BcryptWorkerMessage,
  type BcryptWorkerRequest,
  parseBcryptTask,
  parseBcryptWorkerMessage,
  toBcryptTaskError,
} from './bcrypt.worker.protocol';
import { TerminateAndReplaceWorkerTask, type WorkerTaskEvent, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';

export type BcryptWorkerHandle = WorkerTaskHandle<BcryptWorkerRequest>;
export type BcryptWorkerFactory = () => BcryptWorkerHandle;
export type BcryptTaskResult<T extends string | boolean> = WorkerTaskResult<T>;

type BcryptResultMessage = Extract<BcryptWorkerMessage, { type: 'result' }>;
type BcryptWireErrorCode = Extract<BcryptWorkerMessage, { type: 'error' }>['code'];

function createWorker(): BcryptWorkerHandle {
  return new Worker(new URL('./bcrypt.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-bcrypt',
  });
}

function decodeMessage(value: unknown): WorkerTaskEvent<BcryptResultMessage, BcryptWireErrorCode, number> {
  const message = parseBcryptWorkerMessage(value);
  if (message.type === 'result') {
    return { jobId: message.jobId, type: 'result', result: message };
  }
  return message;
}

export class BcryptWorkerClient {
  private readonly runner: TerminateAndReplaceWorkerTask<
    BcryptTask,
    BcryptResultMessage,
    string | boolean,
    BcryptWireErrorCode,
    BcryptTaskError,
    number
  >;

  constructor(
    workerFactory: BcryptWorkerFactory = createWorker,
    timeoutMs = BCRYPT_TASK_TIMEOUT_MS,
  ) {
    this.runner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: 'A newer bcrypt operation replaced this one.',
        unavailable: 'Bcrypt workers are not available in this browser.',
        timeout: (_task, deadlineMs) => `Bcrypt exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: 'The bcrypt worker stopped unexpectedly.',
        postMessageFailure: 'The bcrypt operation could not be started.',
        progressHandlerFailure: 'Bcrypt progress handling failed.',
      },
      decodeMessage,
      resolveResult: (result, expectedTask) => {
        if (result.operation !== expectedTask.operation) {
          throw new BcryptTaskError('worker', 'The bcrypt worker returned a result for the wrong operation.');
        }
        return result.value;
      },
      createError: (code, message, elapsedMs) => new BcryptTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toBcryptTaskError(error, 'worker');
        return new BcryptTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

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
    return this.runner.run(validatedTask, { onProgress });
  }

  cancel(message = 'Bcrypt operation cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    this.cancel('Bcrypt operation cancelled because the tool was closed.');
  }
}
