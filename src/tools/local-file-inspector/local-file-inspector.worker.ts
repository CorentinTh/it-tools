/// <reference lib="webworker" />
import { handleFileInspectorRequest } from './local-file-inspector.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<unknown>) => {
  const message = await handleFileInspectorRequest(event.data, progress => self.postMessage(progress));
  self.postMessage(message);
};

export {};
