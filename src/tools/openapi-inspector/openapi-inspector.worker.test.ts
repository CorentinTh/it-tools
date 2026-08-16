import { describe, expect, it } from 'vitest';
import { handleOpenApiWorkerRequest } from './openapi-inspector.worker';

describe('OpenAPI inspector worker boundary', () => {
  it('returns a bounded report and rejects invalid request shapes', () => {
    const result = handleOpenApiWorkerRequest({
      jobId: 3,
      task: { source: '{"openapi":"3.1.0","info":{"title":"A","version":"1"},"paths":{}}' },
    });
    expect(result).toMatchObject({ jobId: 3, type: 'result' });
    expect(handleOpenApiWorkerRequest({ jobId: 4, task: { source: '{}', extra: true } }))
      .toEqual({ jobId: 4, type: 'error', code: 'validation', message: 'Enter a local OpenAPI 3.0 or 3.1 JSON/YAML document.' });
  });
});
