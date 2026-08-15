import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHashTextWorkerClient } from './hash-text.worker-client';
import type { HashTextTask } from './hash-text.worker.protocol';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<HashTextTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted?: WorkerTaskRequest<HashTextTask>;
  terminated = false;

  postMessage(message: WorkerTaskRequest<HashTextTask>): void {
    this.posted = message;
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

function harness(timeoutMs = 5_000) {
  const workers: FakeWorker[] = [];
  const client = createHashTextWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Hash Text worker client', () => {
  it('uses an exact task envelope and terminates after a strict result', async () => {
    const { client, workers } = harness();
    const pending = client.run({ encoding: 'Hex', source: 'hello' });
    expect(workers[0].posted).toEqual({ jobId: 1, task: { encoding: 'Hex', source: 'hello' } });
    const value = JSON.stringify({ MD5: 'a', SHA1: 'b', SHA224: 'c', SHA256: 'd', SHA384: 'e', SHA512: 'f', SHA3: 'g', RIPEMD160: 'h' });
    workers[0].emit({ jobId: 1, type: 'result', result: { byteLength: value.length, value } });
    await expect(pending).resolves.toMatchObject({ value });
    expect(workers[0].terminated).toBe(true);
  });

  it('physically terminates replacement, cancellation, and timeout', async () => {
    const replaced = harness();
    const first = replaced.client.run({ encoding: 'Hex', source: 'first' });
    const second = replaced.client.run({ encoding: 'Hex', source: 'second' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.cancel();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });

    const disposed = harness();
    const closing = disposed.client.run({ encoding: 'Hex', source: 'close' });
    disposed.client.dispose();
    await expect(closing).rejects.toMatchObject({ code: 'cancelled' });
    expect(disposed.workers[0].terminated).toBe(true);

    vi.useFakeTimers();
    const timed = harness(25);
    const pending = timed.client.run({ encoding: 'Hex', source: 'slow' });
    const rejection = expect(pending).rejects.toMatchObject({ code: 'timeout' });
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(timed.workers[0].terminated).toBe(true);
  });
});
