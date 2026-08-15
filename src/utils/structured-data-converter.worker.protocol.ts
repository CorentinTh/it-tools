import { exceedsUtf8ByteLimit } from './utf8';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from './bounded-text-task';
import { isUnknownRecord } from './worker-protocol';

export const STRUCTURED_CONVERTER_LIVE_MAX_BYTES = 64 * 1024;
export const STRUCTURED_CONVERTER_MAX_INPUT_BYTES = 1024 * 1024;
export const STRUCTURED_CONVERTER_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const STRUCTURED_CONVERTER_TASK_TIMEOUT_MS = 8_000;

export const JSON_SOURCE_CONVERSIONS = ['json-minify', 'json-to-toml', 'json-to-yaml'] as const;
export const YAML_SOURCE_CONVERSIONS = ['yaml-to-json', 'yaml-to-toml'] as const;
export const TOML_SOURCE_CONVERSIONS = ['toml-to-json', 'toml-to-yaml'] as const;
export const XML_DATA_CONVERSIONS = ['xml-to-json', 'json-to-xml'] as const;

export type StructuredDataConversion =
  | typeof JSON_SOURCE_CONVERSIONS[number]
  | typeof YAML_SOURCE_CONVERSIONS[number]
  | typeof TOML_SOURCE_CONVERSIONS[number]
  | typeof XML_DATA_CONVERSIONS[number];

export interface StructuredDataConversionTask {
  conversion: StructuredDataConversion
  source: string
}

export const STRUCTURED_CONVERTER_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter a supported conversion and a valid source document.',
  'input-limit': `Conversion input is limited to ${STRUCTURED_CONVERTER_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `Converted output is limited to ${STRUCTURED_CONVERTER_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'processing': 'The document could not be converted. Check that the source is valid for this tool.',
};

export function parseStructuredDataConversionTask(
  value: unknown,
  allowedConversions: readonly StructuredDataConversion[],
): StructuredDataConversionTask {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'conversion,source'
    || typeof value.source !== 'string'
    || value.source.trim() === ''
    || typeof value.conversion !== 'string'
    || !allowedConversions.includes(value.conversion as StructuredDataConversion)
  ) {
    throw new BoundedTextTaskError('validation', STRUCTURED_CONVERTER_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, STRUCTURED_CONVERTER_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', STRUCTURED_CONVERTER_ERROR_MESSAGES['input-limit']);
  }
  return { conversion: value.conversion as StructuredDataConversion, source: value.source };
}
