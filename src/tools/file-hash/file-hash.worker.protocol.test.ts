// @vitest-environment node

import { describe, expect, it } from 'vitest';
import {
  FILE_HASH_ALGORITHMS,
  FILE_HASH_MAX_FILE_BYTES,
  FILE_HASH_WORKER_ERROR_MESSAGES,
  type FileHashTask,
  FileHashTaskError,
  parseFileHashTask,
  parseFileHashWorkerJobId,
  parseFileHashWorkerMessage,
  parseFileHashWorkerRequest,
  resolveFileHashResult,
} from './file-hash.worker.protocol';

const FILE = new Blob(['abc']);
const TASK: FileHashTask = { file: FILE, algorithms: [...FILE_HASH_ALGORITHMS] };
const DIGESTS = [
  { algorithm: 'SHA-256' as const, hex: 'a'.repeat(64) },
  { algorithm: 'SHA-384' as const, hex: 'b'.repeat(96) },
  { algorithm: 'SHA-512' as const, hex: 'c'.repeat(128) },
  { algorithm: 'SHA3-256' as const, hex: 'd'.repeat(64) },
  { algorithm: 'BLAKE3-256' as const, hex: 'e'.repeat(64) },
  { algorithm: 'SHA-1' as const, hex: 'f'.repeat(40) },
  { algorithm: 'MD5' as const, hex: '0'.repeat(32) },
];

