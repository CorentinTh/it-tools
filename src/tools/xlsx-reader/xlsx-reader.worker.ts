/// <reference lib="webworker" />

import { runXlsxReaderTask, xlsxReaderWorkerError } from './xlsx-reader.worker-handler';
import { parseXlsxReaderRequest, xlsxReaderErrorMessage } from './xlsx-reader.worker.protocol';

globalThis.onmessage = async (event: MessageEvent<unknown>) => {
  let jobId = 0;
  try {
    const request = parseXlsxReaderRequest(event.data);
    jobId = request.jobId;
    const result = await runXlsxReaderTask(request.task);
    globalThis.postMessage({ jobId, type: 'result', result });
  }
  catch (error) {
    const failure = xlsxReaderWorkerError(error);
    globalThis.postMessage({ jobId, type: 'error', code: failure.code, message: xlsxReaderErrorMessage(failure.code) });
  }
};
