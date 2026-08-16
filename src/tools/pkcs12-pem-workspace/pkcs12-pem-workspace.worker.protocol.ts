import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const PKCS12_MAX_FILE_BYTES = 4 * 1024 * 1024;
export const PEM_WORKSPACE_MAX_INPUT_BYTES = 2 * 1024 * 1024;
export const PKCS12_PEM_MAX_OUTPUT_BYTES = 4 * 1024 * 1024;
export const PKCS12_PEM_TIMEOUT_MS = 15_000;

export type Pkcs12PemTask =
  | { kind: 'pkcs12'; file: File; password: string }
  | { kind: 'pem'; source: string };

export const PKCS12_PEM_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'input-limit': 'PKCS#12 files are limited to 4 MiB and PEM text is limited to 2 MiB.',
  'output-limit': 'PKCS#12 / PEM report is limited to 4 MiB.',
  'processing': 'PKCS#12 / PEM processing failed. Check the format, password, algorithms, and documented limits.',
  'validation': 'Select one PKCS#12 file with an ASCII password, or enter supported public PEM blocks.',
};

export function parsePkcs12PemTask(value: unknown): Pkcs12PemTask {
  if (!isUnknownRecord(value) || typeof value.kind !== 'string') {
    throw new BoundedTextTaskError('validation', PKCS12_PEM_ERROR_MESSAGES.validation);
  }
  if (value.kind === 'pkcs12'
    && Object.keys(value).sort().join(',') === 'file,kind,password'
    && value.file instanceof Blob
    && typeof value.password === 'string'
    && value.password.length <= 256
    && /^[\x20-\x7E]*$/u.test(value.password)) {
    if (value.file.size === 0 || value.file.size > PKCS12_MAX_FILE_BYTES) {
      throw new BoundedTextTaskError('input-limit', PKCS12_PEM_ERROR_MESSAGES['input-limit']);
    }
    return { kind: 'pkcs12', file: value.file as File, password: value.password };
  }
  if (value.kind === 'pem'
    && Object.keys(value).sort().join(',') === 'kind,source'
    && typeof value.source === 'string'
    && value.source.trim() !== '') {
    if (exceedsUtf8ByteLimit(value.source, PEM_WORKSPACE_MAX_INPUT_BYTES)) {
      throw new BoundedTextTaskError('input-limit', PKCS12_PEM_ERROR_MESSAGES['input-limit']);
    }
    return { kind: 'pem', source: value.source };
  }
  throw new BoundedTextTaskError('validation', PKCS12_PEM_ERROR_MESSAGES.validation);
}
