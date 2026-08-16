import { describe, expect, it } from 'vitest';
import { handleJsonCodeRequest } from './json-code-generator.worker';

describe('JSON code generator worker', () => {
  it('returns generated output for a strict bounded task', () => {
    const message = handleJsonCodeRequest({ jobId: 4, task: { source: '{value: 1}', comparison: '', target: 'schema', rootName: 'Root' } });
    expect(message.type).toBe('result');
    if (message.type !== 'result') {
      throw new Error('Expected result');
    }
    expect(message.result.value).toContain('draft/2020-12/schema');
  });

  it('returns a static error without echoing malformed JSON', () => {
    const message = handleJsonCodeRequest({ jobId: 5, task: { source: '{secret-value', comparison: '', target: 'schema', rootName: 'Root' } });
    expect(message).toEqual({ jobId: 5, type: 'error', code: 'processing', message: 'The JSON example could not be analyzed or generated.' });
    expect(JSON.stringify(message)).not.toContain('secret-value');
  });
});
