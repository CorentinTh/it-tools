import {
  AES_ENVELOPE_TIMEOUT_MS,
  type AesEnvelopeResult,
  type AesEnvelopeTask,
  AesEnvelopeTaskError,
  type AesEnvelopeWorkerErrorCode,
  parseAesEnvelopeMessage,
  parseAesEnvelopeTask,
} from './aes-gcm-envelope.worker.protocol';
import { TerminateAndReplaceWorkerTask, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';

type Handle = WorkerTaskHandle<WorkerTaskRequest<AesEnvelopeTask>>;

function createWorker(): Handle {
  return new Worker(new URL('./aes-gcm-envelope.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-aes-gcm-envelope',
  });
}

export class AesEnvelopeWorkerClient {
  private disposed = false;
  private readonly runner: TerminateAndReplaceWorkerTask<
    AesEnvelopeTask,
    AesEnvelopeResult,
    AesEnvelopeResult,
    AesEnvelopeWorkerErrorCode,
    AesEnvelopeTaskError
  >;

  constructor(workerFactory: () => Handle = createWorker) {
    this.runner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs: AES_ENVELOPE_TIMEOUT_MS,
      messages: {
        replacement: 'A newer AES-GCM task replaced this one.',
        unavailable: 'AES-GCM workers are not available in this browser.',
        timeout: () => 'AES-GCM processing exceeded the 30-second limit.',
        crash: 'The AES-GCM worker stopped unexpectedly.',
        postMessageFailure: 'The AES-GCM task could not be started.',
      },
      decodeMessage: parseAesEnvelopeMessage,
      resolveResult: (result, task) => {
        if ((task.operation === 'encrypt-file' || task.operation === 'decrypt-file') && result.inputBytes !== task.file.size) {
          throw new AesEnvelopeTaskError('worker', 'The AES-GCM worker returned a result for the wrong file.');
        }
        return result;
      },
      createError: (code, message, elapsedMs) => new AesEnvelopeTaskError(code, message, elapsedMs),
      protocolError: (_error, elapsedMs) => new AesEnvelopeTaskError('worker', 'The AES-GCM worker returned an invalid message.', elapsedMs),
    });
  }

  run(task: AesEnvelopeTask): Promise<WorkerTaskResult<AesEnvelopeResult>> {
    if (this.disposed) {
      return Promise.reject(new AesEnvelopeTaskError('unavailable', 'The AES-GCM envelope tool has already been closed.'));
    }
    try {
      return this.runner.run(parseAesEnvelopeTask(task));
    }
    catch (error) {
      return Promise.reject(error);
    }
  }

  cancel(message = 'The AES-GCM task was cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('The AES-GCM task was cancelled because the tool was closed.');
  }
}
