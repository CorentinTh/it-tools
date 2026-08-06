import {
  FILE_HASH_TASK_TIMEOUT_MS,
  type FileHashProgress,
  type FileHashResult,
  type FileHashTask,
  FileHashTaskError,
  type FileHashWorkerErrorCode,
  type FileHashWorkerMessage,
  type FileHashWorkerRequest,
  parseFileHashTask,
  parseFileHashWorkerMessage,
  resolveFileHashResult,
  toFileHashTaskError,
} from './file-hash.worker.protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
  type WorkerTaskResult,
} from '@/utils/worker-task';

export type FileHashWorkerHandle = WorkerTaskHandle<FileHashWorkerRequest>;
export type FileHashWorkerFactory = () => FileHashWorkerHandle;
export type FileHashTaskResult = WorkerTaskResult<FileHashResult>;

const REPLACEMENT_MESSAGE = 'A newer file hash operation replaced this one.';
const INVALID_PROGRESS_MESSAGE = 'The file hash worker returned invalid progress.';

function createWorker(): FileHashWorkerHandle {
  return new Worker(new URL('./file-hash.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-file-hash',
  });
}

function decodeWorkerMessage(
  value: unknown,
): WorkerTaskEvent<FileHashResult, FileHashWorkerErrorCode, FileHashProgress> {
  const message: FileHashWorkerMessage = parseFileHashWorkerMessage(value);
  if (message.type === 'result') {
    return { jobId: message.jobId, type: 'result', result: message.result };
  }
  return message;
}

export class FileHashWorkerClient {
  private readonly taskRunner: TerminateAndReplaceWorkerTask<
    FileHashTask,
    FileHashResult,
    FileHashResult,
    FileHashWorkerErrorCode,
    FileHashTaskError,
    FileHashProgress
  >;

  private disposed = false;

  constructor(
    workerFactory: FileHashWorkerFactory = createWorker,
    timeoutMs = FILE_HASH_TASK_TIMEOUT_MS,
  ) {
    this.taskRunner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: REPLACEMENT_MESSAGE,
        unavailable: 'File hash workers are not available in this browser.',
        timeout: () => 'File hashing exceeded the 60-minute time limit.',
        crash: 'The file hash worker stopped unexpectedly.',
        postMessageFailure: 'File hashing could not be started.',
        progressHandlerFailure: INVALID_PROGRESS_MESSAGE,
      },
      decodeMessage: decodeWorkerMessage,
      resolveResult: resolveFileHashResult,
      createError: (code, message, elapsedMs) => new FileHashTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toFileHashTaskError(error, 'worker');
        return new FileHashTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(
    task: FileHashTask,
    onProgress?: (progress: FileHashProgress) => void,
  ): Promise<FileHashTaskResult> {
    this.cancel(REPLACEMENT_MESSAGE);
    if (this.disposed) {
      return Promise.reject(new FileHashTaskError(
        'unavailable',
        'The file hash tool has already been closed.',
      ));
    }

    let validatedTask: FileHashTask;
    try {
      validatedTask = parseFileHashTask(task);
    }
    catch (error) {
      return Promise.reject(toFileHashTaskError(error, 'validation'));
    }

    const expectedFileSize = validatedTask.file.size;
    let progressCount = 0;
    let previousBytes = -1;
    const resultPromise = this.taskRunner.run(validatedTask, {
      onProgress: (progress) => {
        if (
          progress.totalBytes !== expectedFileSize
          || (progressCount === 0 && progress.bytesProcessed !== 0)
          || progress.bytesProcessed < previousBytes
        ) {
          throw new FileHashTaskError('worker', INVALID_PROGRESS_MESSAGE);
        }
        progressCount += 1;
        previousBytes = progress.bytesProcessed;
        onProgress?.(progress);
      },
    });

    return resultPromise.then((result) => {
      if (progressCount < 2 || previousBytes !== expectedFileSize) {
        throw new FileHashTaskError('worker', INVALID_PROGRESS_MESSAGE, result.elapsedMs);
      }
      return result;
    });
  }

  cancel(message = 'File hashing was cancelled.'): void {
    this.taskRunner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('File hashing was cancelled because the tool was closed.');
  }
}
