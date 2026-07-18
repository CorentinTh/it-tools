import { afterEach, describe, expect, it, vi } from 'vitest';
import { RegexWorkerClient, type RegexWorkerHandle } from './regex-tester.worker-client';
import type { RegexTaskError } from './regex-tester.worker.protocol';

class FakeWorker implements RegexWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: unknown[] = [];
  terminated = false;

  postMessage(message: unknown): void {
    this.posted.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

function createHarness(timeoutMs = 1_200) {
  const workers: FakeWorker[] = [];
  const client = new RegexWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);

  return { client, workers };
}

async function expectTaskError(promise: Promise<unknown>, code: RegexTaskError['code']): Promise<void> {
  await expect(promise).rejects.toMatchObject({ name: 'RegexTaskError', code });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('RegexWorkerClient', () => {
  it('resolves a matching job and always terminates its worker', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run({ operation: 'match', pattern: '(a)?b', text: 'b', flags: 'dg' });

    expect(workers[0].posted).toEqual([{
      jobId: 1,
      task: { operation: 'match', pattern: '(a)?b', text: 'b', flags: 'dg' },
    }]);
    workers[0].emit({
      jobId: 1,
      type: 'result',
      operation: 'match',
      value: {
        matches: [{
          index: 0,
          value: 'b',
          captures: [{ name: '1', value: undefined, start: undefined, end: undefined }],
          groups: [],
        }],
        truncated: false,
      },
    });

    await expect(resultPromise).resolves.toMatchObject({
      value: { matches: [{ value: 'b', captures: [{ value: undefined }] }], truncated: false },
    });
    expect(workers[0].terminated).toBe(true);
  });

  it('cancels and terminates the previous job before starting a replacement', async () => {
    const { client, workers } = createHarness();
    const stalePromise = client.run({ operation: 'sample', pattern: 'a+', flags: '' });
    const currentPromise = client.run({ operation: 'sample', pattern: 'b+', flags: '' });

    await expectTaskError(stalePromise, 'cancelled');
    expect(workers[0].terminated).toBe(true);
    workers[0].emit({ jobId: 1, type: 'result', operation: 'sample', value: 'stale' });
    workers[1].emit({ jobId: 2, type: 'result', operation: 'sample', value: 'bbb' });

    await expect(currentPromise).resolves.toMatchObject({ value: 'bbb' });
  });

  it('ignores messages carrying a stale job identifier', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run({ operation: 'sample', pattern: 'a', flags: '' });

    workers[0].emit({ jobId: 999, type: 'result', operation: 'sample', value: 'stale' });
    workers[0].emit({ jobId: 1, type: 'result', operation: 'sample', value: 'a' });

    await expect(resultPromise).resolves.toMatchObject({ value: 'a' });
  });

  it('hard-terminates a worker after the deadline', async () => {
    vi.useFakeTimers();
    const { client, workers } = createHarness(25);
    const resultPromise = client.run({ operation: 'match', pattern: '(a+)+$', text: `${'a'.repeat(100)}!`, flags: 'dg' });
    const rejection = expectTaskError(resultPromise, 'timeout');

    await vi.advanceTimersByTimeAsync(25);

    await rejection;
    expect(workers[0].terminated).toBe(true);
  });

  it('fails closed on malformed messages and worker errors', async () => {
    const malformedHarness = createHarness();
    const malformedPromise = malformedHarness.client.run({ operation: 'sample', pattern: 'a', flags: '' });
    malformedHarness.workers[0].emit({ jobId: 1, type: 'result', operation: 'sample', value: 42 });
    await expectTaskError(malformedPromise, 'worker');
    expect(malformedHarness.workers[0].terminated).toBe(true);

    const crashedHarness = createHarness();
    const crashedPromise = crashedHarness.client.run({ operation: 'sample', pattern: 'a', flags: '' });
    const preventDefault = vi.fn();
    crashedHarness.workers[0].onerror?.({ preventDefault } as unknown as ErrorEvent);
    await expectTaskError(crashedPromise, 'worker');
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('rejects invalid tasks before allocating a worker and disposes active work', async () => {
    const { client, workers } = createHarness();
    await expectTaskError(client.run({ operation: 'sample', pattern: '(', flags: '' }), 'syntax');
    expect(workers).toHaveLength(0);

    const activePromise = client.run({ operation: 'sample', pattern: 'a', flags: '' });
    client.dispose();
    await expectTaskError(activePromise, 'cancelled');
    expect(workers[0].terminated).toBe(true);
  });

  it('cancels active work even when its replacement is invalid', async () => {
    const { client, workers } = createHarness();
    const activePromise = client.run({ operation: 'sample', pattern: 'a+', flags: '' });
    const activeRejection = expectTaskError(activePromise, 'cancelled');

    await expectTaskError(client.run({ operation: 'sample', pattern: '(', flags: '' }), 'syntax');
    await activeRejection;
    expect(workers[0].terminated).toBe(true);
    expect(workers).toHaveLength(1);
  });
});
