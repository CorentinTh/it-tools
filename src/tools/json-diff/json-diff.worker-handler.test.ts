import { describe, expect, it } from 'vitest';
import { handleJsonDiffWorkerRequest } from './json-diff.worker-handler';
import { JSON_DIFF_ERROR_MESSAGES } from './json-diff.worker.protocol';

function request(left: string, right: string) {
  return {
    jobId: 7,
    task: { alignArrays: true, left, onlyShowDifferences: false, right },
  };
}

describe('JSON diff worker handler', () => {
  it('parses once and returns a bounded alignment report', () => {
    const response = handleJsonDiffWorkerRequest(request('[1,2,3]', '[0,1,2,3]'));

    expect(response.type).toBe('result');
    if (response.type !== 'result') {
      throw new Error('Expected a result.');
    }
    expect(response.result.alignments).toEqual({ index: 0, key: 0, lcs: 1 });
    expect(response.result.difference.type).toBe('array');
  });

  it('sanitizes parse and depth-limit failures', () => {
    expect(handleJsonDiffWorkerRequest(request('{ broken', '{}'))).toEqual({
      jobId: 7,
      type: 'error',
      code: 'parse',
      message: JSON_DIFF_ERROR_MESSAGES.parse,
    });

    const deep = `${'['.repeat(129)}0${']'.repeat(129)}`;
    expect(handleJsonDiffWorkerRequest(request(deep, deep))).toEqual({
      jobId: 7,
      type: 'error',
      code: 'limit',
      message: JSON_DIFF_ERROR_MESSAGES.limit,
    });
  });
});
