import { describe, expect, it, vi } from 'vitest';
import { handleYamlWorkerRequest } from './yaml-viewer.worker-handler';
import { YAML_MAX_INPUT_BYTES, YAML_MAX_OUTPUT_BYTES } from './yaml-viewer.worker.protocol';

function request(source = 'hello: world') {
  return {
    jobId: 7,
    task: {
      operation: 'format' as const,
      source,
      indentSize: 2,
      sortKeys: false,
    },
  };
}

describe('YAML worker handler', () => {
  it('attaches the exact worker-computed UTF-8 output size', () => {
    const output = 'Aé中🙂\uD800';

    expect(handleYamlWorkerRequest(request(), () => output)).toEqual({
      jobId: 7,
      type: 'result',
      operation: 'format',
      value: output,
      outputBytes: new TextEncoder().encode(output).byteLength,
    });
  });

  it('returns a matching structured limit error for worker-only input validation', () => {
    const formatter = vi.fn(() => 'hello: world\n');
    const source = '😀'.repeat(YAML_MAX_INPUT_BYTES / 4 + 1);

    expect(handleYamlWorkerRequest(request(source), formatter)).toMatchObject({
      jobId: 7,
      type: 'error',
      code: 'limit',
    });
    expect(formatter).not.toHaveBeenCalled();
  });

  it('fails closed if a formatter returns more than the exact output cap', () => {
    const output = '😀'.repeat(YAML_MAX_OUTPUT_BYTES / 4 + 1);

    expect(handleYamlWorkerRequest(request(), () => output)).toMatchObject({
      jobId: 7,
      type: 'error',
      code: 'limit',
    });
  });
});