function expectTaskError(
  action: () => unknown,
  code: FileHashTaskError['code'],
): FileHashTaskError {
  try {
    action();
    throw new Error('Expected the file hash protocol value to be rejected.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(FileHashTaskError);
    expect((error as FileHashTaskError).code).toBe(code);
    return error as FileHashTaskError;
  }
}

function blobWithReportedSize(size: number): Blob {
  const blob = new Blob([]);
  Object.defineProperty(blob, 'size', { configurable: true, value: size });
  return blob;
}

describe('file hash worker protocol', () => {
  it('accepts an empty Blob and one to seven unique supported algorithms', () => {
    const empty = new Blob([]);
    expect(parseFileHashTask({ file: empty, algorithms: ['SHA-256'] })).toEqual({
      file: empty,
      algorithms: ['SHA-256'],
    });
    expect(parseFileHashTask(TASK)).toEqual(TASK);
    expect(parseFileHashWorkerRequest({ jobId: 7, task: TASK })).toEqual({ jobId: 7, task: TASK });
  });

  it.each([
    [null, 'validation'],
    [[], 'validation'],
    [{ file: {}, algorithms: ['SHA-256'] }, 'validation'],
    [{ file: FILE, algorithms: [] }, 'validation'],
    [{ file: FILE, algorithms: [...FILE_HASH_ALGORITHMS, 'SHA-256'] }, 'validation'],
    [{ file: FILE, algorithms: ['SHA-256', 'SHA-256'] }, 'validation'],
    [{ file: FILE, algorithms: ['SHA-512', 'SHA-256'] }, 'validation'],
    [{ file: FILE, algorithms: ['CRC32'] }, 'unsupported'],
    [{ file: FILE, algorithms: ['SHA-256'], secretName: 'private.bin' }, 'validation'],
    [{ file: blobWithReportedSize(-1), algorithms: ['SHA-256'] }, 'validation'],
    [{ file: blobWithReportedSize(1.5), algorithms: ['SHA-256'] }, 'validation'],
    [{ file: blobWithReportedSize(FILE_HASH_MAX_FILE_BYTES + 1), algorithms: ['SHA-256'] }, 'limit'],
  ] as const)('rejects a malformed or oversized task %#', (task, code) => {
    expectTaskError(() => parseFileHashTask(task), code);
  });

  it('rejects arrays and unsafe worker identifiers at envelope boundaries', () => {
    expectTaskError(() => parseFileHashWorkerRequest(Object.assign([], { jobId: 1, task: TASK })), 'validation');
    expectTaskError(() => parseFileHashWorkerRequest({ jobId: 1, task: TASK, fileName: 'private.bin' }), 'validation');
    expectTaskError(() => parseFileHashWorkerJobId({ jobId: 0 }), 'worker');
    expectTaskError(() => parseFileHashWorkerJobId({ jobId: 1.5 }), 'worker');
    expectTaskError(() => parseFileHashWorkerJobId({ jobId: Number.NaN }), 'worker');
    expectTaskError(() => parseFileHashWorkerJobId({ jobId: Number.POSITIVE_INFINITY }), 'worker');
    expect(parseFileHashWorkerJobId({ jobId: Number.MAX_SAFE_INTEGER })).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('accepts bounded progress, exact digest shapes, and static allow-listed errors', () => {
    expect(parseFileHashWorkerMessage({
      jobId: 1,
      type: 'progress',
      progress: { bytesProcessed: 2, totalBytes: 3 },
    })).toEqual({ jobId: 1, type: 'progress', progress: { bytesProcessed: 2, totalBytes: 3 } });
    expect(parseFileHashWorkerMessage({
      jobId: 2,
      type: 'result',
      result: { fileSize: 3, digests: DIGESTS },
    })).toEqual({ jobId: 2, type: 'result', result: { fileSize: 3, digests: DIGESTS } });

    for (const [code, message] of Object.entries(FILE_HASH_WORKER_ERROR_MESSAGES)) {
      expect(parseFileHashWorkerMessage({ jobId: 3, type: 'error', code, message }))
        .toEqual({ jobId: 3, type: 'error', code, message });
    }
  });

  it.each([
    null,
    [],
    { jobId: 0, type: 'progress', progress: { bytesProcessed: 0, totalBytes: 0 } },
    { jobId: 1, type: 'progress', progress: { bytesProcessed: -1, totalBytes: 3 } },
    { jobId: 1, type: 'progress', progress: { bytesProcessed: 4, totalBytes: 3 } },
    { jobId: 1, type: 'progress', progress: { bytesProcessed: 1.5, totalBytes: 3 } },
    { jobId: 1, type: 'progress', progress: { bytesProcessed: 1, totalBytes: 3, bytes: 'secret' } },
    { jobId: 1, type: 'progress', progress: { bytesProcessed: 1, totalBytes: 3 }, fileName: 'private.bin' },
    { jobId: 1, type: 'progress', progress: { bytesProcessed: 0, totalBytes: FILE_HASH_MAX_FILE_BYTES + 1 } },
    { jobId: 1, type: 'result', result: { fileSize: 3, digests: [] } },
    { jobId: 1, type: 'result', result: { fileSize: 3, digests: [DIGESTS[0], DIGESTS[0]] } },
    { jobId: 1, type: 'result', result: { fileSize: 3, digests: [...DIGESTS].reverse() } },
    { jobId: 1, type: 'result', result: { fileSize: 3, digests: [DIGESTS[0]], fileName: 'private.bin' } },
    { jobId: 1, type: 'result', result: { fileSize: 3, digests: [{ ...DIGESTS[0], bytes: 'secret' }] } },
    { jobId: 1, type: 'result', result: { fileSize: 3, digests: [DIGESTS[0]] }, fileName: 'private.bin' },
    { jobId: 1, type: 'result', result: { fileSize: 3, digests: [{ algorithm: 'SHA-256', hex: 'A'.repeat(64) }] } },
    { jobId: 1, type: 'result', result: { fileSize: 3, digests: [{ algorithm: 'SHA-384', hex: 'a'.repeat(64) }] } },
    { jobId: 1, type: 'error', code: 'read', message: 'secret.txt: NotReadableError' },
    { jobId: 1, type: 'error', code: 'read', message: FILE_HASH_WORKER_ERROR_MESSAGES.read, detail: 'private.bin' },
    { jobId: 1, type: 'error', code: 'operation', message: FILE_HASH_WORKER_ERROR_MESSAGES.hash },
  ])('rejects a malformed worker message %#', (message) => {
    expectTaskError(() => parseFileHashWorkerMessage(message), 'worker');
  });

  it('requires the result file size and algorithm set to match the request', () => {
    expect(resolveFileHashResult({ fileSize: 3, digests: DIGESTS }, TASK))
      .toEqual({ fileSize: 3, digests: DIGESTS });
    expectTaskError(
      () => resolveFileHashResult({ fileSize: 3, digests: [...DIGESTS].reverse() }, TASK),
      'worker',
    );
    expectTaskError(
      () => resolveFileHashResult({ fileSize: 2, digests: DIGESTS }, TASK),
      'worker',
    );
    expectTaskError(
      () => resolveFileHashResult({ fileSize: 3, digests: DIGESTS.slice(0, 2) }, TASK),
      'worker',
    );
  });
});
