import { compare, hash } from 'bcryptjs';
import {
  type BcryptTask,
  BcryptTaskError,
  type BcryptWorkerMessage,
  parseBcryptWorkerJobId,
  parseBcryptWorkerRequest,
  sanitizeBcryptWorkerErrorMessage,
  toBcryptTaskError,
} from './bcrypt.worker.protocol';

interface BcryptWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BcryptWorkerMessage) => void
}

const workerScope = globalThis as unknown as BcryptWorkerScope;

function hashAsync(value: string, rounds: number, onProgress: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    hash(value, rounds, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    }, onProgress);
  });
}

function compareAsync(value: string, bcryptHash: string, onProgress: (progress: number) => void): Promise<boolean> {
  return new Promise((resolve, reject) => {
    compare(value, bcryptHash, (error, matches) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(matches);
    }, onProgress);
  });
}

async function executeTask(jobId: number, task: BcryptTask): Promise<void> {
  const onProgress = (progress: number) => {
    workerScope.postMessage({ jobId, type: 'progress', progress });
  };

  if (task.operation === 'hash') {
    const value = await hashAsync(task.value, task.rounds, onProgress);
    workerScope.postMessage({ jobId, type: 'result', operation: 'hash', value });
    return;
  }

  const value = await compareAsync(task.value, task.hash, onProgress);
  workerScope.postMessage({ jobId, type: 'result', operation: 'compare', value });
}

workerScope.addEventListener('message', (event) => {
  let jobId = 1;

  void (async () => {
    try {
      jobId = parseBcryptWorkerJobId(event.data);
      const request = parseBcryptWorkerRequest(event.data);
      await executeTask(jobId, request.task);
    }
    catch (error) {
      const taskError = toBcryptTaskError(error);
      const code = taskError instanceof BcryptTaskError && taskError.code === 'validation' ? 'validation' : 'operation';
      workerScope.postMessage({
        jobId,
        type: 'error',
        code,
        message: sanitizeBcryptWorkerErrorMessage(taskError.message),
      });
    }
  })();
});
