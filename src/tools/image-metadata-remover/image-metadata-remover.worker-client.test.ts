import { describe, expect, it } from 'vitest';
import { ImageMetadataWorkerClient } from './image-metadata-remover.worker-client';
import type { ImageMetadataTask } from './image-metadata-remover.worker.protocol';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<ImageMetadataTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted?: WorkerTaskRequest<ImageMetadataTask>;
  terminated = false;
  postMessage(message: WorkerTaskRequest<ImageMetadataTask>): void { this.posted = message; }
  terminate(): void { this.terminated = true; }
  emit(data: unknown): void { this.onmessage?.({ data } as MessageEvent<unknown>); }
}

function harness() {
  const workers: FakeWorker[] = [];
  const client = new ImageMetadataWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  });
  return { client, workers };
}

describe('image metadata worker client', () => {
  it('terminates workers after completion, replacement, and disposal', async () => {
    const file = new Blob(['jpeg']);
    const completed = harness();
    const pending = completed.client.run({ file });
    completed.workers[0].emit({
      jobId: 1,
      type: 'result',
      result: { inputBytes: 4, outputBytes: 4, mimeType: 'image/jpeg', removedBytes: 0, removedItems: [], output: new ArrayBuffer(4) },
    });
    await expect(pending).resolves.toMatchObject({ value: { inputBytes: 4 } });
    expect(completed.workers[0].terminated).toBe(true);

    const replaced = harness();
    const first = replaced.client.run({ file });
    const second = replaced.client.run({ file });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.dispose();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[1].terminated).toBe(true);
  });
});
