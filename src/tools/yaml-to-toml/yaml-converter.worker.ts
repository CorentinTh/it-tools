/// <reference lib="webworker" />

import { stringify as stringifyToml } from 'iarna-toml-esm';
import { parse as parseYaml } from 'yaml';
import {
  type StructuredDataConversionTask,
  YAML_SOURCE_CONVERSIONS,
} from '@/utils/structured-data-converter.worker.protocol';
import { handleStructuredDataConverterWorkerRequest } from '@/utils/structured-data-converter.worker-handler';
import type { BoundedTextWorkerMessage } from '@/utils/bounded-text-task';

interface YamlConverterWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

function stringifyAsToml(value: unknown): string {
  return [stringifyToml(value)].flat().join('\n').trim();
}

function convertYaml(task: StructuredDataConversionTask): string {
  switch (task.conversion) {
    case 'yaml-to-json': {
      const parsed: unknown = parseYaml(task.source, { merge: true });
      return parsed === null ? '' : JSON.stringify(parsed, null, 3);
    }
    case 'yaml-to-toml':
      return stringifyAsToml(parseYaml(task.source));
    default:
      throw new TypeError('Unsupported YAML conversion.');
  }
}

export function handleYamlConverterWorkerRequest(value: unknown): Promise<BoundedTextWorkerMessage> {
  return handleStructuredDataConverterWorkerRequest(value, {
    allowedConversions: YAML_SOURCE_CONVERSIONS,
    convert: convertYaml,
  });
}

const workerScope = globalThis as unknown as YamlConverterWorkerScope;
workerScope.addEventListener('message', async event => workerScope.postMessage(await handleYamlConverterWorkerRequest(event.data)));
