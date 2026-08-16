import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const FILE_INSPECTOR_MAX_FILE_BYTES = 2 * 1024 * 1024 * 1024;
export const FILE_INSPECTOR_MAX_FILE_LABEL = '2 GiB';
export const FILE_INSPECTOR_PREVIEW_BYTES = 4 * 1024;
export const FILE_INSPECTOR_WINDOW_BYTES = 4 * 1024 * 1024;
export const FILE_INSPECTOR_TIMEOUT_MS = 60 * 60 * 1_000;

export type FileInspectorWorkerErrorCode = 'validation' | 'limit' | 'read' | 'processing';
export type FileInspectorTaskErrorCode = FileInspectorWorkerErrorCode | 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export interface FileInspectorTask { file: Blob }
export interface FileInspectorProgress { bytesProcessed: number; totalBytes: number }
export interface FileInspectorResult {
  fileSize: number
  detectedName: string
  detectedMime: string
  extensions: string[]
  evidence: string
  crc32: string
  previewBytes: number
  hexPreview: string
}

export type FileInspectorWorkerMessage =
  | { jobId: number; type: 'progress'; progress: FileInspectorProgress }
  | { jobId: number; type: 'result'; result: FileInspectorResult }
  | { jobId: number; type: 'error'; code: FileInspectorWorkerErrorCode; message: string };

export class FileInspectorTaskError extends Error {
  override readonly name = 'FileInspectorTaskError';
  constructor(public readonly code: FileInspectorTaskErrorCode, message: string, public readonly elapsedMs = 0) {
    super(message);
  }
}

const ERROR_MESSAGES: Record<FileInspectorWorkerErrorCode, string> = {
  validation: 'Select a valid local file.',
  limit: `Files are limited to ${FILE_INSPECTOR_MAX_FILE_LABEL}.`,
  read: 'The selected file could not be read.',
  processing: 'The selected file could not be inspected.',
};

function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value, key));
}

export function parseFileInspectorTask(value: unknown): FileInspectorTask {
  if (!isUnknownRecord(value) || !exactKeys(value, ['file']) || !(value.file instanceof Blob)) {
    throw new FileInspectorTaskError('validation', ERROR_MESSAGES.validation);
  }
  if (!Number.isSafeInteger(value.file.size) || value.file.size < 0) {
    throw new FileInspectorTaskError('validation', ERROR_MESSAGES.validation);
  }
  if (value.file.size > FILE_INSPECTOR_MAX_FILE_BYTES) {
    throw new FileInspectorTaskError('limit', ERROR_MESSAGES.limit);
  }
  return { file: value.file };
}

export function parseFileInspectorRequest(value: unknown): { jobId: number; task: FileInspectorTask } {
  if (!isUnknownRecord(value) || !exactKeys(value, ['jobId', 'task']) || !isWorkerJobId(value.jobId)) {
    throw new FileInspectorTaskError('validation', ERROR_MESSAGES.validation);
  }
  return { jobId: value.jobId, task: parseFileInspectorTask(value.task) };
}

function parseProgress(value: unknown): FileInspectorProgress | undefined {
  if (!isUnknownRecord(value) || !exactKeys(value, ['bytesProcessed', 'totalBytes'])
    || !Number.isSafeInteger(value.bytesProcessed) || Number(value.bytesProcessed) < 0
    || !Number.isSafeInteger(value.totalBytes) || Number(value.totalBytes) < 0
    || Number(value.bytesProcessed) > Number(value.totalBytes)
    || Number(value.totalBytes) > FILE_INSPECTOR_MAX_FILE_BYTES) {
    return undefined;
  }
  return { bytesProcessed: Number(value.bytesProcessed), totalBytes: Number(value.totalBytes) };
}

function parseResult(value: unknown): FileInspectorResult | undefined {
  if (!isUnknownRecord(value) || !exactKeys(value, ['fileSize', 'detectedName', 'detectedMime', 'extensions', 'evidence', 'crc32', 'previewBytes', 'hexPreview'])
    || !Number.isSafeInteger(value.fileSize) || Number(value.fileSize) < 0 || Number(value.fileSize) > FILE_INSPECTOR_MAX_FILE_BYTES
    || typeof value.detectedName !== 'string' || value.detectedName.length > 128
    || typeof value.detectedMime !== 'string' || value.detectedMime.length > 128
    || !Array.isArray(value.extensions) || value.extensions.length > 12 || value.extensions.some(extension => typeof extension !== 'string' || !/^[a-z0-9]{1,12}$/.test(extension))
    || typeof value.evidence !== 'string' || value.evidence.length > 256
    || typeof value.crc32 !== 'string' || !/^[0-9a-f]{8}$/.test(value.crc32)
    || !Number.isSafeInteger(value.previewBytes) || Number(value.previewBytes) < 0 || Number(value.previewBytes) > FILE_INSPECTOR_PREVIEW_BYTES
    || typeof value.hexPreview !== 'string' || value.hexPreview.length > 20_000) {
    return undefined;
  }
  return {
    fileSize: Number(value.fileSize),
    detectedName: value.detectedName,
    detectedMime: value.detectedMime,
    extensions: [...value.extensions] as string[],
    evidence: value.evidence,
    crc32: value.crc32,
    previewBytes: Number(value.previewBytes),
    hexPreview: value.hexPreview,
  };
}

export function parseFileInspectorMessage(value: unknown): FileInspectorWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new FileInspectorTaskError('worker', 'The file inspector worker returned an invalid message.');
  }
  if (value.type === 'progress' && exactKeys(value, ['jobId', 'type', 'progress'])) {
    const progress = parseProgress(value.progress);
    if (progress) {
      return { jobId: value.jobId, type: 'progress', progress };
    }
  }
  if (value.type === 'result' && exactKeys(value, ['jobId', 'type', 'result'])) {
    const result = parseResult(value.result);
    if (result) {
      return { jobId: value.jobId, type: 'result', result };
    }
  }
  if (value.type === 'error' && exactKeys(value, ['jobId', 'type', 'code', 'message'])
    && typeof value.code === 'string' && value.code in ERROR_MESSAGES
    && value.message === ERROR_MESSAGES[value.code as FileInspectorWorkerErrorCode]) {
    return { jobId: value.jobId, type: 'error', code: value.code as FileInspectorWorkerErrorCode, message: value.message };
  }
  throw new FileInspectorTaskError('worker', 'The file inspector worker returned an invalid message.');
}

export function fileInspectorErrorMessage(code: FileInspectorWorkerErrorCode): string {
  return ERROR_MESSAGES[code];
}
