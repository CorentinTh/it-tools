import { DEVOPS_CONFIG_FORMATS, DEVOPS_CONFIG_MODES, type DevopsConfigTask } from './devops-config-workspace.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const DEVOPS_CONFIG_MAX_INPUT_BYTES = 1024 * 1024;
export const DEVOPS_CONFIG_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;
export const DEVOPS_CONFIG_TIMEOUT_MS = 8_000;

export const DEVOPS_CONFIG_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter configuration content and select a supported operation.',
  'input-limit': 'Configuration input is limited to 1 MiB of UTF-8 text.',
  'output-limit': 'Configuration output is limited to 2 MiB of UTF-8 text.',
  'processing': 'The configuration could not be processed. Check its syntax and selected operation.',
};

export function parseDevopsConfigTask(value: unknown): DevopsConfigTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'format,mode,path,prefix,source'
    || typeof value.source !== 'string'
    || value.source.trim() === ''
    || typeof value.mode !== 'string'
    || !DEVOPS_CONFIG_MODES.includes(value.mode as DevopsConfigTask['mode'])
    || typeof value.format !== 'string'
    || !DEVOPS_CONFIG_FORMATS.includes(value.format as NonNullable<DevopsConfigTask['format']>)
    || typeof value.path !== 'string' || value.path.length > 1_024
    || typeof value.prefix !== 'string' || value.prefix.length > 128) {
    throw new BoundedTextTaskError('validation', DEVOPS_CONFIG_ERROR_MESSAGES.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, DEVOPS_CONFIG_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', DEVOPS_CONFIG_ERROR_MESSAGES['input-limit']);
  }
  return {
    mode: value.mode as DevopsConfigTask['mode'],
    source: value.source,
    format: value.format as NonNullable<DevopsConfigTask['format']>,
    path: value.path,
    prefix: value.prefix,
  };
}
