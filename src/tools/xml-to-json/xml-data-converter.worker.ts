/// <reference lib="webworker" />

import convert from 'xml-js';
import JSON5 from 'json5';
import {
  type StructuredDataConversionTask,
  XML_DATA_CONVERSIONS,
} from '@/utils/structured-data-converter.worker.protocol';
import { handleStructuredDataConverterWorkerRequest } from '@/utils/structured-data-converter.worker-handler';
import type { BoundedTextWorkerMessage } from '@/utils/bounded-text-task';

interface XmlDataConverterWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

function convertXmlData(task: StructuredDataConversionTask): string {
  switch (task.conversion) {
    case 'xml-to-json':
      return JSON.stringify(convert.xml2js(task.source, { compact: true }), null, 2);
    case 'json-to-xml':
      return convert.js2xml(JSON5.parse(task.source), { compact: true });
    default:
      throw new TypeError('Unsupported XML data conversion.');
  }
}

export function handleXmlDataConverterWorkerRequest(value: unknown): Promise<BoundedTextWorkerMessage> {
  return handleStructuredDataConverterWorkerRequest(value, {
    allowedConversions: XML_DATA_CONVERSIONS,
    convert: convertXmlData,
  });
}

const workerScope = globalThis as unknown as XmlDataConverterWorkerScope;
workerScope.addEventListener('message', async event => workerScope.postMessage(await handleXmlDataConverterWorkerRequest(event.data)));
