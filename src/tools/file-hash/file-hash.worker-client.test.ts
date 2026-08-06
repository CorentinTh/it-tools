// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';
import { FileHashWorkerClient, type FileHashWorkerHandle } from './file-hash.worker-client';
import {
  type FileHashTask,
  FileHashTaskError,
  type FileHashWorkerRequest,
} from './file-hash.worker.protocol';

class FakeWorker implements FileHashWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: FileHashWorkerRequest[] = [];
  terminateCount = 0;
  throwOnPost = false;

  postMessage(message: FileHashWorkerRequest): void {
    if (this.throwOnPost) {
      throw new DOMException('secret-file-name.bin');
    }
    this.posted.push(message);
  }

  terminate(): void {
    this.terminateCount += 1;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }

  failToDeserialize(preventDefault = vi.fn()): ReturnType<typeof vi.fn> {
    this.onmessageerror?.({ preventDefault } as unknown as MessageEvent<unknown>);
    return preventDefault;
  }
}

function createHarness(timeoutMs = 60 * 60 * 1_000) {
  const workers: FakeWorker[] = [];
  const client = new FileHashWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

function task(source = 'abc'): FileHashTask {
  return { file: new Blob([source]), algorithms: ['SHA-256'] };
}

function progress(jobId: number, bytesProcessed: number, totalBytes: number) {
  return { jobId, type: 'progress', progress: { bytesProcessed, totalBytes } };
}

function result(jobId: number, fileSize = 3) {
  return {
    jobId,
    type: 'result',
    result: {
      fileSize,
      digests: [{ algorithm: 'SHA-256', hex: 'a'.repeat(64) }],
    },
  };
}

async function rejectedError(
  promise: Promise<unknown>,
  code: FileHashTaskError['code'],
): Promise<FileHashTaskError> {
  try {
    await promise;
    throw new Error('Expected file hashing to reject.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(FileHashTaskError);
    expect((error as FileHashTaskError).code).toBe(code);
    return error as FileHashTaskError;
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe('FileHashWorkerClient', () => {
  it('posts the Blob task, validates progress, resolves the exact result, and terminates', async () => {
    const { client, workers } = createHarness();
    const onProgress = vi.fn();
    const selectedTask = task();
    const pending = client.run(selectedTask, onProgress);

    expect(workers[0].posted).toEqual([{ jobId: 1, task: selectedTask }]);
    workers[0].emit(progress(1, 0, 3));
    workers[0].emit(progress(1, 3, 3));
    workers[0].emit(result(1));

    await expect(pending).resolves.toMatchObject({
      value: { fileSize: 3, digests: [{ algorithm: 'SHA-256' }] },
    });
    expect(onProgress.mock.calls.map(([value]) => value.bytesProcessed)).toEqual([0, 3]);
    expect(workers[0].terminateCount).toBe(1);
  });

  it.each([
    [progress(1, 1, 3), progress(1, 0, 3)],
    [progress(1, 0, 2), progress(1, 2, 2)],
    [progress(1, 0, 3), progress(1, 4, 3)],
  ])('fails closed on invalid or non-monotonic progress %#', async (...messages) => {
    const { client, workers } = createHarness();
    const pending = client.run(task());

    for (const message of messages) {
      workers[0].emit(message);
    }

    await rejectedError(pending, 'worker');
    expect(workers[0].terminateCount).toBe(1);
  });

  it('requires both initial and final progress before accepting a result', async () => {
    const { client, workers } = createHarness();
    const pending = client.run(task());
    workers[0].emit(result(1));

    expect((await rejectedError(pending, 'worker')).message).toContain('invalid progress');
    expect(workers[0].terminateCount).toBe(1);
  });

  it('replaces active work, ignores well-formed stale messages, and resolves the current job', async () => {
    const { client, workers } = createHarness();
    const stale = client.run(task('old'));
    const staleRejection = rejectedError(stale, 'cancelled');
    const current = client.run(task('new'));

    await staleRejection;
    expect(workers[0].terminateCount).toBe(1);
    workers[1].emit(progress(1, 0, 3));
    workers[1].emit(result(1));
    workers[1].emit(progress(2, 0, 3));
    workers[1].emit(progress(2, 3, 3));
    workers[1].emit(result(2));

    await expect(current).resolves.toMatchObject({ value: { fileSize: 3 } });
  });

  it('cancels and disposes active work, then refuses new tasks', async () => {
    const cancelHarness = createHarness();
    const cancelled = cancelHarness.client.run(task());
    cancelHarness.client.cancel('Cancelled explicitly.');
    expect((await rejectedError(cancelled, 'cancelled')).message).toBe('Cancelled explicitly.');
    expect(cancelHarness.workers[0].terminateCount).toBe(1);

    const disposeHarness = createHarness();
    const disposed = disposeHarness.client.run(task());
    disposeHarness.client.dispose();
    await rejectedError(disposed, 'cancelled');
    expect(disposeHarness.workers[0].terminateCount).toBe(1);
    await rejectedError(disposeHarness.client.run(task()), 'unavailable');
    expect(disposeHarness.workers).toHaveLength(1);
  });

  it('settles and terminates on messageerror and malformed envelopes', async () => {
    const messageErrorHarness = createHarness();
    const messageError = messageErrorHarness.client.run(task());
    const preventDefault = messageErrorHarness.workers[0].failToDeserialize();
    await rejectedError(messageError, 'worker');
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(messageErrorHarness.workers[0].terminateCount).toBe(1);

    const malformedHarness = createHarness();
    const malformed = malformedHarness.client.run(task());
    malformedHarness.workers[0].emit({ jobId: 1, type: 'result', result: { fileSize: 3, digests: [] } });
    await rejectedError(malformed, 'worker');
    expect(malformedHarness.workers[0].terminateCount).toBe(1);
  });

  it('hard-terminates timeouts and handles creation/postMessage failures without fallback', async () => {
    vi.useFakeTimers();
    const timeoutHarness = createHarness(25);
    const timedOut = timeoutHarness.client.run(task());
    const timeoutRejection = rejectedError(timedOut, 'timeout');
    await vi.advanceTimersByTimeAsync(25);
    await timeoutRejection;
    expect(timeoutHarness.workers[0].terminateCount).toBe(1);

    const unavailable = new FileHashWorkerClient(() => {
      throw new Error('unavailable');
    });
    await rejectedError(unavailable.run(task()), 'unavailable');

    const postWorker = new FakeWorker();
    postWorker.throwOnPost = true;
    const postClient = new FileHashWorkerClient(() => postWorker);
    expect((await rejectedError(postClient.run(task()), 'worker')).message).not.toContain('secret-file-name.bin');
    expect(postWorker.terminateCount).toBe(1);
  });
});
