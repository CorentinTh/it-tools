import { describe, expect, it } from 'vitest';
import { handleJsonWorkspaceRequest } from './json-repair-query.worker';
import { JSON_WORKSPACE_ERROR_MESSAGES } from './json-repair-query.worker.protocol';

describe('JSON repair/query worker', () => {
  it('returns bounded repaired JSON', () => {
    expect(handleJsonWorkspaceRequest({ jobId: 2, task: { operation: 'repair', source: '{value: 1,}', query: '$' } }))
      .toMatchObject({ jobId: 2, type: 'result', result: { value: '{\n  "value": 1\n}' } });
  });

  it('uses static non-reflective errors', () => {
    const response = handleJsonWorkspaceRequest({ jobId: 3, task: { operation: 'query', source: '{"secret":"private"}', query: '$[?(@.secret)]' } });
    expect(response).toEqual({ jobId: 3, type: 'error', code: 'processing', message: JSON_WORKSPACE_ERROR_MESSAGES.processing });
    expect(JSON.stringify(response)).not.toContain('private');
  });
});
