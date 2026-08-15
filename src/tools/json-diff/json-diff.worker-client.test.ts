import { afterEach, describe, expect, it, vi } from 'vitest';
import { JsonDiffWorkerClient, type JsonDiffWorkerHandle } from './json-diff.worker-client';
import type { JsonDiffTaskError, JsonDiffWorkerRequest } from './json-diff.worker.protocol';

class FakeWorker implements JsonDiffWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: JsonDiffWorkerRequest[] = [];
  terminated = false;

  postMessage(message: JsonDiffWorkerRequest): void {
    this.posted.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

const task = { alignArrays: true, left: '{}', onlyShowDifferences: false, right: '{}' };
const report = {
  difference: {
    key: '',
    type: 'object' as const,
    children: [],
    nodeCount: 1,
    oldValue: {},
    value: {},
    status: 'unchanged' as const,
  },
  inputNodeCount: 2,
  outputNodeCount: 1,
  maxDepth: 0,
  alignments: { index: 0, key: 0, lcs: 0 },
};

function harness(timeoutMs = 8_000) {
  const workers: FakeWorker[] = [];
  const client = new JsonDiffWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

async function expectTaskError(promise: Promise<unknown>, code: JsonDiffTaskError['code']): Promise<void> {
  await expect(promise).rejects.toMatchObject({ name: 'JsonDiffTaskError', code });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('JsonDiffWorkerClient', () => {
  it('resolves a valid report and terminates its worker', async () => {
    const { client, workers } = harness();
    const resultPromise = client.run(task);
    workers[0].emit({ jobId: 1, type: 'result', result: report });

    await expect(resultPromise).resolves.toMatchObject({ value: report });
    expect(workers[0].terminated).toBe(true);
  });

  it('terminates work on replacement, cancel, and timeout', async () => {
    const replaced = harness();
    const first = replaced.client.run(task);
    const second = replaced.client.run({ ...task, right: '{a:1}' });
    await expectTaskError(first, 'cancelled');
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.cancel();
    await expectTaskError(second, 'cancelled');

    vi.useFakeTimers();
    const timed = harness(25);
    const pending = timed.client.run(task);
    const rejection = expectTaskError(pending, 'timeout');
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(timed.workers[0].terminated).toBe(true);
  });

  it('rejects invalid input before allocating a worker', async () => {
    const { client, workers } = harness();
    await expectTaskError(client.run({ ...task, left: '' }), 'validation');
    expect(workers).toHaveLength(0);
  });
});
