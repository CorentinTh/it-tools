import { detectFileSignature, finalizeCrc32, formatHexPreview, updateCrc32 } from './local-file-inspector.service';
import {
  FILE_INSPECTOR_PREVIEW_BYTES,
  FILE_INSPECTOR_WINDOW_BYTES,
  type FileInspectorResult,
  FileInspectorTaskError,
  type FileInspectorWorkerMessage,
  fileInspectorErrorMessage,
  parseFileInspectorRequest,
} from './local-file-inspector.worker.protocol';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export async function handleFileInspectorRequest(
  value: unknown,
  emitProgress: (message: FileInspectorWorkerMessage) => void,
): Promise<FileInspectorWorkerMessage> {
  let jobId = isUnknownRecord(value) && isWorkerJobId(value.jobId) ? value.jobId : 1;
  try {
    const request = parseFileInspectorRequest(value);
    jobId = request.jobId;
    const { file } = request.task;
    let crc = 0xFFFF_FFFF;
    let preview = new Uint8Array();
    emitProgress({ jobId, type: 'progress', progress: { bytesProcessed: 0, totalBytes: file.size } });
    for (let offset = 0; offset < file.size; offset += FILE_INSPECTOR_WINDOW_BYTES) {
      let chunk: Uint8Array;
      try {
        chunk = new Uint8Array(await file.slice(offset, Math.min(file.size, offset + FILE_INSPECTOR_WINDOW_BYTES)).arrayBuffer());
      }
      catch {
        throw new FileInspectorTaskError('read', fileInspectorErrorMessage('read'));
      }
      if (offset === 0) {
        preview = chunk.slice(0, FILE_INSPECTOR_PREVIEW_BYTES);
      }
      crc = updateCrc32(crc, chunk);
      emitProgress({ jobId, type: 'progress', progress: { bytesProcessed: offset + chunk.byteLength, totalBytes: file.size } });
    }
    const signature = detectFileSignature(preview);
    const result: FileInspectorResult = {
      fileSize: file.size,
      detectedName: signature.name,
      detectedMime: signature.mime,
      extensions: signature.extensions,
      evidence: signature.evidence,
      crc32: finalizeCrc32(crc),
      previewBytes: preview.byteLength,
      hexPreview: formatHexPreview(preview),
    };
    return { jobId, type: 'result', result };
  }
  catch (error) {
    const taskError = error instanceof FileInspectorTaskError ? error : new FileInspectorTaskError('processing', fileInspectorErrorMessage('processing'));
    const code = ['validation', 'limit', 'read', 'processing'].includes(taskError.code) ? taskError.code as 'validation' | 'limit' | 'read' | 'processing' : 'processing';
    return { jobId, type: 'error', code, message: fileInspectorErrorMessage(code) };
  }
}
