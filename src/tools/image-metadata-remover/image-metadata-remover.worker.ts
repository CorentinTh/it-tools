/// <reference lib="webworker" />
import { handleImageMetadataRequest } from './image-metadata-remover.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<unknown>) => {
  const message = await handleImageMetadataRequest(event.data);
  if (message.type === 'result') {
    self.postMessage(message, [message.result.output]);
  }
  else {
    self.postMessage(message);
  }
};

export {};
