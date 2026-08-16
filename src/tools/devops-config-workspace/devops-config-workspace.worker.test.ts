import { describe, expect, it } from 'vitest';
import { handleDevopsConfigRequest } from './devops-config-workspace.worker';
import { DEVOPS_CONFIG_ERROR_MESSAGES } from './devops-config-workspace.worker.protocol';

describe('DevOps configuration worker', () => {
  it('returns a correlated bounded result', () => {
    expect(handleDevopsConfigRequest({
      jobId: 7,
      task: { mode: 'properties-to-yaml', source: 'server.port=8080', format: 'yaml', path: '', prefix: '' },
    })).toMatchObject({ jobId: 7, type: 'result', result: { value: 'server:\n  port: "8080"\n' } });
  });

  it('does not reflect malformed private input in errors', () => {
    const response = handleDevopsConfigRequest({
      jobId: 8,
      task: { mode: 'compose-normalize', source: 'private-token: [broken', format: 'yaml', path: '', prefix: '' },
    });
    expect(response).toEqual({ jobId: 8, type: 'error', code: 'processing', message: DEVOPS_CONFIG_ERROR_MESSAGES.processing });
    expect(JSON.stringify(response)).not.toContain('private-token');
  });
});
