import { afterEach, describe, expect, it, vi } from 'vitest';
import { DockerConverterWorkerClient } from './docker-converter.worker-client';
import type { DockerConverterWorkerRequest } from './docker-converter.worker.protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

class FakeWorker implements WorkerTaskHandle<DockerConverterWorkerRequest> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  terminated = false;

  postMessage(_message: DockerConverterWorkerRequest): void {}

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

function harness(timeoutMs = 4_000) {
  const workers: FakeWorker[] = [];
  const client = new DockerConverterWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('DockerConverterWorkerClient', () => {
  it('decodes a strict result and terminates the worker', async () => {
    const { client, workers } = harness();
    const pending = client.run({ direction: 'run-to-compose', source: 'docker run nginx' });
    workers[0].emit({
      jobId: 1,
      type: 'result',
      result: {
        yaml: { value: 'services:\n', byteLength: 10 },
        messages: [{ type: 'notTranslatable', value: 'notice', byteLength: 6 }],
      },
    });

    await expect(pending).resolves.toMatchObject({
      value: { yaml: 'services:\n', messages: [{ type: 'notTranslatable', value: 'notice' }] },
    });
    expect(workers[0].terminated).toBe(true);
  });

  it('physically terminates replacement, cancellation, and timeout', async () => {
    const replaced = harness();
    const first = replaced.client.run({ direction: 'run-to-compose', source: 'docker run nginx' });
    const second = replaced.client.run({ direction: 'run-to-compose', source: 'docker run alpine' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.cancel();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });

    vi.useFakeTimers();
    const timed = harness(25);
    const pending = timed.client.run({ direction: 'run-to-compose', source: 'docker run nginx' });
    const rejection = expect(pending).rejects.toMatchObject({ code: 'timeout' });
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(timed.workers[0].terminated).toBe(true);
  });
});
