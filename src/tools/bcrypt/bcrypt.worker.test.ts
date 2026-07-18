import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BcryptWorkerMessage } from './bcrypt.worker.protocol';

type WorkerMessageListener = (event: MessageEvent<unknown>) => void;

let listener: WorkerMessageListener | undefined;
let postMessage: ReturnType<typeof vi.fn>;

beforeEach(async () => {
  vi.resetModules();
  listener = undefined;
  postMessage = vi.fn();
  vi.stubGlobal('addEventListener', vi.fn((type: string, candidate: WorkerMessageListener) => {
    if (type === 'message') {
      listener = candidate;
    }
  }));
  vi.stubGlobal('postMessage', postMessage);

  await import('./bcrypt.worker');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('bcrypt worker message handler', () => {
  it('preserves a valid envelope job identifier when task validation fails', () => {
    expect(listener).toBeTypeOf('function');

    listener?.({
      data: {
        jobId: 37,
        task: { operation: 'hash', value: 'secret', rounds: 100 },
      },
    } as MessageEvent<unknown>);

    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      jobId: 37,
      type: 'error',
      code: 'validation',
    }));
  });

  it('sanitizes and caps an error before posting the correlated response', async () => {
    const { BCRYPT_MAX_WORKER_ERROR_MESSAGE_LENGTH, BcryptTaskError } = await import('./bcrypt.worker.protocol');
    const task = Object.create(null) as Record<string, unknown>;
    Object.defineProperty(task, 'operation', {
      get: () => {
        throw new BcryptTaskError('validation', `\u0000${'x'.repeat(2_000)}`);
      },
    });

    listener?.({ data: { jobId: 38, task } } as MessageEvent<unknown>);

    const message = postMessage.mock.calls[0]?.[0] as BcryptWorkerMessage | undefined;
    expect(message).toMatchObject({ jobId: 38, type: 'error', code: 'validation' });
    const errorMessage = message?.type === 'error' ? message.message : '';
    expect(errorMessage.length).toBeLessThanOrEqual(BCRYPT_MAX_WORKER_ERROR_MESSAGE_LENGTH);
    expect(errorMessage.length).toBeGreaterThan(0);
    expect(errorMessage).not.toContain('\u0000');
  });
});
