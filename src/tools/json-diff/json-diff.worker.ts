import { handleJsonDiffWorkerRequest } from './json-diff.worker-handler';
import type { JsonDiffWorkerMessage } from './json-diff.worker.protocol';

interface JsonDiffWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: JsonDiffWorkerMessage) => void
}

const workerScope = globalThis as unknown as JsonDiffWorkerScope;

workerScope.addEventListener('message', (event) => {
  workerScope.postMessage(handleJsonDiffWorkerRequest(event.data));
});
