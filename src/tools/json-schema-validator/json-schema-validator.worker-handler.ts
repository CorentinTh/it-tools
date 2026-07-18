import { validateJsonSchema } from './json-schema-validator.models';
import {
  type JsonSchemaTaskError,
  type JsonSchemaValidationResult,
  type JsonSchemaValidationTask,
  type JsonSchemaWorkerErrorCode,
  type JsonSchemaWorkerMessage,
  parseJsonSchemaWorkerJobId,
  parseJsonSchemaWorkerRequest,
  sanitizeJsonSchemaMessage,
  toJsonSchemaTaskError,
} from './json-schema-validator.worker.protocol';

export type JsonSchemaValidator = (task: JsonSchemaValidationTask) => JsonSchemaValidationResult;

function workerErrorMessage(error: JsonSchemaTaskError): string {
  return sanitizeJsonSchemaMessage(
    error.message,
    'JSON Schema validation failed. Please try again.',
  );
}

export function handleJsonSchemaWorkerRequest(
  value: unknown,
  validator: JsonSchemaValidator = validateJsonSchema,
): JsonSchemaWorkerMessage {
  let jobId = 1;

  try {
    jobId = parseJsonSchemaWorkerJobId(value);
    const request = parseJsonSchemaWorkerRequest(value);
    return {
      jobId,
      type: 'result',
      result: validator(request.task),
    };
  }
  catch (error) {
    const taskError = toJsonSchemaTaskError(error);
    const code: JsonSchemaWorkerErrorCode = taskError.code === 'syntax'
      || taskError.code === 'limit'
      || taskError.code === 'schema'
      || taskError.code === 'unavailable'
      ? taskError.code
      : 'operation';

    return {
      jobId,
      type: 'error',
      code,
      message: workerErrorMessage(taskError),
    };
  }
}
