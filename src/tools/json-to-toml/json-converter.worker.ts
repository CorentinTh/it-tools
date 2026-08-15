/// <reference lib="webworker" />

import { stringify as stringifyToml } from 'iarna-toml-esm';
import JSON5 from 'json5';
import { stringify as stringifyYaml } from 'yaml';
import {
  JSON_SOURCE_CONVERSIONS,
  type StructuredDataConversionTask,
} from '@/utils/structured-data-converter.worker.protocol';
import { handleStructuredDataConverterWorkerRequest } from '@/utils/structured-data-converter.worker-handler';
import type { BoundedTextWorkerMessage } from '@/utils/bounded-text-task';

interface JsonConverterWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

function stringifyAsToml(value: unknown): string {
  return [stringifyToml(value)].flat().join('\n').trim();
}

function stringifyAsMinifiedJson(value: unknown): string {
  const result = JSON.stringify(value);
  if (result === undefined) {
    throw new TypeError('The parsed value cannot be represented as JSON.');
  }
  return result;
}

function convertJson(task: StructuredDataConversionTask): string {
  const parsed: unknown = JSON5.parse(task.source);
  switch (task.conversion) {
    case 'json-minify':
      return stringifyAsMinifiedJson(parsed);
    case 'json-to-toml':
      return stringifyAsToml(parsed);
    case 'json-to-yaml':
      return stringifyYaml(parsed);
    default:
      throw new TypeError('Unsupported JSON conversion.');
  }
}

export function handleJsonConverterWorkerRequest(value: unknown): Promise<BoundedTextWorkerMessage> {
  return handleStructuredDataConverterWorkerRequest(value, {
    allowedConversions: JSON_SOURCE_CONVERSIONS,
    convert: convertJson,
  });
}

const workerScope = globalThis as unknown as JsonConverterWorkerScope;
workerScope.addEventListener('message', async event => workerScope.postMessage(await handleJsonConverterWorkerRequest(event.data)));
