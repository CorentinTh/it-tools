import { describe, expect, it } from 'vitest';
import type { MarkdownDiffTask } from './markdown-diff.service';
import { createMarkdownDiffWorkerClient } from './markdown-diff.worker-client';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<MarkdownDiffTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  postMessage(_message: WorkerTaskRequest<MarkdownDiffTask>): void {}
  terminate(): void { this.terminated = true; }
  emit(data: unknown): void { this.onmessage?.({ data } as MessageEvent<unknown>); }
}

const task: MarkdownDiffTask = { left: '# Old', right: '# New', granularity: 'line' };

function harness() {
  const workers: FakeWorker[] = [];
  const client = createMarkdownDiffWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  });
  return { client, workers };
}

describe('Markdown diff worker client lifecycle', () => {
  it('physically terminates completion, replacement, malformed output, and disposal', async () => {
    const completed = harness();
    const pending = completed.client.run(task);
    completed.workers[0].emit({ jobId: 1, type: 'result', result: { byteLength: 6, value: 'result' } });
    await expect(pending).resolves.toMatchObject({ value: 'result' });
    expect(completed.workers[0].terminated).toBe(true);

    const replaced = harness();
    const first = replaced.client.run(task);
    const second = replaced.client.run({ ...task, right: '# Replacement' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.workers[1].emit({ jobId: 2, type: 'result', result: { byteLength: 1, value: 'x', extra: 'secret' } });
    await expect(second).rejects.toMatchObject({ code: 'worker' });
    expect(replaced.workers[1].terminated).toBe(true);

    const disposed = harness();
    const disposing = disposed.client.run(task);
    disposed.client.dispose();
    await expect(disposing).rejects.toMatchObject({ code: 'cancelled' });
    expect(disposed.workers[0].terminated).toBe(true);
  });
});
