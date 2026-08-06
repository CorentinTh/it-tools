import { afterEach, describe, expect, it, vi } from 'vitest';
import { type WorkerTaskRequest, isUnknownRecord, isWorkerJobId } from './worker-protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
  type WorkerTransportErrorCode,
} from './worker-task';

interface TestTask {
  operation: 'double' | 'triple'
  value: number
}

interface TestDecodedResult {
  operation: TestTask['operation']
  value: number
}

type TestWireErrorCode = 'operation';
type TestErrorCode = WorkerTransportErrorCode | TestWireErrorCode;

class TestTaskError extends Error {
  override readonly name = 'TestTaskError';

  constructor(
    public readonly code: TestErrorCode,
    message: string,
    public readonly elapsedMs = 0,
  ) {
    super(message);
  }
}

class FakeWorker implements WorkerTaskHandle<WorkerTaskRequest<TestTask>> {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: Array<WorkerTaskRequest<TestTask>> = [];
  terminateCount = 0;
  throwOnPost = false;
  throwOnTerminate = false;

  postMessage(request: WorkerTaskRequest<TestTask>): void {
    if (this.throwOnPost) {
      throw new Error('The request could not be cloned.');
    }
    this.posted.push(request);
  }

  terminate(): void {
    this.terminateCount += 1;
    if (this.throwOnTerminate) {
      throw new Error('The worker already stopped.');
    }
  }

  emit(value: unknown): void {
    this.onmessage?.({ data: value } as MessageEvent<unknown>);
  }

  crash(preventDefault = vi.fn()): ReturnType<typeof vi.fn> {
    this.onerror?.({ preventDefault } as unknown as ErrorEvent);
    return preventDefault;
  }

  failToDeserialize(preventDefault = vi.fn()): ReturnType<typeof vi.fn> {
    this.onmessageerror?.({ preventDefault } as unknown as MessageEvent<unknown>);
    return preventDefault;
  }
}

