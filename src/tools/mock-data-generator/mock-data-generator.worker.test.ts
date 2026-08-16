import { describe, expect, it } from 'vitest';
import { handleMockDataWorkerRequest } from './mock-data-generator.worker';
import { MOCK_DATA_ERROR_MESSAGES } from './mock-data-generator.worker.protocol';

describe('mock data worker', () => {
  it('returns reproducible output in a bounded worker envelope', () => {
    const request = {
      jobId: 7,
      task: { seed: 'worker', count: 2, profile: 'identifiers', format: 'json' },
    };
    const first = handleMockDataWorkerRequest(request);
    const replay = handleMockDataWorkerRequest(request);
    expect(first).toEqual(replay);
    expect(first).toMatchObject({ jobId: 7, type: 'result', result: { byteLength: expect.any(Number) } });
  });

  it('returns static errors for malformed and oversized requests', () => {
    expect(handleMockDataWorkerRequest({ jobId: 2, task: { seed: '', count: 1, profile: 'person', format: 'json' } }))
      .toEqual({ jobId: 2, type: 'error', code: 'validation', message: MOCK_DATA_ERROR_MESSAGES.validation });
    expect(handleMockDataWorkerRequest({
      jobId: 3,
      task: { seed: 'x', count: 5_000, profile: 'full', format: 'json' },
    })).toEqual({ jobId: 3, type: 'error', code: 'output-limit', message: MOCK_DATA_ERROR_MESSAGES['output-limit'] });
  });
});
