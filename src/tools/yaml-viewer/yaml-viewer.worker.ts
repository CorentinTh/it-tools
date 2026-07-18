import { handleYamlWorkerRequest } from './yaml-viewer.worker-handler';
import type { YamlWorkerMessage } from './yaml-viewer.worker.protocol';

interface YamlWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: YamlWorkerMessage) => void
}

const workerScope = globalThis as unknown as YamlWorkerScope;

workerScope.addEventListener('message', (event) => {
  workerScope.postMessage(handleYamlWorkerRequest(event.data));
});
