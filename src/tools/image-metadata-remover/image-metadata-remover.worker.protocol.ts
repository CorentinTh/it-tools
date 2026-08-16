import type { RemovedMetadataItem, SupportedImageMime } from './image-metadata-remover.service';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const IMAGE_METADATA_MAX_FILE_BYTES = 32 * 1024 * 1024;
export const IMAGE_METADATA_MAX_FILE_LABEL = '32 MiB';
export const IMAGE_METADATA_TIMEOUT_MS = 20_000;

export type ImageMetadataWorkerErrorCode = 'validation' | 'limit' | 'read' | 'format' | 'processing';
export type ImageMetadataTaskErrorCode = ImageMetadataWorkerErrorCode | 'worker' | 'timeout' | 'cancelled' | 'unavailable';

export interface ImageMetadataTask { file: Blob }
export interface ImageMetadataResult {
  inputBytes: number
  outputBytes: number
  mimeType: SupportedImageMime
  removedBytes: number
  removedItems: RemovedMetadataItem[]
  output: ArrayBuffer
}

export type ImageMetadataWorkerMessage =
  | { jobId: number; type: 'result'; result: ImageMetadataResult }
  | { jobId: number; type: 'error'; code: ImageMetadataWorkerErrorCode; message: string };

export class ImageMetadataTaskError extends Error {
  override readonly name = 'ImageMetadataTaskError';
  constructor(public readonly code: ImageMetadataTaskErrorCode, message: string, public readonly elapsedMs = 0) {
    super(message);
  }
}

const ERROR_MESSAGES: Record<ImageMetadataWorkerErrorCode, string> = {
  validation: 'Select one non-empty local JPEG, PNG, or WebP image.',
  limit: `Images are limited to ${IMAGE_METADATA_MAX_FILE_LABEL}.`,
  read: 'The selected image could not be read.',
  format: 'The image signature or container structure is unsupported or malformed.',
  processing: 'Image metadata removal failed.',
};

function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every(key => Object.prototype.hasOwnProperty.call(value, key));
}

export function parseImageMetadataTask(value: unknown): ImageMetadataTask {
  if (!isUnknownRecord(value) || !exactKeys(value, ['file']) || !(value.file instanceof Blob)
    || !Number.isSafeInteger(value.file.size) || value.file.size < 1) {
    throw new ImageMetadataTaskError('validation', ERROR_MESSAGES.validation);
  }
  if (value.file.size > IMAGE_METADATA_MAX_FILE_BYTES) {
    throw new ImageMetadataTaskError('limit', ERROR_MESSAGES.limit);
  }
  return { file: value.file };
}

export function parseImageMetadataRequest(value: unknown): { jobId: number; task: ImageMetadataTask } {
  if (!isUnknownRecord(value) || !exactKeys(value, ['jobId', 'task']) || !isWorkerJobId(value.jobId)) {
    throw new ImageMetadataTaskError('validation', ERROR_MESSAGES.validation);
  }
  return { jobId: value.jobId, task: parseImageMetadataTask(value.task) };
}

function isMimeType(value: unknown): value is SupportedImageMime {
  return value === 'image/jpeg' || value === 'image/png' || value === 'image/webp';
}

function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer
    || (Object.prototype.toString.call(value) === '[object ArrayBuffer]'
      && typeof (value as ArrayBuffer | undefined)?.byteLength === 'number');
}

function parseRemovedItem(value: unknown): RemovedMetadataItem | undefined {
  if (!isUnknownRecord(value) || !exactKeys(value, ['type', 'count', 'bytes'])
    || typeof value.type !== 'string' || value.type.length < 1 || value.type.length > 64
    || !Number.isSafeInteger(value.count) || Number(value.count) < 1 || Number(value.count) > 100_000
    || !Number.isSafeInteger(value.bytes) || Number(value.bytes) < 1 || Number(value.bytes) > IMAGE_METADATA_MAX_FILE_BYTES) {
    return undefined;
  }
  return { type: value.type, count: Number(value.count), bytes: Number(value.bytes) };
}

function parseResult(value: unknown): ImageMetadataResult | undefined {
  if (!isUnknownRecord(value) || !exactKeys(value, ['inputBytes', 'outputBytes', 'mimeType', 'removedBytes', 'removedItems', 'output'])
    || !Number.isSafeInteger(value.inputBytes) || Number(value.inputBytes) < 1 || Number(value.inputBytes) > IMAGE_METADATA_MAX_FILE_BYTES
    || !Number.isSafeInteger(value.outputBytes) || Number(value.outputBytes) < 1 || Number(value.outputBytes) > Number(value.inputBytes)
    || !isMimeType(value.mimeType)
    || !Number.isSafeInteger(value.removedBytes) || Number(value.removedBytes) < 0 || Number(value.removedBytes) > Number(value.inputBytes)
    || !Array.isArray(value.removedItems) || value.removedItems.length > 128
    || !isArrayBuffer(value.output) || value.output.byteLength !== Number(value.outputBytes)) {
    return undefined;
  }
  const removedItems = value.removedItems.map(parseRemovedItem);
  if (removedItems.some(item => !item)
    || removedItems.reduce((sum, item) => sum + (item?.bytes ?? 0), 0) !== Number(value.removedBytes)
    || Number(value.inputBytes) - Number(value.outputBytes) !== Number(value.removedBytes)) {
    return undefined;
  }
  return {
    inputBytes: Number(value.inputBytes),
    outputBytes: Number(value.outputBytes),
    mimeType: value.mimeType,
    removedBytes: Number(value.removedBytes),
    removedItems: removedItems as RemovedMetadataItem[],
    output: value.output,
  };
}

export function parseImageMetadataMessage(value: unknown): ImageMetadataWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new ImageMetadataTaskError('worker', 'The image metadata worker returned an invalid message.');
  }
  if (value.type === 'result' && exactKeys(value, ['jobId', 'type', 'result'])) {
    const parsed = parseResult(value.result);
    if (parsed) {
      return { jobId: value.jobId, type: 'result', result: parsed };
    }
  }
  if (value.type === 'error' && exactKeys(value, ['jobId', 'type', 'code', 'message'])
    && typeof value.code === 'string' && value.code in ERROR_MESSAGES
    && value.message === ERROR_MESSAGES[value.code as ImageMetadataWorkerErrorCode]) {
    return { jobId: value.jobId, type: 'error', code: value.code as ImageMetadataWorkerErrorCode, message: value.message };
  }
  throw new ImageMetadataTaskError('worker', 'The image metadata worker returned an invalid message.');
}

export function imageMetadataErrorMessage(code: ImageMetadataWorkerErrorCode): string {
  return ERROR_MESSAGES[code];
}
