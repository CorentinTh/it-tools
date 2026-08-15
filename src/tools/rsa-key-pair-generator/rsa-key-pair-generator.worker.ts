/// <reference lib="webworker" />

import { handleRsaWorkerRequest } from './rsa-key-pair-generator.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<unknown>) => {
  self.postMessage(await handleRsaWorkerRequest(event.data));
};

export {};
