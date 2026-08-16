import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ListComparisonTask } from './list-comparison.service';
import { createListComparisonWorkerClient } from './list-comparison.worker-client';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<ListComparisonTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  posted?: WorkerTaskRequest<ListComparisonTask>;
  postMessage(message: WorkerTaskRequest<ListComparisonTask>): void { this.posted = message; }
  terminate(): void { this.terminated = true; }
  emit(data: unknown): void { this.onmessage?.({ data } as MessageEvent<unknown>); }
}

function harness() {
  const workers: FakeWorker[] = [];
  const client = createListComparisonWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  });
  return { client, workers };
}

const task: ListComparisonTask = { left: 'a\nb', right: 'b\nc', mode: 'set', trimItems: true, ignoreCase: false, ignoreEmpty: true };

afterEach(() => {
  vi.useRealTimers();
});

describe('list comparison worker client', () => {
  it('settles valid output and physically terminates completion, replacement, and disposal', async () => {
    const completed = harness();
    const pending = completed.client.run(task);
    expect(completed.workers[0].posted).toEqual({ jobId: 1, task });
    completed.workers[0].emit({ jobId: 1, type: 'result', result: { byteLength: 6, value: 'report' } });
    await expect(pending).resolves.toMatchObject({ value: 'report' });
    expect(completed.workers[0].terminated).toBe(true);

    const replaced = harness();
    const first = replaced.client.run(task);
    const second = replaced.client.run({ ...task, mode: 'multiset' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.dispose();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[1].terminated).toBe(true);
  });
});
