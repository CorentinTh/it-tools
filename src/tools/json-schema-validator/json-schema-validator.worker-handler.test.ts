import { describe, expect, it, vi } from 'vitest';
import { handleJsonSchemaWorkerRequest } from './json-schema-validator.worker-handler';
import {
  JSON_SCHEMA_MAX_BYTES,
  JSON_SCHEMA_MAX_ERROR_CHARACTERS,
  JsonSchemaTaskError,
  type JsonSchemaTaskErrorCode,
  type JsonSchemaValidationResult,
  type JsonSchemaValidationTask,
} from './json-schema-validator.worker.protocol';

const TASK: JsonSchemaValidationTask = {
  schemaSource: '{}',
  instanceSource: 'null',
  draft: 'draft2020',
};

const VALID_RESULT: JsonSchemaValidationResult = {
  valid: true,
  completeErrorList: true,
  warnings: [],
  errors: [],
};

describe('JSON Schema worker handler', () => {
  it('returns a correlated typed result from the injected validator', () => {
    const validator = vi.fn((_task: JsonSchemaValidationTask) => VALID_RESULT);

    expect(handleJsonSchemaWorkerRequest({ jobId: 7, task: TASK }, validator)).toEqual({
      jobId: 7,
      type: 'result',
      result: VALID_RESULT,
    });
    expect(validator).toHaveBeenCalledOnce();
    expect(validator).toHaveBeenCalledWith(TASK);
  });

  it('preserves a valid envelope identifier when task validation fails', () => {
    const validator = vi.fn((_task: JsonSchemaValidationTask) => VALID_RESULT);
    const message = handleJsonSchemaWorkerRequest({
      jobId: 37,
      task: { ...TASK, schemaSource: '' },
    }, validator);

    expect(message).toMatchObject({ jobId: 37, type: 'error', code: 'operation' });
    expect(validator).not.toHaveBeenCalled();
  });

  it('enforces exact worker-only UTF-8 limits before invoking validation', () => {
    const validator = vi.fn((_task: JsonSchemaValidationTask) => VALID_RESULT);
    const schemaSource = 'é'.repeat(Math.floor(JSON_SCHEMA_MAX_BYTES / 2) + 1);
    const message = handleJsonSchemaWorkerRequest({
      jobId: 11,
      task: { ...TASK, schemaSource },
    }, validator);

    expect(message).toMatchObject({ jobId: 11, type: 'error', code: 'limit' });
    expect(validator).not.toHaveBeenCalled();
  });

  it.each(['syntax', 'limit', 'schema', 'unavailable'] as const)(
    'preserves supported %s domain failures on the wire',
    (code) => {
      const message = handleJsonSchemaWorkerRequest({ jobId: 9, task: TASK }, () => {
        throw new JsonSchemaTaskError(code, `${code} failure`);
      });

      expect(message).toEqual({ jobId: 9, type: 'error', code, message: `${code} failure` });
    },
  );

  it.each(['validation', 'operation', 'worker', 'timeout', 'cancelled'] as const satisfies readonly JsonSchemaTaskErrorCode[])(
    'maps non-wire %s failures to operation',
    (code) => {
      const message = handleJsonSchemaWorkerRequest({ jobId: 10, task: TASK }, () => {
        throw new JsonSchemaTaskError(code, `${code} failure`);
      });

      expect(message).toEqual({
        jobId: 10,
        type: 'error',
        code: 'operation',
        message: `${code} failure`,
      });
    },
  );

  it('sanitizes and caps error text before posting it', () => {
    const message = handleJsonSchemaWorkerRequest({ jobId: 12, task: TASK }, () => {
      throw new JsonSchemaTaskError(
        'schema',
        `\u0000unsafe\u202E${'😀'.repeat(JSON_SCHEMA_MAX_ERROR_CHARACTERS)}`,
      );
    });
    const errorMessage = message.type === 'error' ? message.message : '';

    expect(message).toMatchObject({ jobId: 12, type: 'error', code: 'schema' });
    expect(errorMessage.length).toBeLessThanOrEqual(JSON_SCHEMA_MAX_ERROR_CHARACTERS);
    expect(errorMessage).not.toContain('\u0000');
    expect(errorMessage).not.toContain('\u202E');
    expect(errorMessage).not.toMatch(/[\uD800-\uDBFF]$/u);
  });

  it('uses a generic bounded message for unknown validator exceptions', () => {
    const message = handleJsonSchemaWorkerRequest({ jobId: 13, task: TASK }, () => {
      throw new Error('sensitive implementation detail');
    });

    expect(message).toEqual({
      jobId: 13,
      type: 'error',
      code: 'operation',
      message: 'JSON Schema validation failed. Please try again.',
    });
  });

  it('uses a safe fallback identifier and message for an invalid envelope', () => {
    const validator = vi.fn((_task: JsonSchemaValidationTask) => VALID_RESULT);
    const message = handleJsonSchemaWorkerRequest({ task: TASK }, validator);

    expect(message).toEqual({
      jobId: 1,
      type: 'error',
      code: 'operation',
      message: 'The JSON Schema worker returned an invalid job identifier.',
    });
    expect(validator).not.toHaveBeenCalled();
  });
});
