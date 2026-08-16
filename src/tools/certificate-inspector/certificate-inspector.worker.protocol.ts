import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export interface CertificateInspectorTask { source: string }
export const CERTIFICATE_INSPECTOR_MAX_INPUT_BYTES = 1536 * 1024;
export const CERTIFICATE_INSPECTOR_MAX_OUTPUT_BYTES = 64 * 1024;
export const CERTIFICATE_INSPECTOR_TIMEOUT_MS = 8_000;
export const CERTIFICATE_INSPECTOR_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter one PEM certificate, CSR, or public key.',
  'input-limit': 'PEM input is limited to 1.5 MiB of UTF-8 text.',
  'output-limit': 'Inspection output exceeded 64 KiB.',
  'processing': 'The PEM/DER structure could not be inspected. Check its type and encoding.',
};

export function parseCertificateInspectorTask(value: unknown): CertificateInspectorTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).join(',') !== 'source'
    || typeof value.source !== 'string'
    || !value.source.trim()) {
    throw new BoundedTextTaskError('validation', CERTIFICATE_INSPECTOR_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, CERTIFICATE_INSPECTOR_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', CERTIFICATE_INSPECTOR_ERROR_MESSAGES['input-limit']);
  }
  return { source: value.source };
}
