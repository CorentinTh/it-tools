import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  HtmlFormatWorkerClient,
  type HtmlFormatWorkerHandle,
} from './html-wysiwyg-editor.worker-client';
import type {
  HtmlFormatTaskError,
  HtmlFormatWorkerRequest,
} from './html-wysiwyg-editor.worker.protocol';

class FakeWorker implements HtmlFormatWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null = null;
  onmessageerror: ((event: MessageEvent<unknown>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  posted: HtmlFormatWorkerRequest[] = [];
  terminated = false;

  postMessage(message: HtmlFormatWorkerRequest): void {
    this.posted.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  emit(data: unknown): void {
    this.onmessage?.({ data } as MessageEvent<unknown>);
  }
}

function createHarness(timeoutMs = 8_000) {
  const workers: FakeWorker[] = [];
  const client = new HtmlFormatWorkerClient(() => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, timeoutMs);
  return { client, workers };
}

async function expectTaskError(promise: Promise<unknown>, code: HtmlFormatTaskError['code']): Promise<void> {
  await expect(promise).rejects.toMatchObject({ name: 'HtmlFormatTaskError', code });
}

afterEach(() => {
  vi.useRealTimers();
});

describe('HtmlFormatWorkerClient', () => {
  it('resolves exact output and terminates the worker', async () => {
    const { client, workers } = createHarness();
    const resultPromise = client.run({ html: '<p>Hello</p>' });
    expect(workers[0].posted).toEqual([{ jobId: 1, task: { html: '<p>Hello</p>' } }]);

    workers[0].emit({
      jobId: 1,
      type: 'result',
      result: { byteLength: 13, html: '<p>Hello</p>' },
    });
    await expect(resultPromise).resolves.toMatchObject({ value: '<p>Hello</p>' });
    expect(workers[0].terminated).toBe(true);
  });

  it('terminates active work on replacement, disposal, and timeout', async () => {
    const replaced = createHarness();
    const first = replaced.client.run({ html: '<p>old</p>' });
    const second = replaced.client.run({ html: '<p>new</p>' });
    await expectTaskError(first, 'cancelled');
    expect(replaced.workers[0].terminated).toBe(true);
    replaced.client.dispose();
    await expectTaskError(second, 'cancelled');
    expect(replaced.workers[1].terminated).toBe(true);

    vi.useFakeTimers();
    const timed = createHarness(20);
    const timedResult = timed.client.run({ html: '<p>slow</p>' });
    const rejection = expectTaskError(timedResult, 'timeout');
    await vi.advanceTimersByTimeAsync(20);
    await rejection;
    expect(timed.workers[0].terminated).toBe(true);
  });
});
