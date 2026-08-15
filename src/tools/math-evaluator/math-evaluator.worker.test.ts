import { describe, expect, it } from 'vitest';
import { handleMathWorkerRequest } from './math-evaluator.worker';
import { MATH_ERROR_MESSAGES, MATH_MAX_INPUT_BYTES } from './math-evaluator.worker.protocol';

function request(expression: string) {
  return { jobId: 3, task: { expression } };
}

describe('math evaluator worker', () => {
  it('evaluates only an explicit bounded request', () => {
    expect(handleMathWorkerRequest(request('2 * sqrt(9)'))).toMatchObject({
      jobId: 3,
      type: 'result',
      result: { value: '6' },
    });
  });

  it('sanitizes invalid and oversized expressions', () => {
    expect(handleMathWorkerRequest(request('2 +'))).toEqual({
      jobId: 3,
      type: 'error',
      code: 'processing',
      message: MATH_ERROR_MESSAGES.processing,
    });
    expect(handleMathWorkerRequest(request('x'.repeat(MATH_MAX_INPUT_BYTES + 1)))).toEqual({
      jobId: 3,
      type: 'error',
      code: 'input-limit',
      message: MATH_ERROR_MESSAGES['input-limit'],
    });
  });
});
