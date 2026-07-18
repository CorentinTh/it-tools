import { describe, expect, it } from 'vitest';
import { isUnknownRecord, isWorkerJobId, nextWorkerJobId } from './worker-protocol';

describe('worker protocol helpers', () => {
  it('accepts only non-array records', () => {
    expect(isUnknownRecord({ jobId: 1 })).toBe(true);
    expect(isUnknownRecord(Object.create(null))).toBe(true);
    expect(isUnknownRecord([])).toBe(false);
    expect(isUnknownRecord(null)).toBe(false);
    expect(isUnknownRecord('task')).toBe(false);
  });

  it.each([1, 2, Number.MAX_SAFE_INTEGER])('accepts a positive safe worker job identifier: %s', (jobId) => {
    expect(isWorkerJobId(jobId)).toBe(true);
  });

  it.each([
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
    '1',
  ])('rejects an invalid worker job identifier: %s', (jobId) => {
    expect(isWorkerJobId(jobId)).toBe(false);
  });

  it('increments identifiers and wraps the safe-integer boundary without emitting zero', () => {
    expect(nextWorkerJobId(0)).toBe(1);
    expect(nextWorkerJobId(1)).toBe(2);
    expect(nextWorkerJobId(Number.MAX_SAFE_INTEGER)).toBe(1);
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    'rejects an invalid current worker job identifier: %s',
    (jobId) => {
      expect(() => nextWorkerJobId(jobId)).toThrow(RangeError);
    },
  );
});
