import { parseArgon2idPhc, sameArgon2idParameters } from './argon2id.service';
import {
  ARGON2ID_TIMEOUT_MS,
  type Argon2idResult,
  type Argon2idTask,
  Argon2idTaskError,
  type Argon2idWorkerErrorCode,
  parseArgon2idMessage,
  parseArgon2idTask,
} from './argon2id.worker.protocol';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import { TerminateAndReplaceWorkerTask, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';

type Handle = WorkerTaskHandle<WorkerTaskRequest<Argon2idTask>>;

function createWorker(): Handle {
  return new Worker(new URL('./argon2id.worker.ts', import.meta.url), { type: 'module', name: 'it-tools-argon2id' });
}

export class Argon2idWorkerClient {
  private disposed = false;
  private readonly runner: TerminateAndReplaceWorkerTask<Argon2idTask, Argon2idResult, Argon2idResult, Argon2idWorkerErrorCode, Argon2idTaskError>;

  constructor(workerFactory: () => Handle = createWorker) {
    this.runner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs: ARGON2ID_TIMEOUT_MS,
      messages: {
        replacement: 'A newer Argon2id operation replaced this one.',
        unavailable: 'Argon2id workers are not available in this browser.',
        timeout: () => 'Argon2id processing exceeded the 20-second limit.',
        crash: 'The Argon2id worker stopped unexpectedly.',
        postMessageFailure: 'The Argon2id operation could not be started.',
      },
      decodeMessage: parseArgon2idMessage,
      resolveResult: (result, task) => {
        const expected = task.operation === 'hash' ? task : parseArgon2idPhc(task.phc);
        if (result.operation !== task.operation || !sameArgon2idParameters(result, expected)) {
          throw new Argon2idTaskError('worker', 'The Argon2id worker returned a result for the wrong operation.');
        }
        return result;
      },
      createError: (code, message, elapsedMs) => new Argon2idTaskError(code, message, elapsedMs),
      protocolError: (_error, elapsedMs) => new Argon2idTaskError('worker', 'The Argon2id worker returned an invalid message.', elapsedMs),
    });
  }

  run(task: Argon2idTask): Promise<WorkerTaskResult<Argon2idResult>> {
    if (this.disposed) {
      return Promise.reject(new Argon2idTaskError('unavailable', 'The Argon2id tool has already been closed.'));
    }
    try {
      return this.runner.run(parseArgon2idTask(task));
    }
    catch (error) {
      return Promise.reject(error);
    }
  }

  cancel(message = 'The Argon2id operation was cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.cancel('The Argon2id operation was cancelled because the tool was closed.');
    }
  }
}
