import { handleJsonWorkerRequest } from './json-viewer.worker-handler';
import type { JsonWorkerMessage } from './json-viewer.worker.protocol';

interface JsonWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: JsonWorkerMessage) => void
}

const workerScope = globalThis as unknown as JsonWorkerScope;

workerScope.addEventListener('message', (event) => {
  workerScope.postMessage(handleJsonWorkerRequest(event.data));
});
