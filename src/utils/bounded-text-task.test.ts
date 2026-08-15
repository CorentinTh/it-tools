import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  BoundedTextTaskError,
  BoundedTextWorkerClient,
  type BoundedTextWorkerMessage,
} from './bounded-text-task';
import type { WorkerTaskHandle } from './worker-task';
import type { WorkerTaskRequest } from './worker-protocol';

interface Task { source: string }

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<Task>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;

  postMessage(): void {}
  terminate(): void { this.terminated = true; }
  emit(message: BoundedTextWorkerMessage): void { this.onmessage?.({ data: message } as MessageEvent<unknown>); }
}

const errorMessages = {
  'validation': 'invalid',
  'input-limit': 'too large',
  'output-limit': 'output too large',
  'processing': 'failed',
};

function harness(timeoutMs = 1_000) {
  const workers: FakeWorker[] = [];
  const client = new BoundedTextWorkerClient<Task>({
    errorMessages,
    maxOutputBytes: 100,
    taskName: 'test transform',
    timeoutMs,
    validateTask: (value) => {
      if (typeof value !== 'object' || value === null || !('source' in value) || typeof value.source !== 'string') {
        throw new BoundedTextTaskError('validation', errorMessages.validation);
      }
      return { source: value.source };
    },
    workerFactory: () => {
      const worker = new FakeWorker();
      workers.push(worker);
      return worker;
    },
  });
  return { client, workers };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('BoundedTextWorkerClient', () => {
  it('terminates after success and replacement', async () => {
    const { client, workers } = harness();
    const first = client.run({ source: 'first' });
    const second = client.run({ source: 'second' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(workers[0].terminated).toBe(true);

    workers[1].emit({ jobId: 2, type: 'result', result: { byteLength: 2, value: 'ok' } });
    await expect(second).resolves.toMatchObject({ value: 'ok' });
    expect(workers[1].terminated).toBe(true);
  });

  it('physically terminates at the deadline', async () => {
    vi.useFakeTimers();
    const { client, workers } = harness(25);
    const pending = client.run({ source: 'slow' });
    const rejection = expect(pending).rejects.toMatchObject({ code: 'timeout' });
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(workers[0].terminated).toBe(true);
  });

  it('fails closed on an invalid worker envelope', async () => {
    const { client, workers } = harness();
    const pending = client.run({ source: 'value' });
    workers[0].emit({ jobId: 1, type: 'result', result: { byteLength: 1, value: 'wrong' } });
    await expect(pending).rejects.toMatchObject({ code: 'worker' });
  });
});
