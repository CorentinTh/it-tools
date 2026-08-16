import {
  MOCK_DATA_FORMATS,
  MOCK_DATA_MAX_OUTPUT_BYTES,
  MOCK_DATA_PROFILES,
  type MockDataOptions,
  validateMockDataOptions,
} from './mock-data-generator.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { isUnknownRecord } from '@/utils/worker-protocol';

export const MOCK_DATA_TASK_TIMEOUT_MS = 8_000;

export const MOCK_DATA_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Check the seed, record count, profile, and output format.',
  'input-limit': 'The mock-data seed exceeds its UTF-8 byte limit.',
  'output-limit': `Generated data is limited to ${MOCK_DATA_MAX_OUTPUT_BYTES.toLocaleString('en-US')} UTF-8 bytes. Reduce the record count or choose a smaller profile.`,
  'processing': 'Mock data could not be generated.',
};

export function parseMockDataTask(value: unknown): MockDataOptions {
  if (
    !isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'count,format,profile,seed'
    || typeof value.seed !== 'string'
    || typeof value.count !== 'number'
    || typeof value.profile !== 'string'
    || !MOCK_DATA_PROFILES.includes(value.profile as MockDataOptions['profile'])
    || typeof value.format !== 'string'
    || !MOCK_DATA_FORMATS.includes(value.format as MockDataOptions['format'])
  ) {
    throw new BoundedTextTaskError('validation', MOCK_DATA_ERROR_MESSAGES.validation);
  }

  const task: MockDataOptions = {
    seed: value.seed,
    count: value.count,
    profile: value.profile as MockDataOptions['profile'],
    format: value.format as MockDataOptions['format'],
  };
  const validationMessage = validateMockDataOptions(task);
  if (validationMessage) {
    const code = validationMessage.includes('UTF-8 bytes') ? 'input-limit' : 'validation';
    throw new BoundedTextTaskError(code, MOCK_DATA_ERROR_MESSAGES[code]);
  }
  return task;
}
