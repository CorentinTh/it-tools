import {
  ED25519_TASK_TIMEOUT_MS,
  type Ed25519GenerateTask,
  type Ed25519KeyPair,
  Ed25519TaskError,
  type Ed25519WorkerErrorCode,
  type Ed25519WorkerMessage,
  type Ed25519WorkerRequest,
  parseEd25519Task,
  parseEd25519WorkerMessage,
  toEd25519TaskError,
} from './ed25519-key-workspace.worker.protocol';
import { TerminateAndReplaceWorkerTask, type WorkerTaskEvent, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';

export type Ed25519WorkerHandle = WorkerTaskHandle<Ed25519WorkerRequest>;
export type Ed25519TaskResult = WorkerTaskResult<Ed25519KeyPair>;

function createWorker(): Ed25519WorkerHandle {
  return new Worker(new URL('./ed25519-key-workspace.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-ed25519-key-workspace',
  });
}

function decodeWorkerMessage(value: unknown): WorkerTaskEvent<Ed25519KeyPair, Ed25519WorkerErrorCode> {
  const message: Ed25519WorkerMessage = parseEd25519WorkerMessage(value);
  return message.type === 'result' ? { jobId: message.jobId, type: 'result', result: message.result } : message;
}

export class Ed25519WorkerClient {
  private readonly runner: TerminateAndReplaceWorkerTask<Ed25519GenerateTask, Ed25519KeyPair, Ed25519KeyPair, Ed25519WorkerErrorCode, Ed25519TaskError>;
  private disposed = false;

  constructor(workerFactory: () => Ed25519WorkerHandle = createWorker, timeoutMs = ED25519_TASK_TIMEOUT_MS) {
    this.runner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: 'A newer Ed25519 generation replaced this one.',
        unavailable: 'Ed25519 workers are not available in this browser.',
        timeout: () => 'Ed25519 generation exceeded the 30-second time limit.',
        crash: 'The Ed25519 worker stopped unexpectedly.',
        postMessageFailure: 'Ed25519 generation could not be started.',
      },
      decodeMessage: decodeWorkerMessage,
      resolveResult: result => result,
      createError: (code, message, elapsedMs) => new Ed25519TaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toEd25519TaskError(error, 'worker');
        return new Ed25519TaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(task: Ed25519GenerateTask): Promise<Ed25519TaskResult> {
    if (this.disposed) {
      return Promise.reject(new Ed25519TaskError('unavailable', 'The Ed25519 generator has already been closed.'));
    }
    try {
      return this.runner.run(parseEd25519Task(task));
    }
    catch (error) {
      return Promise.reject(toEd25519TaskError(error, 'validation'));
    }
  }

  cancel(message = 'Ed25519 generation cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('Ed25519 generation cancelled because the tool was closed.');
  }
}
