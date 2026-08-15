import {
  XML_ERROR_MESSAGES,
  XML_MAX_OUTPUT_BYTES,
  XML_TASK_TIMEOUT_MS,
  type XmlFormatTask,
  parseXmlFormatTask,
} from './xml-formatter.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';

export function createXmlWorkerClient(): BoundedTextWorkerClient<XmlFormatTask> {
  return new BoundedTextWorkerClient({
    errorMessages: XML_ERROR_MESSAGES,
    maxOutputBytes: XML_MAX_OUTPUT_BYTES,
    taskName: 'XML formatting',
    timeoutMs: XML_TASK_TIMEOUT_MS,
    validateTask: parseXmlFormatTask,
    workerFactory: () => new Worker(new URL('./xml-formatter.worker.ts', import.meta.url), {
      type: 'module',
      name: 'it-tools-xml-formatter',
    }),
  });
}
