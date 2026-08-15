import { JSON_SOURCE_CONVERSIONS } from '@/utils/structured-data-converter.worker.protocol';
import { createStructuredDataConverterWorkerClient } from '@/utils/structured-data-converter.worker-client';

export function createJsonConverterWorkerClient() {
  return createStructuredDataConverterWorkerClient({
    allowedConversions: JSON_SOURCE_CONVERSIONS,
    taskName: 'JSON conversion',
    workerFactory: () => new Worker(new URL('./json-converter.worker.ts', import.meta.url), {
      type: 'module',
      name: 'it-tools-json-converter',
    }),
  });
}
