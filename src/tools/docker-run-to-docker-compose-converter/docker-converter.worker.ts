/// <reference lib="webworker" />

import { handleDockerConverterWorkerRequest } from './docker-converter.worker-handler';
import type { DockerConverterWorkerMessage } from './docker-converter.worker.protocol';

interface DockerConverterWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: DockerConverterWorkerMessage) => void
}

const workerScope = globalThis as unknown as DockerConverterWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleDockerConverterWorkerRequest(event.data)));
