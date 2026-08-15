import { XML_DATA_CONVERSIONS } from '@/utils/structured-data-converter.worker.protocol';
import { createStructuredDataConverterWorkerClient } from '@/utils/structured-data-converter.worker-client';

export function createXmlDataConverterWorkerClient() {
  return createStructuredDataConverterWorkerClient({
    allowedConversions: XML_DATA_CONVERSIONS,
    taskName: 'XML data conversion',
    workerFactory: () => new Worker(new URL('./xml-data-converter.worker.ts', import.meta.url), {
      type: 'module',
      name: 'it-tools-xml-data-converter',
    }),
  });
}
