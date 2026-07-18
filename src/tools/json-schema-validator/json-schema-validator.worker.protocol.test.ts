import { describe, expect, it } from 'vitest';
import {
  JSON_INSTANCE_MAX_BYTES,
  JSON_SCHEMA_MAX_BYTES,
  JSON_SCHEMA_MAX_ERRORS,
  JSON_SCHEMA_MAX_ERROR_CHARACTERS,
  JsonSchemaTaskError,
  type JsonSchemaTaskErrorCode,
  type JsonSchemaValidationError,
  type JsonSchemaValidationTask,
  parseJsonSchemaTask,
  parseJsonSchemaWorkerJobId,
  parseJsonSchemaWorkerMessage,
  parseJsonSchemaWorkerRequest,
  toJsonSchemaTaskError,
} from './json-schema-validator.worker.protocol';

const VALID_TASK: JsonSchemaValidationTask = {
  schemaSource: '{}',
  instanceSource: 'null',
  draft: 'draft2020',
};

const VALIDATION_ERROR: JsonSchemaValidationError = {
  instancePath: '/value',
  schemaPath: '#/properties/value/type',
  keyword: 'type',
  message: 'must be integer',
  line: 2,
  column: 12,
};

function expectTaskError(
  action: () => unknown,
  code: JsonSchemaTaskErrorCode,
): JsonSchemaTaskError {
  try {
    action();
    throw new Error('Expected the protocol value to be rejected.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(JsonSchemaTaskError);
    expect((error as JsonSchemaTaskError).code).toBe(code);
    return error as JsonSchemaTaskError;
  }
}

function invalidResult(error: JsonSchemaValidationError = VALIDATION_ERROR) {
  return {
    valid: false,
    completeErrorList: true,
    warnings: [],
    errors: [error],
  };
}

describe('JSON Schema worker protocol', () => {
  describe('main-thread task preflight', () => {
    it.each(['draft7', 'draft2019', 'draft2020'] as const)('accepts supported draft %s', (draft) => {
      expect(parseJsonSchemaTask({ ...VALID_TASK, draft })).toEqual({ ...VALID_TASK, draft });
    });

    it.each([
      [null, 'validation'],
      [[], 'validation'],
      [{ ...VALID_TASK, schemaSource: '' }, 'validation'],
      [{ ...VALID_TASK, instanceSource: '' }, 'validation'],
      [{ ...VALID_TASK, draft: 'draft4' }, 'validation'],
      [{ ...VALID_TASK, schemaSource: 'x'.repeat(JSON_SCHEMA_MAX_BYTES + 1) }, 'limit'],
      [{ ...VALID_TASK, instanceSource: 'x'.repeat(JSON_INSTANCE_MAX_BYTES + 1) }, 'limit'],
    ] as const)('rejects malformed or code-unit-oversized task %#', (task, code) => {
      expectTaskError(() => parseJsonSchemaTask(task), code);
    });

    it('defers exact multibyte UTF-8 bounds to the worker request parser', () => {
      const schemaSource = 'é'.repeat(Math.floor(JSON_SCHEMA_MAX_BYTES / 2) + 1);
      const instanceSource = 'é'.repeat(Math.floor(JSON_INSTANCE_MAX_BYTES / 2) + 1);
      const schemaTask = { ...VALID_TASK, schemaSource };
      const instanceTask = { ...VALID_TASK, instanceSource };

      expect(parseJsonSchemaTask(schemaTask)).toEqual(schemaTask);
      expect(parseJsonSchemaTask(instanceTask)).toEqual(instanceTask);
      expectTaskError(
        () => parseJsonSchemaWorkerRequest({ jobId: 1, task: schemaTask }),
        'limit',
      );
      expectTaskError(
        () => parseJsonSchemaWorkerRequest({ jobId: 2, task: instanceTask }),
        'limit',
      );
    });

    it('uses TextEncoder-equivalent sizing for unmatched UTF-16 surrogates', () => {
      const schemaSource = '\uD800'.repeat(Math.floor(JSON_SCHEMA_MAX_BYTES / 3) + 1);
      const task = { ...VALID_TASK, schemaSource };

      expect(parseJsonSchemaTask(task)).toEqual(task);
      expectTaskError(
        () => parseJsonSchemaWorkerRequest({ jobId: 1, task }),
        'limit',
      );
    });
  });

  describe('request envelopes', () => {
    it('accepts positive safe identifiers and a bounded exact request', () => {
      expect(parseJsonSchemaWorkerJobId({ jobId: Number.MAX_SAFE_INTEGER })).toBe(Number.MAX_SAFE_INTEGER);
      expect(parseJsonSchemaWorkerRequest({ jobId: 7, task: VALID_TASK })).toEqual({
        jobId: 7,
        task: VALID_TASK,
      });
    });

    it.each([
      undefined,
      null,
      [],
      {},
      { jobId: 0 },
      { jobId: -1 },
      { jobId: 1.5 },
      { jobId: Number.NaN },
      { jobId: Number.POSITIVE_INFINITY },
      { jobId: '1' },
    ])('rejects malformed job envelope %# as a worker failure', (value) => {
      expectTaskError(() => parseJsonSchemaWorkerJobId(value), 'worker');
    });

    it('preserves the envelope identifier while applying task validation', () => {
      const error = expectTaskError(
        () => parseJsonSchemaWorkerRequest({ jobId: 37, task: { ...VALID_TASK, draft: 'draft4' } }),
        'validation',
      );

      expect(error.message).toContain('supported JSON Schema draft');
    });
  });

  describe('worker response decoding', () => {
    it('accepts valid success, invalid-result, and bounded error messages', () => {
      expect(parseJsonSchemaWorkerMessage({
        jobId: 1,
        type: 'result',
        result: { valid: true, completeErrorList: true, warnings: [], errors: [] },
      })).toMatchObject({ jobId: 1, type: 'result', result: { valid: true } });
      expect(parseJsonSchemaWorkerMessage({
        jobId: 2,
        type: 'result',
        result: invalidResult(),
      })).toMatchObject({ jobId: 2, type: 'result', result: { valid: false } });
      expect(parseJsonSchemaWorkerMessage({
        jobId: 3,
        type: 'error',
        code: 'schema',
        message: 'x'.repeat(JSON_SCHEMA_MAX_ERROR_CHARACTERS),
      })).toMatchObject({ jobId: 3, type: 'error', code: 'schema' });
    });

    it.each([
      null,
      {},
      { jobId: 0, type: 'result', result: {} },
      { jobId: 1, type: 'unknown' },
      { jobId: 1, type: 'error', code: 'validation', message: 'invalid' },
      { jobId: 1, type: 'error', code: 'schema', message: 'x'.repeat(JSON_SCHEMA_MAX_ERROR_CHARACTERS + 1) },
      { jobId: 1, type: 'error', code: 'schema', message: 'unsafe\u202Etext' },
      { jobId: 1, type: 'result', result: null },
      {
        jobId: 1,
        type: 'result',
        result: { valid: true, completeErrorList: true, warnings: [], errors: [VALIDATION_ERROR] },
      },
      {
        jobId: 1,
        type: 'result',
        result: { valid: false, completeErrorList: true, warnings: [], errors: [] },
      },
      {
        jobId: 1,
        type: 'result',
        result: { valid: true, completeErrorList: true, warnings: ['unknown'], errors: [] },
      },
      {
        jobId: 1,
        type: 'result',
        result: {
          valid: true,
          completeErrorList: true,
          warnings: ['format-not-validated', 'format-not-validated'],
          errors: [],
        },
      },
    ])('rejects malformed worker message %#', (message) => {
      expectTaskError(() => parseJsonSchemaWorkerMessage(message), 'worker');
    });

    it.each(['instancePath', 'schemaPath', 'keyword', 'message'] as const)(
      'rejects a validation error with oversized %s',
      (field) => {
        const error = {
          ...VALIDATION_ERROR,
          [field]: 'x'.repeat(JSON_SCHEMA_MAX_ERROR_CHARACTERS + 1),
        };
        expectTaskError(
          () => parseJsonSchemaWorkerMessage({ jobId: 1, type: 'result', result: invalidResult(error) }),
          'worker',
        );
      },
    );

    it.each([
      { ...VALIDATION_ERROR, line: 0 },
      { ...VALIDATION_ERROR, line: 1.5 },
      { ...VALIDATION_ERROR, column: 0 },
      { ...VALIDATION_ERROR, column: Number.NaN },
    ])('rejects unsafe validation source coordinates %#', (error) => {
      expectTaskError(
        () => parseJsonSchemaWorkerMessage({ jobId: 1, type: 'result', result: invalidResult(error) }),
        'worker',
      );
    });

    it('rejects an error array beyond the wire cap', () => {
      const errors = Array.from({ length: JSON_SCHEMA_MAX_ERRORS + 1 }, () => VALIDATION_ERROR);

      expectTaskError(
        () => parseJsonSchemaWorkerMessage({
          jobId: 1,
          type: 'result',
          result: { valid: false, completeErrorList: false, warnings: ['incomplete-error-list'], errors },
        }),
        'worker',
      );
    });
  });

  it('preserves typed task failures and sanitizes unknown failures', () => {
    const original = new JsonSchemaTaskError('timeout', 'Timed out.', 123);

    expect(toJsonSchemaTaskError(original)).toBe(original);
    expect(toJsonSchemaTaskError(new Error('sensitive'), 'worker')).toMatchObject({
      code: 'worker',
      message: 'JSON Schema validation failed. Please try again.',
      elapsedMs: 0,
    });
  });
});
