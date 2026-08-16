import { afterEach, describe, expect, it, vi } from 'vitest';
import { OuiWorkerClient, type OuiWorkerHandle } from './mac-address-lookup.worker-client';
import { type OuiLookupError, type OuiWorkerRequest } from './mac-address-lookup.worker.protocol';

class FakeWorker implements OuiWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: OuiWorkerRequest[] = [];
  terminated = false;
  throwOnPost = false;

  postMessage(message: OuiWorkerRequest): void {
    if (this.throwOnPost) {
      throw new Error('postMessage failed');
    }
    this.posted.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }

  crash(): void {
    this.onerror?.({ preventDefault: vi.fn() } as unknown as ErrorEvent);
  }

  failToDeserialize(): void {
    this.onmessageerror?.({ preventDefault: vi.fn() } as unknown as MessageEvent<unknown>);
  }
}

function createHarness(timeoutMs = 10_000) {
  const workers: FakeWorker[] = [];
  const client = new OuiWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

function lookup(client: OuiWorkerClient, prefix = '203706') {
  return client.lookup({ operation: 'lookup', prefix });
}

async function expectLookupError(promise: Promise<unknown>, code: OuiLookupError['code']): Promise<void> {
  await expect(promise).rejects.toMatchObject({ name: 'OuiLookupError', code });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('OuiWorkerClient', () => {
  it('eagerly starts and reuses one worker for known and unknown vendors', async () => {
    const { client, workers } = createHarness();
    client.start();
    expect(workers).toHaveLength(1);

    const first = lookup(client);
    expect(workers[0].posted[0]).toEqual({ jobId: 1, task: { operation: 'lookup', prefix: '203706' } });
    workers[0].emit({ jobId: 1, type: 'result', operation: 'lookup', value: 'Cisco' });
    await expect(first).resolves.toBe('Cisco');

    const second = lookup(client, '020000');
    workers[0].emit({ jobId: 2, type: 'result', operation: 'lookup', value: null });
    await expect(second).resolves.toBeUndefined();
    expect(workers).toHaveLength(1);
  });

  it('cancels a replaced lookup and ignores a valid stale job result', async () => {
    const { client, workers } = createHarness();
    const stale = lookup(client);
    const staleRejection = expectLookupError(stale, 'cancelled');
    const current = lookup(client, 'F8E43B');

    await staleRejection;
    workers[0].emit({ jobId: 1, type: 'result', operation: 'lookup', value: 'Stale' });
    workers[0].emit({ jobId: 2, type: 'result', operation: 'lookup', value: 'Current' });
    await expect(current).resolves.toBe('Current');
  });

  it('invalidates a crashed or malformed worker and succeeds after explicit retry', async () => {
    const crashed = createHarness();
    const crashedLookup = lookup(crashed.client);
    crashed.workers[0].crash();
    await expectLookupError(crashedLookup, 'worker');
    expect(crashed.workers[0].terminated).toBe(true);
    crashed.client.retry();
    const retried = lookup(crashed.client);
    crashed.workers[1].emit({ jobId: 2, type: 'result', operation: 'lookup', value: 'Recovered' });
    await expect(retried).resolves.toBe('Recovered');

    const malformed = createHarness();
    const malformedLookup = lookup(malformed.client);
    malformed.workers[0].emit({ jobId: 1, type: 'result', operation: 'lookup', value: 42 });
    await expectLookupError(malformedLookup, 'worker');
    expect(malformed.workers[0].terminated).toBe(true);

    const unreadable = createHarness();
    const unreadableLookup = lookup(unreadable.client);
    unreadable.workers[0].failToDeserialize();
    await expectLookupError(unreadableLookup, 'worker');
    expect(unreadable.workers[0].terminated).toBe(true);
  });

  it('treats a missing response job identifier as a worker protocol failure', async () => {
    const { client, workers } = createHarness();
    const pending = lookup(client);

    workers[0].emit({ type: 'result', operation: 'lookup', value: 'Cisco' });

    await expectLookupError(pending, 'worker');
    expect(workers[0].terminated).toBe(true);
  });

  it('returns only sanitized bounded worker error text to the caller', async () => {
    const { client, workers } = createHarness();
    const pending = lookup(client);

    workers[0].emit({
      jobId: 1,
      type: 'error',
      code: 'operation',
      message: '  database\u0000\u202E\uD800 failure  ',
    });

    await expect(pending).rejects.toMatchObject({
      name: 'OuiLookupError',
      code: 'operation',
      message: 'database    failure',
    });
    expect(workers[0].terminated).toBe(false);

    const oversized = lookup(client, 'F8E43B');
    workers[0].emit({
      jobId: 2,
      type: 'error',
      code: 'operation',
      message: 'x'.repeat(1_001),
    });
    await expectLookupError(oversized, 'worker');
    expect(workers[0].terminated).toBe(true);
  });

  it('terminates a timed-out worker and permits a fixed-URL retry', async () => {
    vi.useFakeTimers();
    const { client, workers } = createHarness(25);
    const pending = lookup(client);
    const rejection = expectLookupError(pending, 'timeout');
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(workers[0].terminated).toBe(true);

    client.retry();
    expect(workers).toHaveLength(2);
  });

  it('reports creation and postMessage failures without a synchronous fallback', async () => {
    let attempts = 0;
    const recoveredWorker = new FakeWorker();
    const unavailable = new OuiWorkerClient(() => {
      attempts += 1;
      if (attempts === 1) {
        throw new Error('unavailable');
      }
      return recoveredWorker;
    });
    unavailable.start();
    await expectLookupError(lookup(unavailable), 'unavailable');
    unavailable.retry();
    expect(attempts).toBe(2);

    const failedPostWorker = new FakeWorker();
    failedPostWorker.throwOnPost = true;
    const failedPost = new OuiWorkerClient(() => failedPostWorker);
    await expectLookupError(lookup(failedPost), 'worker');
    expect(failedPostWorker.terminated).toBe(true);
  });

  it('validates before worker allocation and terminates an idle worker on dispose', async () => {
    const { client, workers } = createHarness();
    await expectLookupError(lookup(client, 'bad'), 'validation');
    expect(workers).toHaveLength(0);

    client.start();
    client.dispose();
    expect(workers[0].terminated).toBe(true);
    await expectLookupError(lookup(client), 'unavailable');
  });

  it('rejects invalid timeout configuration before allocating a worker', () => {
    expect(() => createHarness(0)).toThrow(RangeError);
    expect(() => createHarness(Number.NaN)).toThrow(RangeError);
  });
});
