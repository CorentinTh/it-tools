import { afterEach, describe, expect, it, vi } from 'vitest';
import { JsonWorkerClient, type JsonWorkerHandle } from './json-viewer.worker-client';
import {
  JSON_MAX_INPUT_BYTES,
  type JsonTaskError,
  type JsonWorkerRequest,
} from './json-viewer.worker.protocol';

class FakeWorker implements JsonWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: unknown[] = [];
  terminated = false;

  postMessage(message: JsonWorkerRequest): void {
    this.posted.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

function createHarness(timeoutMs = 5_000) {
  const workers: FakeWorker[] = [];
  const client = new JsonWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);

  return { client, workers };
}

function task(source = '{"hello":"world"}') {
  return {
    operation: 'format' as const,
    source,
    indentSize: 2,
    sortKeys: false,
    mode: 'strict' as const,
  };
}

function result(jobId: number, value: string, mode: 'strict' | 'json5' = 'strict') {
  return {
    jobId,
    type: 'result' as const,
    operation: 'format' as const,
    mode,
    value,
    outputBytes: new TextEncoder().encode(value).byteLength,
  };
}

async function expectTaskError(promise: Promise<unknown>, code: JsonTaskError['code']): Promise<void> {
  await expect(promise).rejects.toMatchObject({ name: 'JsonTaskError', code });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('JsonWorkerClient', () => {
  it('resolves a matching job and always terminates its worker', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task());

    expect(workers[0].posted).toEqual([{ jobId: 1, task: task() }]);
    workers[0].emit(result(1, '{"hello":"world"}'));

    await expect(resultPromise).resolves.toMatchObject({ value: '{"hello":"world"}' });
    expect(workers[0].terminated).toBe(true);
  });

  it('terminates a previous job and ignores stale job identifiers', async () => {
    const { client, workers } = createHarness();
    const stalePromise = client.run(task('{"first":true}'));
    const currentPromise = client.run(task('{"second":true}'));

    await expectTaskError(stalePromise, 'cancelled');
    expect(workers[0].terminated).toBe(true);
    workers[0].emit(result(1, 'stale'));
    workers[1].emit(result(999, 'wrong', 'json5'));
    workers[1].emit(result(2, '{"second":true}'));

    await expect(currentPromise).resolves.toMatchObject({ value: '{"second":true}' });
  });

  it('hard-terminates work after the deadline', async () => {
    vi.useFakeTimers();
    const { client, workers } = createHarness(25);
    const resultPromise = client.run(task());
    const rejection = expectTaskError(resultPromise, 'timeout');

    await vi.advanceTimersByTimeAsync(25);

    await rejection;
    expect(workers[0].terminated).toBe(true);
  });

  it('fails closed on malformed messages, wrong modes, and worker crashes', async () => {
    const malformedHarness = createHarness();
    const malformedPromise = malformedHarness.client.run(task());
    malformedHarness.workers[0].emit({
      jobId: 1,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: 42,
      outputBytes: 2,
    });
    await expectTaskError(malformedPromise, 'worker');
    expect(malformedHarness.workers[0].terminated).toBe(true);

    const wrongModeHarness = createHarness();
    const wrongModePromise = wrongModeHarness.client.run(task());
    wrongModeHarness.workers[0].emit(result(1, '{}', 'json5'));
    await expectTaskError(wrongModePromise, 'worker');

    const missingMetadataHarness = createHarness();
    const missingMetadataPromise = missingMetadataHarness.client.run(task());
    missingMetadataHarness.workers[0].emit({
      jobId: 1,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: '{}',
    });
    await expectTaskError(missingMetadataPromise, 'worker');

    const crashedHarness = createHarness();
    const crashedPromise = crashedHarness.client.run(task());
    const preventDefault = vi.fn();
    crashedHarness.workers[0].onerror?.({ preventDefault } as unknown as ErrorEvent);
    await expectTaskError(crashedPromise, 'worker');
    expect(preventDefault).toHaveBeenCalledOnce();
  });

  it('rejects invalid work before allocating a worker and disposes active work', async () => {
    const { client, workers } = createHarness();
    await expectTaskError(client.run(task('x'.repeat(JSON_MAX_INPUT_BYTES + 1))), 'limit');
    expect(workers).toHaveLength(0);

    const activePromise = client.run(task());
    client.dispose();
    await expectTaskError(activePromise, 'cancelled');
    expect(workers[0].terminated).toBe(true);
  });

  it('cancels active work before rejecting an invalid replacement', async () => {
    const { client, workers } = createHarness();
    const activePromise = client.run(task());
    const activeRejection = expectTaskError(activePromise, 'cancelled');

    await expectTaskError(client.run(task('x'.repeat(JSON_MAX_INPUT_BYTES + 1))), 'limit');
    await activeRejection;
    expect(workers).toHaveLength(1);
    expect(workers[0].terminated).toBe(true);
  });

  it('defers the exact UTF-8 input limit to the worker', async () => {
    const { client, workers } = createHarness();
    const source = '😀'.repeat(JSON_MAX_INPUT_BYTES / 4 + 1);
    const resultPromise = client.run(task(source));

    expect(workers).toHaveLength(1);
    expect(workers[0].posted).toEqual([{ jobId: 1, task: task(source) }]);
    workers[0].emit({
      jobId: 1,
      type: 'error',
      code: 'limit',
      message: 'JSON input exceeds the UTF-8 limit.',
    });

    await expectTaskError(resultPromise, 'limit');
    expect(workers[0].terminated).toBe(true);
  });

  it('reports worker creation and postMessage failures without a synchronous fallback', async () => {
    const unavailable = new JsonWorkerClient(() => {
      throw new Error('Workers unavailable');
    });
    await expectTaskError(unavailable.run(task()), 'unavailable');

    const worker = new FakeWorker();
    worker.postMessage = () => {
      throw new Error('Clone failed');
    };
    const cloneFailure = new JsonWorkerClient(() => worker);
    await expectTaskError(cloneFailure.run(task()), 'worker');
    expect(worker.terminated).toBe(true);
  });
});
