import { afterEach, describe, expect, it, vi } from 'vitest';
import { BcryptWorkerClient, type BcryptWorkerHandle } from './bcrypt.worker-client';
import { BcryptTaskError, type BcryptWorkerRequest } from './bcrypt.worker.protocol';

const VALID_HASH = '$2a$04$ZO/2lWFV.hnClD.GPEoHTO8tMHsQCK7tpnz3QP/lZSDpbF5N7ZI8C';

class FakeWorker implements BcryptWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  postedMessages: BcryptWorkerRequest[] = [];
  terminateCount = 0;

  postMessage(message: BcryptWorkerRequest): void {
    this.postedMessages.push(message);
  }

  terminate(): void {
    this.terminateCount += 1;
  }

  emit(data: unknown): void {
    this.onmessage?.(new MessageEvent('message', { data }));
  }

  fail(): void {
    this.onerror?.(new ErrorEvent('error'));
  }
}

function createHarness(timeoutMs = 10_000) {
  const workers: FakeWorker[] = [];
  const client = new BcryptWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);

  return { client, workers };
}

async function rejectedError(promise: Promise<unknown>): Promise<BcryptTaskError> {
  try {
    await promise;
    throw new Error('Expected the promise to reject.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(BcryptTaskError);
    return error as BcryptTaskError;
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe('BcryptWorkerClient', () => {
  it('routes progress and a typed result for the active job', async () => {
    const { client, workers } = createHarness();
    const progress: number[] = [];
    const resultPromise = client.run(
      { operation: 'hash', value: 'secret', rounds: 4 },
      value => progress.push(value),
    );

    expect(workers).toHaveLength(1);
    expect(workers[0].postedMessages).toEqual([{
      jobId: 1,
      task: { operation: 'hash', value: 'secret', rounds: 4 },
    }]);

    workers[0].emit({ jobId: 1, type: 'progress', progress: 0.5 });
    workers[0].emit({ jobId: 1, type: 'result', operation: 'hash', value: VALID_HASH });

    await expect(resultPromise).resolves.toMatchObject({ value: VALID_HASH });
    expect(progress).toEqual([0.5]);
    expect(workers[0].terminateCount).toBe(1);
  });

  it('terminates a stale job when a newer operation starts', async () => {
    const { client, workers } = createHarness();
    const firstResult = rejectedError(client.run({ operation: 'hash', value: 'first', rounds: 4 }));

    const secondResult = client.run({ operation: 'hash', value: 'second', rounds: 4 });
    expect((await firstResult).code).toBe('cancelled');
    expect(workers[0].terminateCount).toBe(1);
    expect(workers).toHaveLength(2);

    workers[0].emit({ jobId: 1, type: 'result', operation: 'hash', value: 'stale' });
    workers[1].emit({ jobId: 2, type: 'result', operation: 'hash', value: VALID_HASH });

    await expect(secondResult).resolves.toMatchObject({ value: VALID_HASH });
  });

  it('provides explicit cancellation and disposal boundaries', async () => {
    const { client, workers } = createHarness();
    const cancelled = rejectedError(client.run({ operation: 'compare', value: 'secret', hash: VALID_HASH }));
    client.cancel();

    expect((await cancelled).code).toBe('cancelled');
    expect(workers[0].terminateCount).toBe(1);

    const disposed = rejectedError(client.run({ operation: 'compare', value: 'secret', hash: VALID_HASH }));
    client.dispose();
    expect((await disposed).code).toBe('cancelled');
    expect(workers[1].terminateCount).toBe(1);
  });

  it('terminates a job at the hard deadline', async () => {
    vi.useFakeTimers();
    const { client, workers } = createHarness(50);
    const result = rejectedError(client.run({ operation: 'hash', value: 'secret', rounds: 4 }));

    await vi.advanceTimersByTimeAsync(51);

    const error = await result;
    expect(error.code).toBe('timeout');
    expect(error.message).toContain('time limit');
    expect(workers[0].terminateCount).toBe(1);
  });

  it('fails closed on malformed messages and worker failures', async () => {
    const malformedHarness = createHarness();
    const malformedResult = rejectedError(malformedHarness.client.run({ operation: 'hash', value: 'secret', rounds: 4 }));
    malformedHarness.workers[0].emit({ jobId: 1, type: 'progress', progress: 2 });
    expect((await malformedResult).code).toBe('worker');
    expect(malformedHarness.workers[0].terminateCount).toBe(1);

    const failedHarness = createHarness();
    const failedResult = rejectedError(failedHarness.client.run({ operation: 'hash', value: 'secret', rounds: 4 }));
    failedHarness.workers[0].fail();
    expect((await failedResult).code).toBe('worker');
    expect(failedHarness.workers[0].terminateCount).toBe(1);
  });

  it('does not expose oversized or unsafe worker error text', async () => {
    const oversizedHarness = createHarness();
    const oversizedResult = rejectedError(
      oversizedHarness.client.run({ operation: 'hash', value: 'secret', rounds: 4 }),
    );
    oversizedHarness.workers[0].emit({
      jobId: 1,
      type: 'error',
      code: 'operation',
      message: 'x'.repeat(1_001),
    });

    const oversizedError = await oversizedResult;
    expect(oversizedError.code).toBe('worker');
    expect(oversizedError.message.length).toBeLessThanOrEqual(1_000);

    const unsafeHarness = createHarness();
    const unsafeResult = rejectedError(
      unsafeHarness.client.run({ operation: 'hash', value: 'secret', rounds: 4 }),
    );
    unsafeHarness.workers[0].emit({
      jobId: 1,
      type: 'error',
      code: 'operation',
      message: '\u0000Local failure\u0007',
    });

    const unsafeError = await unsafeResult;
    expect(unsafeError.code).toBe('operation');
    expect(unsafeError.message).toBe('Local failure');
  });

  it('rejects malformed tasks without creating or replacing a worker', async () => {
    const { client, workers } = createHarness();
    const activeResult = client.run({ operation: 'hash', value: 'secret', rounds: 4 });
    const invalidResult = rejectedError(client.run({ operation: 'hash', value: 'secret', rounds: 100 }));

    expect((await invalidResult).code).toBe('validation');
    expect(workers).toHaveLength(1);
    expect(workers[0].terminateCount).toBe(0);

    workers[0].emit({ jobId: 1, type: 'result', operation: 'hash', value: VALID_HASH });
    await expect(activeResult).resolves.toMatchObject({ value: VALID_HASH });
  });

  it('rejects a result for the wrong operation', async () => {
    const { client, workers } = createHarness();
    const result = rejectedError(client.run({ operation: 'hash', value: 'secret', rounds: 4 }));
    workers[0].emit({ jobId: 1, type: 'result', operation: 'compare', value: true });

    expect((await result).code).toBe('worker');
  });
});
