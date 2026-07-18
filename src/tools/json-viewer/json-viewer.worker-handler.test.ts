import { describe, expect, it, vi } from 'vitest';
import { handleJsonWorkerRequest } from './json-viewer.worker-handler';
import { JSON_MAX_INPUT_BYTES, JSON_MAX_OUTPUT_BYTES } from './json-viewer.worker.protocol';

function request(source = '{}') {
  return {
    jobId: 7,
    task: {
      operation: 'format' as const,
      source,
      indentSize: 2,
      sortKeys: false,
      mode: 'strict' as const,
    },
  };
}

describe('JSON worker handler', () => {
  it('attaches the exact worker-computed UTF-8 output size', () => {
    const output = 'Aé中🙂\uD800';

    expect(handleJsonWorkerRequest(request(), () => output)).toEqual({
      jobId: 7,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: output,
      outputBytes: new TextEncoder().encode(output).byteLength,
    });
  });

  it('returns a matching structured limit error for worker-only input validation', () => {
    const formatter = vi.fn(() => '{}');
    const source = '😀'.repeat(JSON_MAX_INPUT_BYTES / 4 + 1);

    expect(handleJsonWorkerRequest(request(source), formatter)).toMatchObject({
      jobId: 7,
      type: 'error',
      code: 'limit',
    });
    expect(formatter).not.toHaveBeenCalled();
  });

  it('fails closed if a formatter returns more than the exact output cap', () => {
    const output = '😀'.repeat(JSON_MAX_OUTPUT_BYTES / 4 + 1);

    expect(handleJsonWorkerRequest(request(), () => output)).toMatchObject({
      jobId: 7,
      type: 'error',
      code: 'limit',
    });
  });
});
