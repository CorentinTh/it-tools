import xmlFormat from 'xml-formatter';
import {
  XML_ERROR_MESSAGES,
  XML_MAX_OUTPUT_BYTES,
  parseXmlFormatTask,
} from './xml-formatter.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface XmlWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

export function handleXmlWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseXmlFormatTask);
    const formatted = xmlFormat(task.source.trim(), {
      indentation: ' '.repeat(task.indentSize),
      collapseContent: task.collapseContent,
      lineSeparator: '\n',
    });
    const result = createBoundedTextResult(formatted, XML_MAX_OUTPUT_BYTES);
    return result === undefined
      ? { jobId, type: 'error', code: 'output-limit', message: XML_ERROR_MESSAGES['output-limit'] }
      : { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: XML_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as XmlWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleXmlWorkerRequest(event.data)));
