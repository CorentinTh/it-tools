import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  JsonSchemaWorkerClient,
  type JsonSchemaWorkerHandle,
} from './json-schema-validator.worker-client';
import {
  type JsonSchemaTaskError,
  type JsonSchemaValidationResult,
  type JsonSchemaValidationTask,
  type JsonSchemaWorkerRequest,
} from './json-schema-validator.worker.protocol';

const TASK: JsonSchemaValidationTask = {
  schemaSource: '{}',
  instanceSource: 'null',
  draft: 'draft2020',
};

const VALID_RESULT: JsonSchemaValidationResult = {
  valid: true,
  completeErrorList: true,
  warnings: [],
  errors: [],
};

class FakeWorker implements JsonSchemaWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: JsonSchemaWorkerRequest[] = [];
  terminateCount = 0;
  throwOnPost = false;

  postMessage(request: JsonSchemaWorkerRequest): void {
    if (this.throwOnPost) {
      throw new Error('postMessage failed');
    }
    this.posted.push(request);
  }

  terminate(): void {
    this.terminateCount += 1;
  }

  emit(value: unknown): void {
    this.onmessage?.({ data: value } as MessageEvent<unknown>);
  }

  crash(): ReturnType<typeof vi.fn> {
    const preventDefault = vi.fn();
    this.onerror?.({ preventDefault } as unknown as ErrorEvent);
    return preventDefault;
  }
}

function createHarness(timeoutMs = 5_000) {
  const workers: FakeWorker[] = [];
  const client = new JsonSchemaWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);

  return { client, workers };
}

async function rejectedError(promise: Promise<unknown>, code: JsonSchemaTaskError['code']) {
  try {
    await promise;
    throw new Error('Expected JSON Schema worker task to reject.');
  }
  catch (error) {
    expect(error).toMatchObject({ name: 'JsonSchemaTaskError', code });
    return error as JsonSchemaTaskError;
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe('JSON Schema worker client', () => {
  it('posts a typed request, resolves a matching result, and terminates the worker', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(TASK);

    expect(workers[0].posted).toEqual([{ jobId: 1, task: TASK }]);
    workers[0].emit({ jobId: 1, type: 'result', result: VALID_RESULT });

    await expect(resultPromise).resolves.toMatchObject({ value: VALID_RESULT });
    expect((await resultPromise).elapsedMs).toBeGreaterThanOrEqual(0);
    expect(workers[0].terminateCount).toBe(1);
    expect(workers[0].onmessage).toBeNull();
    expect(workers[0].onerror).toBeNull();
  });

  it('terminates and rejects a replaced task while ignoring stale events', async () => {
    const { client, workers } = createHarness();
    const stalePromise = client.run(TASK);
    const staleRejection = rejectedError(stalePromise, 'cancelled');
    const currentPromise = client.run({ ...TASK, instanceSource: '42' });

    expect((await staleRejection).message).toContain('newer JSON Schema validation');
    expect(workers[0].terminateCount).toBe(1);
    workers[0].emit({ jobId: 1, type: 'result', result: VALID_RESULT });
    workers[1].emit({ jobId: 1, type: 'result', result: VALID_RESULT });
    workers[1].emit({ jobId: 2, type: 'result', result: VALID_RESULT });

    await expect(currentPromise).resolves.toMatchObject({ value: VALID_RESULT });
  });

  it('cancels current work before rejecting a malformed replacement task', async () => {
    const { client, workers } = createHarness();
    const activePromise = client.run(TASK);
    const invalidPromise = client.run({ ...TASK, schemaSource: '' });

    expect((await rejectedError(activePromise, 'cancelled')).message).toContain('newer JSON Schema validation');
    expect((await rejectedError(invalidPromise, 'validation')).message).toContain('JSON Schema');
    expect(workers).toHaveLength(1);
    expect(workers[0].terminateCount).toBe(1);
  });

  it('maps bounded worker errors and fails closed on malformed responses', async () => {
    const domainHarness = createHarness();
    const domainPromise = domainHarness.client.run(TASK);
    domainHarness.workers[0].emit({
      jobId: 1,
      type: 'error',
      code: 'schema',
      message: 'Unsupported schema.',
    });
    const domainError = await rejectedError(domainPromise, 'schema');
    expect(domainError.message).toBe('Unsupported schema.');
    expect(domainHarness.workers[0].terminateCount).toBe(1);

    const malformedHarness = createHarness();
    const malformedPromise = malformedHarness.client.run(TASK);
    malformedHarness.workers[0].emit({
      jobId: 1,
      type: 'result',
      result: { valid: true, completeErrorList: true, warnings: [], errors: [{}] },
    });
    await rejectedError(malformedPromise, 'worker');
    expect(malformedHarness.workers[0].terminateCount).toBe(1);
  });

  it('hard-terminates a task at its deadline', async () => {
    vi.useFakeTimers();
    const { client, workers } = createHarness(25);
    const resultPromise = client.run(TASK);
    const rejection = rejectedError(resultPromise, 'timeout');

    await vi.advanceTimersByTimeAsync(25);

    const error = await rejection;
    expect(error.message).toContain('0.025-second time limit');
    expect(workers[0].terminateCount).toBe(1);
  });

  it('supports explicit cancellation and disposal boundaries', async () => {
    const { client, workers } = createHarness();
    const cancelledPromise = client.run(TASK);
    client.cancel('Cancelled explicitly.');

    expect((await rejectedError(cancelledPromise, 'cancelled')).message).toBe('Cancelled explicitly.');
    expect(workers[0].terminateCount).toBe(1);

    const disposedPromise = client.run(TASK);
    client.dispose();
    expect((await rejectedError(disposedPromise, 'cancelled')).message).toContain('tool was closed');
    expect(workers[1].terminateCount).toBe(1);
  });

  it('reports worker creation, postMessage, and crash failures without fallback work', async () => {
    const unavailable = new JsonSchemaWorkerClient(() => {
      throw new Error('unavailable');
    });
    expect((await rejectedError(unavailable.run(TASK), 'unavailable')).message).toContain('not available');

    const postWorker = new FakeWorker();
    postWorker.throwOnPost = true;
    const postClient = new JsonSchemaWorkerClient(() => postWorker);
    expect((await rejectedError(postClient.run(TASK), 'worker')).message).toContain('could not be started');
    expect(postWorker.terminateCount).toBe(1);

    const crashHarness = createHarness();
    const crashPromise = crashHarness.client.run(TASK);
    const preventDefault = crashHarness.workers[0].crash();
    expect((await rejectedError(crashPromise, 'worker')).message).toContain('stopped unexpectedly');
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(crashHarness.workers[0].terminateCount).toBe(1);
  });
});
