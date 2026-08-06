import { describe, expect, it } from 'vitest';
import {
  JSON_MAX_INPUT_BYTES,
  JSON_MAX_OUTPUT_BYTES,
  JsonTaskError,
  parseJsonTask,
  parseJsonWorkerMessage,
  parseJsonWorkerRequest,
} from './json-viewer.worker.protocol';

function expectErrorCode(action: () => unknown, code: JsonTaskError['code']): void {
  try {
    action();
    throw new Error('Expected JSON task validation to fail.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(JsonTaskError);
    expect((error as JsonTaskError).code).toBe(code);
  }
}

describe('JSON worker protocol', () => {
  it('accepts both bounded modes, indentation zero, and positive safe job identifiers', () => {
    const strictTask = {
      operation: 'format' as const,
      source: '{"hello":"world"}',
      indentSize: 0,
      sortKeys: false,
      mode: 'strict' as const,
    };
    const json5Task = { ...strictTask, indentSize: 10, mode: 'json5' as const };

    expect(parseJsonTask(strictTask)).toEqual(strictTask);
    expect(parseJsonTask(json5Task)).toEqual(json5Task);
    expect(parseJsonWorkerRequest({ jobId: 7, task: strictTask })).toEqual({ jobId: 7, task: strictTask });
    expectErrorCode(() => parseJsonWorkerRequest({ jobId: 0, task: strictTask }), 'validation');
  });

  it('uses an O(1) client preflight and enforces the exact UTF-8 limit in the worker request', () => {
    const boundaryTask = {
      operation: 'format',
      source: '😀'.repeat(JSON_MAX_INPUT_BYTES / 4),
      indentSize: 2,
      sortKeys: false,
      mode: 'strict',
    } as const;
    const unicodeOverflowTask = {
      ...boundaryTask,
      source: '😀'.repeat(JSON_MAX_INPUT_BYTES / 4 + 1),
    };

    expect(parseJsonTask(boundaryTask).source).toHaveLength(JSON_MAX_INPUT_BYTES / 2);
    expect(parseJsonWorkerRequest({ jobId: 1, task: boundaryTask }).task).toEqual(boundaryTask);

    // Its UTF-16 length still fits, so the client preflight accepts it without
    // walking the string; the exact worker validation rejects its UTF-8 size.
    expect(parseJsonTask(unicodeOverflowTask)).toEqual(unicodeOverflowTask);
    expectErrorCode(
      () => parseJsonWorkerRequest({ jobId: 2, task: unicodeOverflowTask }),
      'limit',
    );

    expectErrorCode(() => parseJsonTask({
      operation: 'format',
      source: 'x'.repeat(JSON_MAX_INPUT_BYTES + 1),
      indentSize: 2,
      sortKeys: false,
      mode: 'strict',
    }), 'limit');
  });

  it('rejects malformed operations, options, and modes', () => {
    const valid = { operation: 'format', source: '{}', indentSize: 2, sortKeys: false, mode: 'strict' };

    expectErrorCode(() => parseJsonTask(null), 'validation');
    expectErrorCode(() => parseJsonTask({ ...valid, operation: 'other' }), 'validation');
    expectErrorCode(() => parseJsonTask({ ...valid, source: 42 }), 'validation');
    expectErrorCode(() => parseJsonTask({ ...valid, indentSize: -1 }), 'validation');
    expectErrorCode(() => parseJsonTask({ ...valid, indentSize: 11 }), 'validation');
    expectErrorCode(() => parseJsonTask({ ...valid, indentSize: 2.5 }), 'validation');
    expectErrorCode(() => parseJsonTask({ ...valid, sortKeys: 'yes' }), 'validation');
    expectErrorCode(() => parseJsonTask({ ...valid, mode: 'legacy' }), 'validation');
    expectErrorCode(() => parseJsonTask(Object.assign([], valid)), 'validation');
    expectErrorCode(
      () => parseJsonWorkerRequest(Object.assign([], { jobId: 1, task: valid })),
      'validation',
    );
  });

  it('accepts only bounded matching results and structured errors', () => {
    const formatted = '{"hello":"world"}';
    expect(parseJsonWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: formatted,
      outputBytes: formatted.length,
    })).toEqual({
      jobId: 1,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: formatted,
      outputBytes: formatted.length,
    });

    expect(parseJsonWorkerMessage({
      jobId: 2,
      type: 'error',
      code: 'syntax',
      message: 'Invalid JSON.',
    })).toEqual({ jobId: 2, type: 'error', code: 'syntax', message: 'Invalid JSON.' });

    expectErrorCode(() => parseJsonWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: 'x'.repeat(JSON_MAX_OUTPUT_BYTES + 1),
      outputBytes: JSON_MAX_OUTPUT_BYTES + 1,
    }), 'worker');
    expectErrorCode(() => parseJsonWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: 'abc',
    }), 'worker');
    expectErrorCode(() => parseJsonWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: 'abc',
      outputBytes: 2,
    }), 'worker');
    expectErrorCode(() => parseJsonWorkerMessage({
      jobId: 1,
      type: 'result',
      operation: 'format',
      mode: 'strict',
      value: 'a',
      outputBytes: 4,
    }), 'worker');
    expectErrorCode(
      () => parseJsonWorkerMessage({
        jobId: 1,
        type: 'result',
        operation: 'format',
        mode: 'legacy',
        value: '{}',
        outputBytes: 2,
      }),
      'worker',
    );
    expectErrorCode(
      () => parseJsonWorkerMessage({ jobId: 1, type: 'error', code: 'worker', message: 'bad' }),
      'worker',
    );
    expectErrorCode(
      () => parseJsonWorkerMessage({ jobId: 1, type: 'error', code: 'limit', message: 'x'.repeat(1_001) }),
      'worker',
    );
    expectErrorCode(
      () => parseJsonWorkerMessage(Object.assign([], {
        jobId: 1,
        type: 'error',
        code: 'syntax',
        message: 'Invalid JSON.',
      })),
      'worker',
    );
  });
});
