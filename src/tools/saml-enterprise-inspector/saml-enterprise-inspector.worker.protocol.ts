import type { SamlBinding } from './saml-enterprise-inspector.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { isUnknownRecord } from '@/utils/worker-protocol';

export interface SamlInspectionTask {
  source: string
  binding: SamlBinding
}

export const SAML_MAX_OUTPUT_BYTES = 2 * 1024 * 1024 + 4096;
export const SAML_TIMEOUT_MS = 7_000;
export const SAML_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter a bounded SAML message and select a supported binding.',
  'input-limit': 'Encoded SAML input is limited to 768 KiB of text.',
  'output-limit': 'Decoded SAML output is limited to 2 MiB.',
  'processing': 'The SAML message could not be decoded. Check its binding, encoding, compression, and XML structure.',
};

export function parseSamlInspectionTask(value: unknown): SamlInspectionTask {
  const inputTooLarge = isUnknownRecord(value) && typeof value.source === 'string' && value.source.length > 768 * 1024;
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'binding,source'
    || typeof value.source !== 'string'
    || !value.source.trim()
    || value.source.length > 768 * 1024
    || (value.binding !== 'auto' && value.binding !== 'base64' && value.binding !== 'redirect')) {
    const code = inputTooLarge ? 'input-limit' : 'validation';
    throw new BoundedTextTaskError(code, SAML_ERROR_MESSAGES[code]);
  }
  return { source: value.source, binding: value.binding };
}