function decodeMessage(
  value: unknown,
): WorkerTaskEvent<TestDecodedResult, TestWireErrorCode, number> {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new TestTaskError('worker', 'The worker returned an invalid envelope.');
  }

  const jobId = value.jobId;
  if (
    value.type === 'progress'
    && typeof value.progress === 'number'
    && Number.isFinite(value.progress)
    && value.progress >= 0
    && value.progress <= 1
  ) {
    return { jobId, type: 'progress', progress: value.progress };
  }

  if (
    value.type === 'result'
    && (value.operation === 'double' || value.operation === 'triple')
    && typeof value.value === 'number'
    && Number.isFinite(value.value)
  ) {
    return {
      jobId,
      type: 'result',
      result: { operation: value.operation, value: value.value },
    };
  }

  if (value.type === 'error' && value.code === 'operation' && typeof value.message === 'string') {
    return { jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new TestTaskError('worker', 'The worker returned an invalid message.');
}

function createHarness({
  factoryError = false,
  timeoutMs = 5_000,
}: {
  factoryError?: boolean
  timeoutMs?: number
} = {}) {
  const workers: FakeWorker[] = [];
  const client = new TerminateAndReplaceWorkerTask<
    TestTask,
    TestDecodedResult,
    number,
    TestWireErrorCode,
    TestTaskError,
    number
  >({
    workerFactory: () => {
      if (factoryError) {
        throw new Error('Workers are unavailable.');
      }

      const worker = new FakeWorker();
      workers.push(worker);
      return worker;
    },
    timeoutMs,
    messages: {
      replacement: 'A newer test task replaced this one.',
      unavailable: 'Test workers are unavailable.',
      timeout: (_task, deadlineMs) => `Test task exceeded ${deadlineMs} ms.`,
      crash: 'The test worker stopped unexpectedly.',
      postMessageFailure: 'The test task could not be started.',
      progressHandlerFailure: 'Test progress handling failed.',
    },
    decodeMessage,
    resolveResult: (result, expectedTask) => {
      if (result.operation !== expectedTask.operation) {
        throw new TestTaskError('worker', 'The worker returned a result for the wrong operation.');
      }
      return result.value;
    },
    createError: (code, message, elapsedMs) => new TestTaskError(code, message, elapsedMs),
    protocolError: (error, elapsedMs) => new TestTaskError(
      'worker',
      error instanceof Error ? error.message : 'The worker returned an invalid message.',
      elapsedMs,
    ),
  });

  return { client, workers };
}

function task(value = 21): TestTask {
  return { operation: 'double', value };
}

async function expectTaskError(promise: Promise<unknown>, code: TestErrorCode): Promise<TestTaskError> {
  try {
    await promise;
    throw new Error('Expected the worker task to reject.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(TestTaskError);
    expect(error).toMatchObject({ code });
    return error as TestTaskError;
  }
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('TerminateAndReplaceWorkerTask', () => {
  it('posts a typed envelope, resolves a matching result, and always cleans up', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task());

    expect(workers[0].posted).toEqual([{ jobId: 1, task: task() }]);
    workers[0].emit({ jobId: 1, type: 'result', operation: 'double', value: 42 });

    await expect(resultPromise).resolves.toMatchObject({ value: 42 });
    const result = await resultPromise;
    expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(workers[0].terminateCount).toBe(1);
    expect(workers[0].onmessage).toBeNull();
    expect(workers[0].onmessageerror).toBeNull();
    expect(workers[0].onerror).toBeNull();
  });

  it('terminates and rejects a replaced task before posting the next job', async () => {
    const { client, workers } = createHarness();
    const stalePromise = client.run(task(1));
    const staleRejection = expectTaskError(stalePromise, 'cancelled');
    const currentPromise = client.run(task(2));

    const staleError = await staleRejection;
    expect(staleError.message).toBe('A newer test task replaced this one.');
    expect(workers[0].terminateCount).toBe(1);
    expect(workers[1].posted).toEqual([{ jobId: 2, task: task(2) }]);

    workers[1].emit({ jobId: 1, type: 'result', operation: 'double', value: 2 });
    workers[1].emit({ jobId: 2, type: 'result', operation: 'double', value: 4 });
    await expect(currentPromise).resolves.toMatchObject({ value: 4 });
  });

  it('ignores well-formed stale progress, errors, and results', async () => {
    const { client, workers } = createHarness();
    const progress: number[] = [];
    const resultPromise = client.run(task(), { onProgress: value => progress.push(value) });

    workers[0].emit({ jobId: 999, type: 'progress', progress: 0.25 });
    workers[0].emit({ jobId: 999, type: 'error', code: 'operation', message: 'stale' });
    workers[0].emit({ jobId: 999, type: 'result', operation: 'triple', value: 0 });
    workers[0].emit({ jobId: 1, type: 'progress', progress: 0.5 });
    workers[0].emit({ jobId: 1, type: 'result', operation: 'double', value: 42 });

    await expect(resultPromise).resolves.toMatchObject({ value: 42 });
    expect(progress).toEqual([0.5]);
  });

  it('hard-terminates work at the configured deadline', async () => {
    vi.useFakeTimers();
    const { client, workers } = createHarness({ timeoutMs: 25 });
    const resultPromise = client.run(task());
    const rejection = expectTaskError(resultPromise, 'timeout');

    await vi.advanceTimersByTimeAsync(25);

    const error = await rejection;
    expect(error.message).toBe('Test task exceeded 25 ms.');
    expect(error.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(workers[0].terminateCount).toBe(1);
  });

  it('routes bounded worker errors through the domain error factory', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task());

    workers[0].emit({ jobId: 1, type: 'error', code: 'operation', message: 'Calculation failed.' });

    const error = await expectTaskError(resultPromise, 'operation');
    expect(error.message).toBe('Calculation failed.');
    expect(error.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(workers[0].terminateCount).toBe(1);
  });

  it.each([
    { jobId: 1, type: 'result', operation: 'triple', value: 42 },
    { jobId: 1, type: 'result', operation: 'wrong', value: 42 },
    { jobId: 1, type: 'result', operation: 'double', value: '42' },
    { jobId: 1, type: 'progress', progress: 2 },
    { jobId: 0, type: 'result', operation: 'double', value: 42 },
  ])('fails closed on a malformed worker message: %j', async (message) => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task());

    workers[0].emit(message);

    await expectTaskError(resultPromise, 'worker');
    expect(workers[0].terminateCount).toBe(1);
  });

  it('reports worker creation failures without fallback execution', async () => {
    const unavailable = createHarness({ factoryError: true });
    const unavailableError = await expectTaskError(unavailable.client.run(task()), 'unavailable');
    expect(unavailableError.message).toBe('Test workers are unavailable.');
    expect(unavailable.workers).toHaveLength(0);
  });

  it('fails safely when postMessage throws', async () => {
    const workers: FakeWorker[] = [];
    const client = new TerminateAndReplaceWorkerTask<
      TestTask,
      TestDecodedResult,
      number,
      TestWireErrorCode,
      TestTaskError,
      number
    >({
      workerFactory: () => {
        const worker = new FakeWorker();
        worker.throwOnPost = true;
        workers.push(worker);
        return worker;
      },
      timeoutMs: 5_000,
      messages: {
        replacement: 'replaced',
        unavailable: 'unavailable',
        timeout: () => 'timeout',
        crash: 'crashed',
        postMessageFailure: 'post failed',
      },
      decodeMessage,
      resolveResult: (result, expectedTask) => {
        if (result.operation !== expectedTask.operation) {
          throw new TestTaskError('worker', 'wrong operation');
        }
        return result.value;
      },
      createError: (code, message, elapsedMs) => new TestTaskError(code, message, elapsedMs),
      protocolError: (_error, elapsedMs) => new TestTaskError('worker', 'invalid', elapsedMs),
    });

    const error = await expectTaskError(client.run(task()), 'worker');
    expect(error.message).toBe('post failed');
    expect(workers[0].terminateCount).toBe(1);
  });

  it('prevents the default worker error and terminates the failed task', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task());
    const preventDefault = workers[0].crash();

    const error = await expectTaskError(resultPromise, 'worker');
    expect(error.message).toBe('The test worker stopped unexpectedly.');
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(workers[0].terminateCount).toBe(1);
  });

  it('settles and terminates when a worker response cannot be deserialized', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task());
    const preventDefault = workers[0].failToDeserialize();

    const error = await expectTaskError(resultPromise, 'worker');
    expect(error.message).toBe('The test worker stopped unexpectedly.');
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(workers[0].terminateCount).toBe(1);
    expect(workers[0].onmessage).toBeNull();
    expect(workers[0].onmessageerror).toBeNull();
    expect(workers[0].onerror).toBeNull();
  });

  it('settles and cleans up when a progress callback throws', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task(), {
      onProgress: () => {
        throw new Error('UI callback failed.');
      },
    });

    workers[0].emit({ jobId: 1, type: 'progress', progress: 0.5 });

    const error = await expectTaskError(resultPromise, 'worker');
    expect(error.message).toBe('Test progress handling failed.');
    expect(workers[0].terminateCount).toBe(1);
  });

  it('makes cancellation idempotent even when terminate throws', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task());
    workers[0].throwOnTerminate = true;

    client.cancel('Cancelled explicitly.');
    client.cancel('Cancelled twice.');

    const error = await expectTaskError(resultPromise, 'cancelled');
    expect(error.message).toBe('Cancelled explicitly.');
    expect(workers[0].terminateCount).toBe(1);
  });

  it('keeps successful settlement independent of termination failures and late events', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run(task());
    const worker = workers[0];
    const queuedHandler = worker.onmessage;
    worker.throwOnTerminate = true;

    worker.emit({ jobId: 1, type: 'result', operation: 'double', value: 42 });
    await expect(resultPromise).resolves.toMatchObject({ value: 42 });

    queuedHandler?.({
      data: { jobId: 1, type: 'error', code: 'operation', message: 'late' },
    } as MessageEvent<unknown>);
    expect(worker.terminateCount).toBe(1);
  });

  it('does not log task content or worker failures', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { client, workers } = createHarness();
    const resultPromise = client.run(task(123_456));

    workers[0].emit({ jobId: 1, type: 'error', code: 'operation', message: 'safe message' });
    await expectTaskError(resultPromise, 'operation');

    expect(log).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 2_147_483_648])(
    'rejects an unsafe timeout before allocating a worker: %s',
    (timeoutMs) => {
      expect(() => createHarness({ timeoutMs })).toThrow(RangeError);
    },
  );
});
