/// <reference lib="webworker" />
import { handleAesEnvelopeRequest } from './aes-gcm-envelope.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<unknown>) => {
  const message = await handleAesEnvelopeRequest(event.data);
  if (message.type === 'result' && (message.result.kind === 'encrypted-file' || message.result.kind === 'decrypted-file')) {
    self.postMessage(message, [message.result.output]);
  }
  else {
    self.postMessage(message);
  }
};

export {};
