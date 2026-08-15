import {
  RSA_TASK_TIMEOUT_MS,
  type RsaGenerateTask,
  type RsaKeyPair,
  RsaTaskError,
  type RsaWorkerErrorCode,
  type RsaWorkerMessage,
  type RsaWorkerRequest,
  parseRsaTask,
  parseRsaWorkerMessage,
  toRsaTaskError,
} from './rsa-key-pair-generator.worker.protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
  type WorkerTaskResult,
} from '@/utils/worker-task';

export type RsaWorkerHandle = WorkerTaskHandle<RsaWorkerRequest>;
export type RsaWorkerFactory = () => RsaWorkerHandle;
export type RsaTaskResult = WorkerTaskResult<RsaKeyPair>;

function createWorker(): RsaWorkerHandle {
  return new Worker(new URL('./rsa-key-pair-generator.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-rsa-key-pair',
  });
}

function decodeWorkerMessage(
  value: unknown,
): WorkerTaskEvent<RsaKeyPair, RsaWorkerErrorCode> {
  const message: RsaWorkerMessage = parseRsaWorkerMessage(value);
  return message.type === 'result'
    ? { jobId: message.jobId, type: 'result', result: message.result }
    : message;
}

function resolveWorkerResult(result: RsaKeyPair, expectedTask: RsaGenerateTask): RsaKeyPair {
  if (result.bits !== expectedTask.bits) {
    throw new RsaTaskError('worker', 'The RSA worker returned a key with the wrong size.');
  }
  return result;
}

export class RsaWorkerClient {
  private readonly taskRunner: TerminateAndReplaceWorkerTask<
    RsaGenerateTask,
    RsaKeyPair,
    RsaKeyPair,
    RsaWorkerErrorCode,
    RsaTaskError
  >;

  private disposed = false;

  constructor(
    workerFactory: RsaWorkerFactory = createWorker,
    timeoutMs = RSA_TASK_TIMEOUT_MS,
  ) {
    this.taskRunner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: 'A newer RSA key generation replaced this one.',
        unavailable: 'RSA key generation workers are not available in this browser.',
        timeout: () => 'RSA key generation exceeded the 30-second time limit.',
        crash: 'The RSA key generation worker stopped unexpectedly.',
        postMessageFailure: 'RSA key generation could not be started.',
      },
      decodeMessage: decodeWorkerMessage,
      resolveResult: resolveWorkerResult,
      createError: (code, message, elapsedMs) => new RsaTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toRsaTaskError(error, 'worker');
        return new RsaTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(task: RsaGenerateTask): Promise<RsaTaskResult> {
    if (this.disposed) {
      return Promise.reject(new RsaTaskError(
        'unavailable',
        'The RSA key generator has already been closed.',
      ));
    }

    let validatedTask: RsaGenerateTask;
    try {
      validatedTask = parseRsaTask(task);
    }
    catch (error) {
      return Promise.reject(toRsaTaskError(error, 'validation'));
    }

    return this.taskRunner.run(validatedTask);
  }

  cancel(message = 'RSA key generation cancelled.'): void {
    this.taskRunner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('RSA key generation cancelled because the tool was closed.');
  }
}
