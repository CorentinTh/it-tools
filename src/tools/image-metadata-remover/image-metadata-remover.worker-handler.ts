import { stripImageMetadata } from './image-metadata-remover.service';
import {
  ImageMetadataTaskError,
  type ImageMetadataWorkerMessage,
  imageMetadataErrorMessage,
  parseImageMetadataRequest,
} from './image-metadata-remover.worker.protocol';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export async function handleImageMetadataRequest(value: unknown): Promise<ImageMetadataWorkerMessage> {
  let jobId = isUnknownRecord(value) && isWorkerJobId(value.jobId) ? value.jobId : 1;
  try {
    const request = parseImageMetadataRequest(value);
    jobId = request.jobId;
    let source: ArrayBuffer;
    try {
      source = await request.task.file.arrayBuffer();
    }
    catch {
      throw new ImageMetadataTaskError('read', imageMetadataErrorMessage('read'));
    }
    let stripped;
    try {
      stripped = stripImageMetadata(new Uint8Array(source));
    }
    catch {
      throw new ImageMetadataTaskError('format', imageMetadataErrorMessage('format'));
    }
    const output = stripped.bytes.buffer.slice(
      stripped.bytes.byteOffset,
      stripped.bytes.byteOffset + stripped.bytes.byteLength,
    ) as ArrayBuffer;
    return {
      jobId,
      type: 'result',
      result: {
        inputBytes: request.task.file.size,
        outputBytes: output.byteLength,
        mimeType: stripped.mimeType,
        removedBytes: stripped.removedBytes,
        removedItems: stripped.removedItems,
        output,
      },
    };
  }
  catch (error) {
    const taskError = error instanceof ImageMetadataTaskError
      ? error
      : new ImageMetadataTaskError('processing', imageMetadataErrorMessage('processing'));
    const code = ['validation', 'limit', 'read', 'format', 'processing'].includes(taskError.code)
      ? taskError.code as 'validation' | 'limit' | 'read' | 'format' | 'processing'
      : 'processing';
    return { jobId, type: 'error', code, message: imageMetadataErrorMessage(code) };
  }
}
