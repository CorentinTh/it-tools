import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const XML_LIVE_MAX_BYTES = 64 * 1024;
export const XML_MAX_INPUT_BYTES = 1024 * 1024;
export const XML_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const XML_TASK_TIMEOUT_MS = 8_000;

export interface XmlFormatTask {
  collapseContent: boolean
  indentSize: number
  source: string
}

export const XML_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter valid XML and formatting options.',
  'input-limit': `XML formatting is limited to ${XML_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `Formatted XML is limited to ${XML_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'processing': 'The XML document could not be formatted. Check that it is valid XML.',
};

export function parseXmlFormatTask(value: unknown): XmlFormatTask {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'collapseContent,indentSize,source'
    || typeof value.source !== 'string'
    || value.source.trim() === ''
    || typeof value.collapseContent !== 'boolean'
    || !Number.isSafeInteger(value.indentSize)
    || Number(value.indentSize) < 0
    || Number(value.indentSize) > 10
  ) {
    throw new BoundedTextTaskError('validation', XML_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, XML_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', XML_ERROR_MESSAGES['input-limit']);
  }
  return { collapseContent: value.collapseContent, indentSize: Number(value.indentSize), source: value.source };
}
