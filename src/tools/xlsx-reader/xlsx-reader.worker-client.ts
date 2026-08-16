import { parseXlsxReaderMessage } from './xlsx-reader.worker.protocol';
import { XLSX_TIMEOUT_MS, type XlsxReaderResult, type XlsxReaderTask, XlsxReaderTaskError, type XlsxReaderWorkerErrorCode } from './xlsx-reader.types';
import { TerminateAndReplaceWorkerTask, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';

type Handle = WorkerTaskHandle<WorkerTaskRequest<XlsxReaderTask>>;

function createWorker(): Handle {
  return new Worker(new URL('./xlsx-reader.worker.ts', import.meta.url), { type: 'module', name: 'it-tools-xlsx-reader' });
}

export class XlsxReaderWorkerClient {
  private disposed = false;
  private readonly runner = new TerminateAndReplaceWorkerTask<XlsxReaderTask, XlsxReaderResult, XlsxReaderResult, XlsxReaderWorkerErrorCode, XlsxReaderTaskError>({
    workerFactory: createWorker,
    timeoutMs: XLSX_TIMEOUT_MS,
    messages: {
      replacement: 'A newer XLSX operation replaced this one.',
      unavailable: 'XLSX workers are not available in this browser.',
      timeout: () => 'XLSX processing exceeded the 15-second limit.',
      crash: 'The XLSX worker stopped unexpectedly.',
      postMessageFailure: 'XLSX processing could not be started.',
    },
    decodeMessage: parseXlsxReaderMessage,
    resolveResult: (result, task) => {
      if (result.fileSize !== task.file.size || (task.kind === 'inspect' && result.kind !== 'inspection') || (task.kind === 'preview' && result.kind !== 'preview')) {
        throw new XlsxReaderTaskError('worker', 'The XLSX worker returned a result for the wrong task.');
      }
      return result;
    },
    createError: (code, message, elapsedMs) => new XlsxReaderTaskError(code, message, elapsedMs),
    protocolError: (_error, elapsedMs) => new XlsxReaderTaskError('worker', 'The XLSX worker returned an invalid message.', elapsedMs),
  });

  run(task: XlsxReaderTask): Promise<WorkerTaskResult<XlsxReaderResult>> {
    if (this.disposed) {
      return Promise.reject(new XlsxReaderTaskError('unavailable', 'The XLSX reader has already been closed.'));
    }
    return this.runner.run(task);
  }

  cancel(message = 'XLSX processing was cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('XLSX processing was cancelled because the tool was closed.');
  }
}
