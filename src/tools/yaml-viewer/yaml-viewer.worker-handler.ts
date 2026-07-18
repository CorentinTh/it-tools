import { formatYaml } from './yaml-viewer.models';
import {
  YAML_MAX_OUTPUT_BYTES,
  type YamlFormatTask,
  YamlTaskError,
  type YamlWorkerMessage,
  parseYamlWorkerJobId,
  parseYamlWorkerRequest,
  toYamlTaskError,
} from './yaml-viewer.worker.protocol';

export type YamlFormatter = (task: YamlFormatTask) => string;

export function handleYamlWorkerRequest(
  value: unknown,
  formatter: YamlFormatter = formatYaml,
): YamlWorkerMessage {
  let jobId = 1;

  try {
    // Preserve a valid envelope identifier even when exact worker-only input
    // validation rejects the task.
    jobId = parseYamlWorkerJobId(value);
    const request = parseYamlWorkerRequest(value);
    const output = formatter(request.task);
    const outputBytes = new TextEncoder().encode(output).byteLength;

    if (outputBytes > YAML_MAX_OUTPUT_BYTES) {
      throw new YamlTaskError(
        'limit',
        `Formatted YAML is limited to ${YAML_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
      );
    }

    return {
      jobId,
      type: 'result',
      operation: 'format',
      value: output,
      outputBytes,
    };
  }
  catch (error) {
    const taskError = toYamlTaskError(error);
    const code = taskError.code === 'syntax' || taskError.code === 'limit'
      ? taskError.code
      : 'operation';
    const message = taskError instanceof YamlTaskError
      ? taskError.message.slice(0, 1_000)
      : 'YAML formatting failed. Please try again.';
    return { jobId, type: 'error', code, message };
  }
}
