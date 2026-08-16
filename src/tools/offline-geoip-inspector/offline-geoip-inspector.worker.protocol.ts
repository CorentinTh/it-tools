import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const GEOIP_MAX_OUTPUT_BYTES = 2_048;
export const GEOIP_TIMEOUT_MS = 20_000;

export interface GeoIpInspectionTask { address: string }

export const GEOIP_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'input-limit': 'IP addresses are limited to 64 characters.',
  'output-limit': 'The local GeoIP result exceeded its safe output limit.',
  'processing': 'The bundled GeoIP dataset could not be loaded or inspected.',
  'validation': 'Enter one valid IPv4 or IPv6 address.',
};

export function parseGeoIpTask(value: unknown): GeoIpInspectionTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).join(',') !== 'address'
    || typeof value.address !== 'string'
    || value.address.trim() === '') {
    throw new BoundedTextTaskError('validation', GEOIP_ERROR_MESSAGES.validation);
  }
  if (value.address.length > 64) {
    throw new BoundedTextTaskError('input-limit', GEOIP_ERROR_MESSAGES['input-limit']);
  }
  return { address: value.address };
}
