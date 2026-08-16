import { describe, expect, it } from 'vitest';
import { Argon2idWorkerClient } from './argon2id.worker-client';
import type { Argon2idTask } from './argon2id.worker.protocol';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<Argon2idTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  postMessage(_message: WorkerTaskRequest<Argon2idTask>): void {}
  terminate(): void { this.terminated = true; }
  emit(data: unknown): void { this.onmessage?.({ data } as MessageEvent<unknown>); }
}

const task: Argon2idTask = { operation: 'hash', password: 'secret', salt: new Uint8Array(16), memoryKiB: 32, iterations: 1, parallelism: 1, hashLength: 16 };
const phc = '$argon2id$v=19$m=32,t=1,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAA';

function harness() {
  const workers: FakeWorker[] = [];
  const client = new Argon2idWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  });
  return { client, workers };
}

describe('Argon2id worker client lifecycle', () => {
  it('physically terminates completion, replacement, and disposal', async () => {
    const completed = harness();
    const pending = completed.client.run(task);
    completed.workers[0].emit({ jobId: 1, type: 'result', result: { operation: 'hash', phc, memoryKiB: 32, iterations: 1, parallelism: 1, hashLength: 16 } });
    await expect(pending).resolves.toMatchObject({ value: { operation: 'hash', phc } });
    expect(completed.workers[0].terminated).toBe(true);

    const replaced = harness();
    const first = replaced.client.run(task);
    const second = replaced.client.run({ ...task, password: 'replacement' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.dispose();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[1].terminated).toBe(true);
  });
});
