import { MessageType, composerize } from 'composerize-ts';
import { removeObsoleteComposeVersion } from './docker-compose-output';
import {
  DOCKER_CONVERTER_ERRORS,
  DOCKER_CONVERTER_MAX_MESSAGES,
  DOCKER_CONVERTER_MAX_MESSAGE_BYTES,
  DOCKER_CONVERTER_MAX_OUTPUT_BYTES,
  type DockerConverterErrorCode,
  type DockerConverterMessageType,
  type DockerConverterWireResult,
  type DockerConverterWorkerMessage,
  parseDockerConverterWorkerRequest,
} from './docker-converter.worker.protocol';
import { BoundedTextTaskError, createBoundedTextResult, parseBoundedTextWorkerJobId } from '@/utils/bounded-text-task';

function toMessageType(value: MessageType): DockerConverterMessageType | undefined {
  if (
    value === MessageType.notImplemented
    || value === MessageType.notTranslatable
    || value === MessageType.errorDuringConversion
  ) {
    return value;
  }
  return undefined;
}

function createWireResult(source: string): DockerConverterWireResult | undefined {
  const converted = composerize(source.trim());
  if (converted.messages.length > DOCKER_CONVERTER_MAX_MESSAGES) {
    return undefined;
  }
  const yaml = createBoundedTextResult(removeObsoleteComposeVersion(converted.yaml), DOCKER_CONVERTER_MAX_OUTPUT_BYTES);
  if (!yaml) {
    return undefined;
  }
  const messages: DockerConverterWireResult['messages'] = [];
  for (const message of converted.messages) {
    const type = toMessageType(message.type);
    const text = createBoundedTextResult(message.value, DOCKER_CONVERTER_MAX_MESSAGE_BYTES);
    if (!type || !text) {
      return undefined;
    }
    messages.push({ ...text, type });
  }
  const totalBytes = yaml.byteLength + messages.reduce((total, message) => total + message.byteLength, 0);
  return totalBytes <= DOCKER_CONVERTER_MAX_OUTPUT_BYTES
    ? { yaml, messages }
    : undefined;
}

export function handleDockerConverterWorkerRequest(value: unknown): DockerConverterWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseDockerConverterWorkerRequest(value);
    const result = createWireResult(task.source);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: DOCKER_CONVERTER_ERRORS['output-limit'] };
  }
  catch (error) {
    const code: DockerConverterErrorCode = error instanceof BoundedTextTaskError
      && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: DOCKER_CONVERTER_ERRORS[code] };
  }
}
