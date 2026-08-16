import { MessageType, composerize } from 'composerize-ts';
import { convertComposeToDockerRun } from './docker-compose-to-run.service';
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

function toMessageType(value: MessageType | DockerConverterMessageType): DockerConverterMessageType | undefined {
  if (
    value === MessageType.notImplemented
    || value === MessageType.notTranslatable
    || value === MessageType.errorDuringConversion
  ) {
    return value;
  }
  return undefined;
}

function createWireResult(source: string, direction: 'run-to-compose' | 'compose-to-run'): DockerConverterWireResult | undefined {
  let output: string;
  let sourceMessages: Array<{ type: MessageType | DockerConverterMessageType; value: string }>;
  if (direction === 'run-to-compose') {
    const converted = composerize(source.trim());
    output = removeObsoleteComposeVersion(converted.yaml);
    sourceMessages = converted.messages;
  }
  else {
    const converted = convertComposeToDockerRun(source);
    output = converted.commands;
    sourceMessages = converted.messages;
  }
  if (sourceMessages.length > DOCKER_CONVERTER_MAX_MESSAGES) {
    return undefined;
  }
  const yaml = createBoundedTextResult(output, DOCKER_CONVERTER_MAX_OUTPUT_BYTES);
  if (!yaml) {
    return undefined;
  }
  const messages: DockerConverterWireResult['messages'] = [];
  for (const message of sourceMessages) {
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
    const result = createWireResult(task.source, task.direction);
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
