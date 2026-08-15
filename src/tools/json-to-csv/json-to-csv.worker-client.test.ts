import { afterEach, describe, expect, it, vi } from 'vitest';
import { createJsonToCsvWorkerClient } from './json-to-csv.worker-client';
import type { JsonToCsvTask } from './json-to-csv.worker.protocol';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<JsonToCsvTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted?: WorkerTaskRequest<JsonToCsvTask>;
  terminated = false;

  postMessage(message: WorkerTaskRequest<JsonToCsvTask>): void {
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
  const client = createJsonToCsvWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('JSON-to-CSV worker client', () => {
  it('uses an exact envelope, accepts a bounded result, and terminates', async () => {
    const { client, workers } = harness();
    const pending = client.run({ source: '[{a:1}]' });
    expect(workers[0].posted).toEqual({ jobId: 1, task: { source: '[{a:1}]' } });
    workers[0].emit({ jobId: 1, type: 'result', result: { byteLength: 3, value: 'a\n1' } });
    await expect(pending).resolves.toMatchObject({ value: 'a\n1' });
    expect(workers[0].terminated).toBe(true);
  });

  it('physically terminates replacement, cancellation, disposal, and timeout', async () => {
    const replaced = harness();
    const first = replaced.client.run({ source: '[{a:1}]' });
    const second = replaced.client.run({ source: '[{a:2}]' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.cancel();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });

    const disposed = harness();
    const closing = disposed.client.run({ source: '[{a:1}]' });
    disposed.client.dispose();
    await expect(closing).rejects.toMatchObject({ code: 'cancelled' });
    expect(disposed.workers[0].terminated).toBe(true);

    vi.useFakeTimers();
    const timed = harness(25);
    const pending = timed.client.run({ source: '[{a:1}]' });
    const rejection = expect(pending).rejects.toMatchObject({ code: 'timeout' });
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(timed.workers[0].terminated).toBe(true);
  });
});
