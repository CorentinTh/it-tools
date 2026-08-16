/// <reference lib="webworker" />
import { handleEd25519WorkerRequest } from './ed25519-key-workspace.worker-handler';

declare const self: DedicatedWorkerGlobalScope;
self.onmessage = async (event: MessageEvent<unknown>) => {
  self.postMessage(await handleEd25519WorkerRequest(event.data));
};
export {};
