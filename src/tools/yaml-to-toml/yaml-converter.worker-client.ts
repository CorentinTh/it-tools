import { YAML_SOURCE_CONVERSIONS } from '@/utils/structured-data-converter.worker.protocol';
import { createStructuredDataConverterWorkerClient } from '@/utils/structured-data-converter.worker-client';

export function createYamlConverterWorkerClient() {
  return createStructuredDataConverterWorkerClient({
    allowedConversions: YAML_SOURCE_CONVERSIONS,
    taskName: 'YAML conversion',
    workerFactory: () => new Worker(new URL('./yaml-converter.worker.ts', import.meta.url), {
      type: 'module',
      name: 'it-tools-yaml-converter',
    }),
  });
}
