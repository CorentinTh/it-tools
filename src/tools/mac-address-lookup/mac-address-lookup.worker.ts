import compactData from './data/oui-data.compact.json';
import { type OuiDataIndex, decodeCompactOuiData, lookupOuiVendor } from './mac-address-lookup.data';
import {
  type OuiWorkerMessage,
  parseOuiWorkerRequest,
  sanitizeOuiWorkerErrorMessage,
  toOuiLookupError,
} from './mac-address-lookup.worker.protocol';

interface OuiWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: OuiWorkerMessage) => void
}

const workerScope = globalThis as unknown as OuiWorkerScope;
let index: OuiDataIndex | undefined;
let initializationError = false;

try {
  index = decodeCompactOuiData(compactData);
}
catch {
  initializationError = true;
}

workerScope.addEventListener('message', (event) => {
  let jobId = 1;

  try {
    const request = parseOuiWorkerRequest(event.data);
    jobId = request.jobId;
    if (initializationError || index === undefined) {
      throw new Error('The generated OUI database could not be initialized.');
    }
    const value = lookupOuiVendor(index, request.task.prefix) ?? null;
    workerScope.postMessage({ jobId, type: 'result', operation: 'lookup', value });
  }
  catch (error) {
    const lookupError = toOuiLookupError(error);
    const code = lookupError.code === 'validation' ? 'validation' : 'operation';
    workerScope.postMessage({
      jobId,
      type: 'error',
      code,
      message: sanitizeOuiWorkerErrorMessage(lookupError.message),
    });
  }
});
