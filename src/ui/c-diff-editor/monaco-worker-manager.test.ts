import { beforeEach, describe, expect, it, vi } from 'vitest';
import { acquireMonacoWorkerEnvironment } from './monaco-worker-manager';

const workerMocks = vi.hoisted(() => ({
  terminate: [] as Array<ReturnType<typeof vi.fn>>,
}));

vi.mock('monaco-editor/esm/vs/editor/editor.worker?worker', () => ({
  default: class WorkerMock {
    terminate = vi.fn();

    constructor() {
      workerMocks.terminate.push(this.terminate);
    }
  },
}));

describe('monaco worker manager', () => {
  beforeEach(() => {
    workerMocks.terminate.length = 0;
    delete window.MonacoEnvironment;
  });

  it('shares the environment and restores it after the final owner releases it', () => {
    const previousEnvironment = { getWorker: vi.fn() };
    window.MonacoEnvironment = previousEnvironment;

    const releaseFirst = acquireMonacoWorkerEnvironment();
    const managedEnvironment = window.MonacoEnvironment;
    const releaseSecond = acquireMonacoWorkerEnvironment();

    expect(managedEnvironment).not.toBe(previousEnvironment);
    managedEnvironment?.getWorker?.('first', 'editor');
    managedEnvironment?.getWorker?.('second', 'editor');

    releaseFirst();
    expect(workerMocks.terminate.every(terminate => !terminate.mock.calls.length)).toBe(true);
    expect(window.MonacoEnvironment).toBe(managedEnvironment);

    releaseSecond();
    expect(workerMocks.terminate).toHaveLength(2);
    expect(workerMocks.terminate.every(terminate => terminate.mock.calls.length === 1)).toBe(true);
    expect(window.MonacoEnvironment).toBe(previousEnvironment);

    releaseSecond();
    expect(workerMocks.terminate.every(terminate => terminate.mock.calls.length === 1)).toBe(true);
  });

  it('terminates every worker and restores the environment when one termination fails', () => {
    const previousEnvironment = { getWorker: vi.fn() };
    window.MonacoEnvironment = previousEnvironment;

    const release = acquireMonacoWorkerEnvironment();
    const managedEnvironment = window.MonacoEnvironment;
    managedEnvironment?.getWorker?.('first', 'editor');
    managedEnvironment?.getWorker?.('second', 'editor');
    workerMocks.terminate[0].mockImplementationOnce(() => {
      throw new Error('worker termination failed');
    });

    expect(release).toThrow('worker termination failed');
    expect(workerMocks.terminate).toHaveLength(2);
    expect(workerMocks.terminate.every(terminate => terminate.mock.calls.length === 1)).toBe(true);
    expect(window.MonacoEnvironment).toBe(previousEnvironment);

    expect(release).not.toThrow();
  });
});
