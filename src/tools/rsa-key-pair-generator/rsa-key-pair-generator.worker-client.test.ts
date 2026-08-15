import { afterEach, describe, expect, it, vi } from 'vitest';
import { RsaWorkerClient, type RsaWorkerHandle } from './rsa-key-pair-generator.worker-client';
import type { RsaTaskError, RsaWorkerRequest } from './rsa-key-pair-generator.worker.protocol';

class FakeWorker implements RsaWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: RsaWorkerRequest[] = [];
  terminated = false;

  postMessage(message: RsaWorkerRequest): void {
    this.posted.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

const pair = {
  bits: 2048 as const,
  publicKeyPem: '-----BEGIN PUBLIC KEY-----\nAQID\n-----END PUBLIC KEY-----\n',
  privateKeyPem: '-----BEGIN PRIVATE KEY-----\nBAUG\n-----END PRIVATE KEY-----\n',
};

function createHarness(timeoutMs = 30_000) {
  const workers: FakeWorker[] = [];
  const client = new RsaWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

async function expectTaskError(promise: Promise<unknown>, code: RsaTaskError['code']): Promise<void> {
  await expect(promise).rejects.toMatchObject({ name: 'RsaTaskError', code });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('RsaWorkerClient', () => {
  it('resolves exact output and terminates the worker', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run({ bits: 2048 });

    expect(workers[0].posted).toEqual([{ jobId: 1, task: { bits: 2048 } }]);
    workers[0].emit({ jobId: 1, type: 'result', result: pair });

    await expect(resultPromise).resolves.toMatchObject({ value: pair });
    expect(workers[0].terminated).toBe(true);
  });

  it('physically terminates active work on cancel and dispose', async () => {
    const cancelled = createHarness();
    const cancelledPromise = cancelled.client.run({ bits: 4096 });
    cancelled.client.cancel();
    await expectTaskError(cancelledPromise, 'cancelled');
    expect(cancelled.workers[0].terminated).toBe(true);

    const disposed = createHarness();
    const disposedPromise = disposed.client.run({ bits: 3072 });
    disposed.client.dispose();
    await expectTaskError(disposedPromise, 'cancelled');
    expect(disposed.workers[0].terminated).toBe(true);
    await expectTaskError(disposed.client.run({ bits: 2048 }), 'unavailable');
  });

  it('terminates work at the hard deadline', async () => {
    vi.useFakeTimers();
    const { client, workers } = createHarness(25);
    const resultPromise = client.run({ bits: 4096 });
    const rejection = expectTaskError(resultPromise, 'timeout');

    await vi.advanceTimersByTimeAsync(25);

    await rejection;
    expect(workers[0].terminated).toBe(true);
  });

  it('rejects invalid work before allocating a worker and fails closed on wrong-size output', async () => {
    const { client, workers } = createHarness();
    await expectTaskError(client.run({ bits: 1024 as 2048 }), 'validation');
    expect(workers).toHaveLength(0);

    const resultPromise = client.run({ bits: 2048 });
    workers[0].emit({ jobId: 1, type: 'result', result: { ...pair, bits: 3072 } });
    await expectTaskError(resultPromise, 'worker');
    expect(workers[0].terminated).toBe(true);
  });
});
