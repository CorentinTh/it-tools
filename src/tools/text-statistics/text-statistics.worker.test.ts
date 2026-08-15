import { describe, expect, it } from 'vitest';
import { handleTextStatisticsWorkerRequest } from './text-statistics.worker';

describe('text statistics worker', () => {
  it('computes the existing one-pass model in a worker request', () => {
    expect(handleTextStatisticsWorkerRequest({ jobId: 8, task: { source: 'hello\r\nworld 😀' } })).toEqual({
      jobId: 8,
      type: 'result',
      result: { byteSize: 17, characterCount: 15, lineCount: 2, wordCount: 3 },
    });
  });
});
