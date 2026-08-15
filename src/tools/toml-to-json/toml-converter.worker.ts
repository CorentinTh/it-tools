/// <reference lib="webworker" />

import { parse as parseToml } from 'iarna-toml-esm';
import { stringify as stringifyYaml } from 'yaml';
import {
  type StructuredDataConversionTask,
  TOML_SOURCE_CONVERSIONS,
} from '@/utils/structured-data-converter.worker.protocol';
import { handleStructuredDataConverterWorkerRequest } from '@/utils/structured-data-converter.worker-handler';
import type { BoundedTextWorkerMessage } from '@/utils/bounded-text-task';

interface TomlConverterWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

if (!('global' in globalThis)) {
  Reflect.defineProperty(globalThis, 'global', {
    configurable: true,
    value: globalThis,
    writable: true,
  });
}
function convertToml(task: StructuredDataConversionTask): string {
  const parsed: unknown = parseToml(task.source);
  switch (task.conversion) {
    case 'toml-to-json':
      return JSON.stringify(parsed, null, 3);
    case 'toml-to-yaml':
      return stringifyYaml(parsed);
    default:
      throw new TypeError('Unsupported TOML conversion.');
  }
}

export function handleTomlConverterWorkerRequest(value: unknown): Promise<BoundedTextWorkerMessage> {
  return handleStructuredDataConverterWorkerRequest(value, {
    allowedConversions: TOML_SOURCE_CONVERSIONS,
    convert: convertToml,
  });
}

const workerScope = globalThis as unknown as TomlConverterWorkerScope;
workerScope.addEventListener('message', async event => workerScope.postMessage(await handleTomlConverterWorkerRequest(event.data)));
