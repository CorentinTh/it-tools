import { TOML_SOURCE_CONVERSIONS } from '@/utils/structured-data-converter.worker.protocol';
import { createStructuredDataConverterWorkerClient } from '@/utils/structured-data-converter.worker-client';

export function createTomlConverterWorkerClient() {
  return createStructuredDataConverterWorkerClient({
    allowedConversions: TOML_SOURCE_CONVERSIONS,
    taskName: 'TOML conversion',
    workerFactory: () => new Worker(new URL('./toml-converter.worker.ts', import.meta.url), {
      type: 'module',
      name: 'it-tools-toml-converter',
    }),
  });
}
