import { describe, expect, it } from 'vitest';
import type { AesEnvelopeTask } from './aes-gcm-envelope.worker.protocol';
import { AesEnvelopeWorkerClient } from './aes-gcm-envelope.worker-client';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<AesEnvelopeTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;
  postMessage(_message: WorkerTaskRequest<AesEnvelopeTask>): void {}
  terminate(): void { this.terminated = true; }
  emit(data: unknown): void { this.onmessage?.({ data } as MessageEvent<unknown>); }
}

function harness() {
  const workers: FakeWorker[] = [];
  const client = new AesEnvelopeWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  });
  return { client, workers };
}

const task: AesEnvelopeTask = { operation: 'encrypt-text', passphrase: 'correct horse battery staple', text: 'hello' };

describe('AES-GCM worker client', () => {
  it('physically terminates completion, replacement, and disposal', async () => {
    const completed = harness();
    const pending = completed.client.run(task);
    completed.workers[0].emit({ jobId: 1, type: 'result', result: { kind: 'encrypted-text', inputBytes: 5, outputBytes: 75, base64: 'A'.repeat(100) } });
    await expect(pending).resolves.toMatchObject({ value: { kind: 'encrypted-text' } });
    expect(completed.workers[0].terminated).toBe(true);

    const replaced = harness();
    const first = replaced.client.run(task);
    const second = replaced.client.run({ ...task, text: 'new' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.dispose();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[1].terminated).toBe(true);
  });
});
