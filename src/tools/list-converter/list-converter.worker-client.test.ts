import { afterEach, describe, expect, it, vi } from 'vitest';
import { createListConverterWorkerClient } from './list-converter.worker-client';
import type { ListConverterTask } from './list-converter.worker.protocol';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<ListConverterTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  posted?: WorkerTaskRequest<ListConverterTask>;
  postMessage(message: WorkerTaskRequest<ListConverterTask>): void { this.posted = message; }
  terminate(): void { this.terminated = true; }
  emit(data: unknown): void { this.onmessage?.({ data } as MessageEvent<unknown>); }
}

const options: ListConverterTask['options'] = {
  itemPrefix: '',
  itemSuffix: '',
  keepLineBreaks: false,
  listPrefix: '',
  listSuffix: '',
  lowerCase: false,
  removeDuplicates: true,
  reverseList: false,
  separator: ', ',
  sortList: null,
  trimItems: true,
};

function harness(timeoutMs = 5_000) {
  const workers: FakeWorker[] = [];
  const client = createListConverterWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('List Converter worker client', () => {
  it('settles strict results and physically terminates lifecycle paths', async () => {
    const completed = harness();
    const pending = completed.client.run({ options, source: 'a\nb' });
    expect(completed.workers[0].posted).toEqual({ jobId: 1, task: { options, source: 'a\nb' } });
    completed.workers[0].emit({ jobId: 1, type: 'result', result: { byteLength: 4, value: 'a, b' } });
    await expect(pending).resolves.toMatchObject({ value: 'a, b' });
    expect(completed.workers[0].terminated).toBe(true);

    const replaced = harness();
    const first = replaced.client.run({ options, source: 'first' });
    const second = replaced.client.run({ options, source: 'second' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.dispose();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });

    vi.useFakeTimers();
    const timed = harness(25);
    const slow = timed.client.run({ options, source: 'slow' });
    const rejection = expect(slow).rejects.toMatchObject({ code: 'timeout' });
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(timed.workers[0].terminated).toBe(true);
  });
});
