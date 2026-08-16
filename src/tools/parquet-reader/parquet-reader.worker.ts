/// <reference lib="webworker" />
import { handleParquetReaderRequest } from './parquet-reader.worker-handler';

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<unknown>) => {
  self.postMessage(await handleParquetReaderRequest(event.data));
};

export {};
