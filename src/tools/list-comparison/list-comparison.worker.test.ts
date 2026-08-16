import { describe, expect, it } from 'vitest';
import { handleListComparisonRequest } from './list-comparison.worker';

describe('list comparison worker', () => {
  it('returns a bounded report', () => {
    expect(handleListComparisonRequest({ jobId: 1, task: { left: 'a\nb', right: 'b\nc', mode: 'set', trimItems: true, ignoreCase: false, ignoreEmpty: true } })).toMatchObject({ jobId: 1, type: 'result' });
  });

  it('rejects oversized input without echoing it', () => {
    expect(handleListComparisonRequest({ jobId: 2, task: { left: 'x'.repeat(1024 * 1024 + 1), right: '', mode: 'set', trimItems: true, ignoreCase: false, ignoreEmpty: true } })).toEqual({ jobId: 2, type: 'error', code: 'input-limit', message: 'Each list is limited to 1 MiB of UTF-8 text.' });
  });
});
