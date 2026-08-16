import { parseParquetReaderMessage } from './parquet-reader.worker.protocol';
import {
  PARQUET_TIMEOUT_MS,
  type ParquetReaderResult,
  type ParquetReaderTask,
  ParquetReaderTaskError,
  type ParquetReaderWorkerErrorCode,
} from './parquet-reader.types';
import { TerminateAndReplaceWorkerTask, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';

type Handle = WorkerTaskHandle<WorkerTaskRequest<ParquetReaderTask>>;

function createWorker(): Handle {
  return new Worker(new URL('./parquet-reader.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-parquet-reader',
  });
}

export class ParquetReaderWorkerClient {
  private disposed = false;
  private readonly runner = new TerminateAndReplaceWorkerTask<
    ParquetReaderTask,
    ParquetReaderResult,
    ParquetReaderResult,
    ParquetReaderWorkerErrorCode,
    ParquetReaderTaskError
  >({
    workerFactory: createWorker,
    timeoutMs: PARQUET_TIMEOUT_MS,
    messages: {
      replacement: 'A newer Parquet operation replaced this one.',
      unavailable: 'Parquet workers are not available in this browser.',
      timeout: () => 'Parquet processing exceeded the 15-second limit.',
      crash: 'The Parquet worker stopped unexpectedly.',
      postMessageFailure: 'Parquet processing could not be started.',
    },
    decodeMessage: parseParquetReaderMessage,
    resolveResult: (result, task) => {
      if (result.fileSize !== task.file.size || (task.kind === 'inspect' && result.kind !== 'inspection') || (task.kind === 'preview' && result.kind !== 'preview')) {
        throw new ParquetReaderTaskError('worker', 'The Parquet worker returned a result for the wrong task.');
      }
      return result;
    },
    createError: (code, message, elapsedMs) => new ParquetReaderTaskError(code, message, elapsedMs),
    protocolError: (_error, elapsedMs) => new ParquetReaderTaskError('worker', 'The Parquet worker returned an invalid message.', elapsedMs),
  });

  run(task: ParquetReaderTask): Promise<WorkerTaskResult<ParquetReaderResult>> {
    if (this.disposed) {
      return Promise.reject(new ParquetReaderTaskError('unavailable', 'The Parquet reader has already been closed.'));
    }
    return this.runner.run(task);
  }

  cancel(message = 'Parquet processing was cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('Parquet processing was cancelled because the tool was closed.');
  }
}
