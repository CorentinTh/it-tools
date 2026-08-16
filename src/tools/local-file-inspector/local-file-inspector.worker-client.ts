import {
  FILE_INSPECTOR_TIMEOUT_MS,
  type FileInspectorProgress,
  type FileInspectorResult,
  type FileInspectorTask,
  FileInspectorTaskError,
  type FileInspectorWorkerErrorCode,
  parseFileInspectorMessage,
  parseFileInspectorTask,
} from './local-file-inspector.worker.protocol';
import { TerminateAndReplaceWorkerTask, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';

type Handle = WorkerTaskHandle<WorkerTaskRequest<FileInspectorTask>>;

function createWorker(): Handle {
  return new Worker(new URL('./local-file-inspector.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-local-file-inspector',
  });
}

export class FileInspectorWorkerClient {
  private disposed = false;
  private readonly runner = new TerminateAndReplaceWorkerTask<
    FileInspectorTask,
    FileInspectorResult,
    FileInspectorResult,
    FileInspectorWorkerErrorCode,
    FileInspectorTaskError,
    FileInspectorProgress
  >({
    workerFactory: createWorker,
    timeoutMs: FILE_INSPECTOR_TIMEOUT_MS,
    messages: {
      replacement: 'A newer file inspection replaced this one.',
      unavailable: 'File inspection workers are not available in this browser.',
      timeout: () => 'File inspection exceeded the 60-minute time limit.',
      crash: 'The file inspector worker stopped unexpectedly.',
      postMessageFailure: 'File inspection could not be started.',
      progressHandlerFailure: 'The file inspector worker returned invalid progress.',
    },
    decodeMessage: parseFileInspectorMessage,
    resolveResult: (result, task) => {
      if (result.fileSize !== task.file.size) {
        throw new FileInspectorTaskError('worker', 'The file inspector returned a result for the wrong file.');
      }
      return result;
    },
    createError: (code, message, elapsedMs) => new FileInspectorTaskError(code, message, elapsedMs),
    protocolError: (_error, elapsedMs) => new FileInspectorTaskError('worker', 'The file inspector worker returned an invalid message.', elapsedMs),
  });

  run(task: FileInspectorTask, onProgress?: (progress: FileInspectorProgress) => void): Promise<WorkerTaskResult<FileInspectorResult>> {
    if (this.disposed) {
      return Promise.reject(new FileInspectorTaskError('unavailable', 'The file inspector has already been closed.'));
    }
    let parsed: FileInspectorTask;
    try {
      parsed = parseFileInspectorTask(task);
    }
    catch (error) {
      return Promise.reject(error);
    }
    let previousBytes = -1;
    return this.runner.run(parsed, {
      onProgress: (progress) => {
        if (progress.totalBytes !== parsed.file.size || progress.bytesProcessed < previousBytes) {
          throw new FileInspectorTaskError('worker', 'The file inspector worker returned invalid progress.');
        }
        previousBytes = progress.bytesProcessed;
        onProgress?.(progress);
      },
    });
  }

  cancel(message = 'File inspection was cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('File inspection was cancelled because the tool was closed.');
  }
}
