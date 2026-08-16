import {
  OUI_LOOKUP_TIMEOUT_MS,
  OuiLookupError,
  type OuiLookupTask,
  type OuiWorkerRequest,
  parseOuiLookupTask,
  parseOuiWorkerMessage,
  toOuiLookupError,
} from './mac-address-lookup.worker.protocol';
import { assertWorkerTaskTimeout } from '@/utils/worker-task';

export interface OuiWorkerHandle {
  onmessage: ((event: MessageEvent<unknown>) => void) | null
  onmessageerror?: ((event: MessageEvent<unknown>) => void) | null
  onerror: ((event: ErrorEvent) => void) | null
  postMessage: (message: OuiWorkerRequest) => void
  terminate: () => void
}

export type OuiWorkerFactory = () => OuiWorkerHandle;

interface ActiveLookup {
  jobId: number
  timeout: ReturnType<typeof globalThis.setTimeout>
  resolve: (value: string | undefined) => void
  reject: (error: OuiLookupError) => void
}

function createWorker(): OuiWorkerHandle {
  return new Worker(new URL('./mac-address-lookup.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-oui-lookup',
  });
}

export class OuiWorkerClient {
  private worker: OuiWorkerHandle | undefined;
  private activeLookup: ActiveLookup | undefined;
  private startError: OuiLookupError | undefined;
  private nextJobId = 0;
  private started = false;
  private disposed = false;

  constructor(
    private readonly workerFactory: OuiWorkerFactory = createWorker,
    private readonly timeoutMs = OUI_LOOKUP_TIMEOUT_MS,
  ) {
    assertWorkerTaskTimeout(timeoutMs);
  }

  start(): void {
    if (this.disposed || this.worker || this.startError) {
      return;
    }

    this.started = true;
    let worker: OuiWorkerHandle;
    try {
      worker = this.workerFactory();
    }
    catch {
      this.startError = new OuiLookupError(
        'unavailable',
        'The local vendor database worker is not available in this browser.',
      );
      return;
    }

    worker.onmessage = event => this.handleMessage(event.data);
    worker.onerror = (event) => {
      event.preventDefault();
      this.invalidateWorker(new OuiLookupError('worker', 'The local vendor database worker stopped unexpectedly.'));
    };
    worker.onmessageerror = (event) => {
      event.preventDefault();
      this.invalidateWorker(new OuiLookupError('worker', 'The local vendor database worker returned an unreadable message.'));
    };
    this.worker = worker;
  }

  retry(): void {
    if (this.disposed) {
      return;
    }

    this.cancel('The OUI lookup was replaced by a retry.');
    this.terminateWorker();
    this.startError = undefined;
    this.started = false;
    this.start();
  }

  lookup(task: OuiLookupTask): Promise<string | undefined> {
    this.cancel('A newer OUI lookup replaced this one.');

    let validatedTask: OuiLookupTask;
    try {
      validatedTask = parseOuiLookupTask(task);
    }
    catch (error) {
      return Promise.reject(toOuiLookupError(error, 'validation'));
    }

    if (this.disposed) {
      return Promise.reject(new OuiLookupError('unavailable', 'The OUI lookup tool has already been closed.'));
    }

    if (!this.started) {
      this.start();
    }
    if (!this.worker) {
      return Promise.reject(this.startError ?? new OuiLookupError(
        'unavailable',
        'The local vendor database worker could not be started.',
      ));
    }

    this.nextJobId = this.nextJobId === Number.MAX_SAFE_INTEGER ? 1 : this.nextJobId + 1;
    const jobId = this.nextJobId;

    return new Promise((resolve, reject) => {
      const timeout = globalThis.setTimeout(() => {
        this.invalidateWorker(new OuiLookupError(
          'timeout',
          `Loading the local vendor database exceeded the ${this.timeoutMs / 1000}-second time limit.`,
        ));
      }, this.timeoutMs);
      this.activeLookup = { jobId, timeout, resolve, reject };

      try {
        this.worker?.postMessage({ jobId, task: validatedTask });
      }
      catch {
        this.invalidateWorker(new OuiLookupError('worker', 'The OUI lookup could not be started.'));
      }
    });
  }

  cancel(message = 'The OUI lookup was cancelled.'): void {
    this.rejectActive(new OuiLookupError('cancelled', message));
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.cancel('The OUI lookup was cancelled because the tool was closed.');
    this.terminateWorker();
    this.startError = undefined;
  }

  private handleMessage(value: unknown): void {
    let message;
    try {
      message = parseOuiWorkerMessage(value);
    }
    catch (error) {
      this.invalidateWorker(toOuiLookupError(error, 'worker'));
      return;
    }

    const activeLookup = this.activeLookup;
    if (!activeLookup || message.jobId !== activeLookup.jobId) {
      return;
    }

    this.activeLookup = undefined;
    globalThis.clearTimeout(activeLookup.timeout);
    if (message.type === 'error') {
      activeLookup.reject(new OuiLookupError(message.code, message.message));
      return;
    }
    activeLookup.resolve(message.value ?? undefined);
  }

  private rejectActive(error: OuiLookupError): void {
    const activeLookup = this.activeLookup;
    if (!activeLookup) {
      return;
    }

    this.activeLookup = undefined;
    globalThis.clearTimeout(activeLookup.timeout);
    activeLookup.reject(error);
  }

  private invalidateWorker(error: OuiLookupError): void {
    this.startError = error;
    this.rejectActive(error);
    this.terminateWorker();
  }

  private terminateWorker(): void {
    const worker = this.worker;
    this.worker = undefined;
    if (!worker) {
      return;
    }

    worker.onmessage = null;
    worker.onmessageerror = null;
    worker.onerror = null;
    try {
      worker.terminate();
    }
    catch {
      // A termination failure must not prevent cleanup or promise settlement.
    }
  }
}
