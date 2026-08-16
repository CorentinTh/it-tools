import { describe, expect, it } from 'vitest';
import { handleCronWorkerRequest } from './cron-next-runs.worker';
import { CRON_ERROR_MESSAGES } from './cron-next-runs.worker.protocol';

describe('cron next-runs worker', () => {
  it('returns a bounded next-runs report', () => {
    const response = handleCronWorkerRequest({
      jobId: 3,
      task: { expression: '0 * * * *', dialect: 'unix', timeZone: 'UTC', afterIso: '2026-01-01T00:00:00Z', count: 2 },
    });
    expect(response).toMatchObject({ jobId: 3, type: 'result' });
    if (response.type === 'result') {
      expect(response.result.value).toContain('2026-01-01 01:00:00');
      expect(response.result.value.split('\n')).toHaveLength(2);
    }
  });

  it('returns static processing errors for unsupported schedules', () => {
    expect(handleCronWorkerRequest({
      jobId: 4,
      task: { expression: '@reboot', dialect: 'unix', timeZone: 'UTC', afterIso: 'private-invalid', count: 2 },
    })).toEqual({ jobId: 4, type: 'error', code: 'processing', message: CRON_ERROR_MESSAGES.processing });
  });
});
