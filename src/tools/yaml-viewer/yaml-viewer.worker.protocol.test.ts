import { describe, expect, it } from 'vitest';
import {
  YAML_MAX_INPUT_BYTES,
  YAML_MAX_OUTPUT_BYTES,
  YamlTaskError,
  parseYamlTask,
  parseYamlWorkerMessage,
  parseYamlWorkerRequest,
} from './yaml-viewer.worker.protocol';

function expectErrorCode(action: () => unknown, code: YamlTaskError['code']): void {
  try {
    action();
    throw new Error('Expected YAML task validation to fail.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(YamlTaskError);
    expect((error as YamlTaskError).code).toBe(code);
  }
}

describe('YAML worker protocol', () => {
  it('accepts a bounded formatting task and positive safe job identifier', () => {
    const task = {
      operation: 'format' as const,
      source: 'hello: world',
      indentSize: 2,
      sortKeys: false,
    };

    expect(parseYamlTask(task)).toEqual(task);
    expect(parseYamlWorkerRequest({ jobId: 7, task })).toEqual({ jobId: 7, task });
    expectErrorCode(() => parseYamlWorkerRequest({ jobId: 0, task }), 'validation');
  });

  it('uses an O(1) client preflight and enforces the exact UTF-8 limit in the worker request', () => {
    const boundaryTask = {
      operation: 'format',
      source: '😀'.repeat(YAML_MAX_INPUT_BYTES / 4),
      indentSize: 2,
      sortKeys: false,
    } as const;
    const unicodeOverflowTask = {
      ...boundaryTask,
      source: '😀'.repeat(YAML_MAX_INPUT_BYTES / 4 + 1),
    };

    expect(parseYamlTask(boundaryTask).source).toHaveLength(YAML_MAX_INPUT_BYTES / 2);
    expect(parseYamlWorkerRequest({ jobId: 1, task: boundaryTask }).task).toEqual(boundaryTask);

    // Its UTF-16 length still fits, so the client preflight accepts it without
    // walking the string; the exact worker validation rejects its UTF-8 size.
    expect(parseYamlTask(unicodeOverflowTask)).toEqual(unicodeOverflowTask);
    expectErrorCode(
      () => parseYamlWorkerRequest({ jobId: 2, task: unicodeOverflowTask }),
      'limit',
    );

    expectErrorCode(() => parseYamlTask({
      operation: 'format',
      source: 'x'.repeat(YAML_MAX_INPUT_BYTES + 1),
      indentSize: 2,
      sortKeys: false,
    }), 'limit');
  });

  it('rejects malformed operations and formatting options', () => {
    const valid = { operation: 'format', source: '', indentSize: 2, sortKeys: false };

    expectErrorCode(() => parseYamlTask(null), 'validation');
    expectErrorCode(() => parseYamlTask({ operation: 'other', source: '', indentSize: 2, sortKeys: false }), 'validation');
    expectErrorCode(() => parseYamlTask({ operation: 'format', source: 42, indentSize: 2, sortKeys: false }), 'validation');
    expectErrorCode(() => parseYamlTask({ operation: 'format', source: '', indentSize: 0, sortKeys: false }), 'validation');
    expectErrorCode(() => parseYamlTask({ operation: 'format', source: '', indentSize: 11, sortKeys: false }), 'validation');
    expectErrorCode(() => parseYamlTask({ operation: 'format', source: '', indentSize: 2.5, sortKeys: false }), 'validation');
    expectErrorCode(() => parseYamlTask({ operation: 'format', source: '', indentSize: 2, sortKeys: 'yes' }), 'validation');
    expectErrorCode(() => parseYamlTask(Object.assign([], valid)), 'validation');
    expectErrorCode(
      () => parseYamlWorkerRequest(Object.assign([], { jobId: 1, task: valid })),
      'validation',
    );
  });

  it('accepts only bounded result and structured error messages', () => {
    const formatted = 'hello: world\n';
    expect(parseYamlWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      value: formatted,
      outputBytes: formatted.length,
    })).toEqual({
      jobId: 1,
      type: 'result',
      operation: 'format',
      value: formatted,
      outputBytes: formatted.length,
    });

    expect(parseYamlWorkerMessage({
      jobId: 2,
      type: 'error',
      code: 'syntax',
      message: 'Invalid YAML.',
    })).toEqual({ jobId: 2, type: 'error', code: 'syntax', message: 'Invalid YAML.' });

    expectErrorCode(() => parseYamlWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      value: 'x'.repeat(YAML_MAX_OUTPUT_BYTES + 1),
      outputBytes: YAML_MAX_OUTPUT_BYTES + 1,
    }), 'worker');
    expectErrorCode(() => parseYamlWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      value: 'abc',
    }), 'worker');
    expectErrorCode(() => parseYamlWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      value: 'abc',
      outputBytes: 2,
    }), 'worker');
    expectErrorCode(() => parseYamlWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      value: 'a',
      outputBytes: 4,
    }), 'worker');
    expectErrorCode(
      () => parseYamlWorkerMessage({ jobId: 1, type: 'error', code: 'worker', message: 'bad' }),
      'worker',
    );
    expectErrorCode(
      () => parseYamlWorkerMessage({ jobId: 1, type: 'error', code: 'limit', message: 'x'.repeat(1_001) }),
      'worker',
    );
    expectErrorCode(
      () => parseYamlWorkerMessage(Object.assign([], {
        jobId: 1,
        type: 'error',
        code: 'syntax',
        message: 'Invalid YAML.',
      })),
      'worker',
    );
  });
});
