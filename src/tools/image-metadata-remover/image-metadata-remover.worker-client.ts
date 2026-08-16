import {
  IMAGE_METADATA_TIMEOUT_MS,
  type ImageMetadataResult,
  type ImageMetadataTask,
  ImageMetadataTaskError,
  type ImageMetadataWorkerErrorCode,
  parseImageMetadataMessage,
  parseImageMetadataTask,
} from './image-metadata-remover.worker.protocol';
import { TerminateAndReplaceWorkerTask, type WorkerTaskHandle, type WorkerTaskResult } from '@/utils/worker-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';

type Handle = WorkerTaskHandle<WorkerTaskRequest<ImageMetadataTask>>;

function createWorker(): Handle {
  return new Worker(new URL('./image-metadata-remover.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-image-metadata-remover',
  });
}

export class ImageMetadataWorkerClient {
  private disposed = false;
  private readonly runner: TerminateAndReplaceWorkerTask<
    ImageMetadataTask,
    ImageMetadataResult,
    ImageMetadataResult,
    ImageMetadataWorkerErrorCode,
    ImageMetadataTaskError
  >;

  constructor(workerFactory: () => Handle = createWorker) {
    this.runner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs: IMAGE_METADATA_TIMEOUT_MS,
      messages: {
        replacement: 'A newer image replaced this metadata-removal task.',
        unavailable: 'Image metadata workers are not available in this browser.',
        timeout: () => 'Image metadata removal exceeded the 20-second limit.',
        crash: 'The image metadata worker stopped unexpectedly.',
        postMessageFailure: 'Image metadata removal could not be started.',
      },
      decodeMessage: parseImageMetadataMessage,
      resolveResult: (result, task) => {
        if (result.inputBytes !== task.file.size) {
          throw new ImageMetadataTaskError('worker', 'The image metadata worker returned a result for the wrong file.');
        }
        return result;
      },
      createError: (code, message, elapsedMs) => new ImageMetadataTaskError(code, message, elapsedMs),
      protocolError: (_error, elapsedMs) => new ImageMetadataTaskError('worker', 'The image metadata worker returned an invalid message.', elapsedMs),
    });
  }

  run(task: ImageMetadataTask): Promise<WorkerTaskResult<ImageMetadataResult>> {
    if (this.disposed) {
      return Promise.reject(new ImageMetadataTaskError('unavailable', 'The image metadata remover has already been closed.'));
    }
    try {
      return this.runner.run(parseImageMetadataTask(task));
    }
    catch (error) {
      return Promise.reject(error);
    }
  }

  cancel(message = 'Image metadata removal was cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('Image metadata removal was cancelled because the tool was closed.');
  }
}
