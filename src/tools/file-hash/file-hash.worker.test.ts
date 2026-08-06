// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type FileHashWorkerHandlerOptions } from './file-hash.worker-handler';
import {
  FILE_HASH_WORKER_ERROR_MESSAGES,
  type FileHashWorkerTerminalMessage,
} from './file-hash.worker.protocol';

const mocks = vi.hoisted(() => ({
  handleRequest: vi.fn<
    [unknown, FileHashWorkerHandlerOptions],
    Promise<FileHashWorkerTerminalMessage>
  >(),
}));

vi.mock('./file-hash.worker-handler', () => ({
  handleFileHashWorkerRequest: mocks.handleRequest,
}));

interface WorkerScopeStub {
  onmessage: ((event: MessageEvent<unknown>) => Promise<void> | void) | null
  postMessage: ReturnType<typeof vi.fn>
}

beforeEach(() => {
  vi.resetModules();
  mocks.handleRequest.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('file hash worker entry', () => {
  it('forwards progress and the terminal response from the async handler', async () => {
    const scope: WorkerScopeStub = { onmessage: null, postMessage: vi.fn() };
    vi.stubGlobal('self', scope);
    const terminal = {
      jobId: 7,
      type: 'error' as const,
      code: 'read' as const,
      message: FILE_HASH_WORKER_ERROR_MESSAGES.read,
    };
    mocks.handleRequest.mockResolvedValue(terminal);
    await import('./file-hash.worker');

    const request = { jobId: 7, task: { file: new Blob([]), algorithms: ['SHA-256'] } };
    const handling = scope.onmessage?.({ data: request } as MessageEvent<unknown>);
    const options = mocks.handleRequest.mock.calls[0]?.[1];
    const progress = {
      jobId: 7,
      type: 'progress' as const,
      progress: { bytesProcessed: 0, totalBytes: 0 },
    };
    expect(options).toBeDefined();
    options?.emitProgress?.(progress);

    expect(scope.postMessage).toHaveBeenCalledWith(progress);
    await handling;
    expect(scope.postMessage).toHaveBeenCalledWith(terminal);
  });
});
