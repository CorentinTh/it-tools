/// <reference lib="webworker" />

import { handleHtmlFormatWorkerRequest } from './html-wysiwyg-editor.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (event: MessageEvent<unknown>) => {
  void handleHtmlFormatWorkerRequest(event.data).then(message => self.postMessage(message));
};

export {};
