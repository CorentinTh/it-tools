/// <reference lib="webworker" />
import { handleArgon2idRequest } from './argon2id.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<unknown>) => {
  self.postMessage(await handleArgon2idRequest(event.data));
};

export {};
