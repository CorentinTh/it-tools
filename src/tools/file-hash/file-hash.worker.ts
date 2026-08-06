/// <reference lib="webworker" />

import { handleFileHashWorkerRequest } from './file-hash.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<unknown>) => {
  const message = await handleFileHashWorkerRequest(event.data, {
    emitProgress: message => self.postMessage(message),
  });
  self.postMessage(message);
};

export {};
