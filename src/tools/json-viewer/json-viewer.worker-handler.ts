import { formatJson } from './json.models';
import {
  JSON_MAX_OUTPUT_BYTES,
  type JsonFormatTask,
  JsonTaskError,
  type JsonWorkerMessage,
  parseJsonWorkerJobId,
  parseJsonWorkerRequest,
  toJsonTaskError,
} from './json-viewer.worker.protocol';

export type JsonFormatter = (task: JsonFormatTask) => string;

export function handleJsonWorkerRequest(
  value: unknown,
  formatter: JsonFormatter = formatJson,
): JsonWorkerMessage {
  let jobId = 1;

  try {
    // Preserve a valid envelope identifier even when exact worker-only input
    // validation rejects the task.
    jobId = parseJsonWorkerJobId(value);
    const request = parseJsonWorkerRequest(value);
    const output = formatter(request.task);
    const outputBytes = new TextEncoder().encode(output).byteLength;

    if (outputBytes > JSON_MAX_OUTPUT_BYTES) {
      throw new JsonTaskError(
        'limit',
        `Formatted JSON is limited to ${JSON_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
      );
    }

    return {
      jobId,
      type: 'result',
      operation: 'format',
      mode: request.task.mode,
      value: output,
      outputBytes,
    };
  }
  catch (error) {
    const taskError = toJsonTaskError(error);
    const code = taskError.code === 'syntax' || taskError.code === 'limit'
      ? taskError.code
      : 'operation';
    const message = taskError instanceof JsonTaskError
      ? taskError.message.slice(0, 1_000)
      : 'JSON formatting failed. Please try again.';
    return { jobId, type: 'error', code, message };
  }
}
