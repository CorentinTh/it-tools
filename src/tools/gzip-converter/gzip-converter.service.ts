import { Base64 } from 'js-base64';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

export type GzipOperation = 'compress' | 'decompress';

export const GZIP_MAX_FILE_BYTES = 64 * 1024 * 1024;
export const GZIP_MAX_TEXT_BYTES = 1024 * 1024;
export const GZIP_MAX_OUTPUT_BYTES = 72 * 1024 * 1024;
export const GZIP_MAX_BASE64_CHARACTERS = 2 * 1024 * 1024;

export interface GzipResult {
  blob: Blob
  byteLength: number
}

export function gzipStreamsAvailable(): boolean {
  return typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';
}

export function decodeGzipBase64(source: string): Uint8Array {
  const normalized = source.trim().replace(/\s+/gu, '');
  if (!normalized || normalized.length > GZIP_MAX_BASE64_CHARACTERS || !/^[A-Za-z0-9+/]*={0,2}$/u.test(normalized) || normalized.length % 4 === 1) {
    throw new TypeError('Enter valid standard Base64 up to 2 MiB of text.');
  }
  try {
    const bytes = Base64.toUint8Array(normalized);
    if (Base64.fromUint8Array(bytes) !== normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')) {
      throw new TypeError('Enter canonical standard Base64.');
    }
    return bytes;
  }
  catch {
    throw new TypeError('Enter valid standard Base64 up to 2 MiB of text.');
  }
}

export function encodeGzipBase64(bytes: Uint8Array): string {
  if (bytes.byteLength > GZIP_MAX_TEXT_BYTES + 64 * 1024) {
    throw new RangeError('Base64 display is limited to small text-mode results.');
  }
  return Base64.fromUint8Array(bytes);
}

export function textToBoundedBlob(source: string): Blob {
  if (exceedsUtf8ByteLimit(source, GZIP_MAX_TEXT_BYTES)) {
    throw new RangeError('Text input is limited to 1 MiB of UTF-8 data.');
  }
  return new Blob([source], { type: 'text/plain;charset=utf-8' });
}

export async function transformGzip(input: Blob, operation: GzipOperation, signal?: AbortSignal): Promise<GzipResult> {
  if (!gzipStreamsAvailable()) {
    throw new TypeError('Compression Streams are not available in this browser.');
  }
  if (input.size > GZIP_MAX_FILE_BYTES) {
    throw new RangeError('GZIP input is limited to 64 MiB.');
  }
  if (signal?.aborted) {
    throw new DOMException('The GZIP task was cancelled.', 'AbortError');
  }
  const transformer = operation === 'compress' ? new CompressionStream('gzip') : new DecompressionStream('gzip');
  const reader = input.stream().pipeThrough(transformer).getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  const abort = () => {
    reader.cancel('cancelled').catch(() => undefined);
  };
  signal?.addEventListener('abort', abort, { once: true });
  try {
    while (true) {
      if (signal?.aborted) {
        throw new DOMException('The GZIP task was cancelled.', 'AbortError');
      }
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      byteLength += value.byteLength;
      if (byteLength > GZIP_MAX_OUTPUT_BYTES) {
        await reader.cancel('output limit');
        throw new RangeError('GZIP output exceeds the 72 MiB safety limit.');
      }
      chunks.push(value);
    }
  }
  catch (error) {
    if (error instanceof RangeError || (error instanceof DOMException && error.name === 'AbortError')) {
      throw error;
    }
    throw new Error(operation === 'decompress' ? 'The input is not a valid supported GZIP stream.' : 'GZIP compression failed.');
  }
  finally {
    signal?.removeEventListener('abort', abort);
  }
  return { blob: new Blob(chunks, { type: operation === 'compress' ? 'application/gzip' : 'application/octet-stream' }), byteLength };
}

export async function blobToUtf8(blob: Blob): Promise<string> {
  if (blob.size > GZIP_MAX_TEXT_BYTES) {
    throw new RangeError('Decompressed text display is limited to 1 MiB. Use file mode for larger output.');
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(await blob.arrayBuffer());
  }
  catch {
    throw new TypeError('Decompressed bytes are not valid UTF-8 text. Use file mode to download binary output.');
  }
}
