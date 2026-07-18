/// <reference lib="webworker" />

import { handleJsonSchemaWorkerRequest } from './json-schema-validator.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (event: MessageEvent<unknown>) => {
  self.postMessage(handleJsonSchemaWorkerRequest(event.data));
};

export {};
