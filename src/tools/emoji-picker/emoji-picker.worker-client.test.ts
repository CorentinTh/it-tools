import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEmojiSearchWorkerClient } from './emoji-picker.worker-client';
import type { EmojiSearchTask } from './emoji-picker.worker.protocol';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<EmojiSearchTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted?: WorkerTaskRequest<EmojiSearchTask>;
  terminated = false;

  postMessage(message: WorkerTaskRequest<EmojiSearchTask>): void {
    this.posted = message;
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

function harness(timeoutMs = 3_000) {
  const workers: FakeWorker[] = [];
  const client = createEmojiSearchWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('Emoji search worker client', () => {
  it('uses the exact envelope, validates the ranked result, and terminates', async () => {
    const { client, workers } = harness();
    const pending = client.search('face');
    expect(workers[0].posted).toEqual({ jobId: 1, task: { query: 'face' } });

    const value = '["😀","🙂"]';
    workers[0].emit({
      jobId: 1,
      type: 'result',
      result: { byteLength: new TextEncoder().encode(value).byteLength, value },
    });

    await expect(pending).resolves.toMatchObject({ value: ['😀', '🙂'] });
    expect(workers[0].terminated).toBe(true);
  });

  it('physically terminates replacement, cancellation, disposal, and timeout', async () => {
    const replaced = harness();
    const first = replaced.client.search('face');
    const second = replaced.client.search('flag');
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.cancel();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });

    const disposed = harness();
    const closing = disposed.client.search('face');
    disposed.client.dispose();
    await expect(closing).rejects.toMatchObject({ code: 'cancelled' });
    expect(disposed.workers[0].terminated).toBe(true);

    vi.useFakeTimers();
    const timed = harness(25);
    const pending = timed.client.search('face');
    const rejection = expect(pending).rejects.toMatchObject({ code: 'timeout' });
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(timed.workers[0].terminated).toBe(true);
  });
});
