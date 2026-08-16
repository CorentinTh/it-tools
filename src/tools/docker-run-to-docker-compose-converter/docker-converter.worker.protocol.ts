import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit, hasPlausibleUtf8ByteLength } from '@/utils/utf8';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

export const DOCKER_CONVERTER_LIVE_MAX_BYTES = 16 * 1024;
export const DOCKER_CONVERTER_MAX_INPUT_BYTES = 256 * 1024;
export const DOCKER_CONVERTER_MAX_OUTPUT_BYTES = 512 * 1024;
export const DOCKER_CONVERTER_MAX_MESSAGES = 100;
export const DOCKER_CONVERTER_MAX_MESSAGE_BYTES = 4 * 1024;
export const DOCKER_CONVERTER_TASK_TIMEOUT_MS = 4_000;

export const DOCKER_CONVERTER_DIRECTIONS = ['run-to-compose', 'compose-to-run'] as const;
export type DockerConverterDirection = typeof DOCKER_CONVERTER_DIRECTIONS[number];
export type DockerConverterMessageType = 'notImplemented' | 'notTranslatable' | 'errorDuringConversion';
export type DockerConverterErrorCode = 'validation' | 'input-limit' | 'output-limit' | 'processing';

export interface DockerConverterTask {
  direction: DockerConverterDirection
  source: string
}

export interface DockerConverterMessage {
  type: DockerConverterMessageType
  value: string
}

export interface DockerConverterResult {
  messages: DockerConverterMessage[]
  yaml: string
}

interface BoundedWireText {
  byteLength: number
  value: string
}

interface DockerConverterWireMessage extends BoundedWireText {
  type: DockerConverterMessageType
}

export interface DockerConverterWireResult {
  messages: DockerConverterWireMessage[]
  yaml: BoundedWireText
}

export interface DockerConverterWorkerRequest {
  jobId: number
  task: DockerConverterTask
}

export type DockerConverterWorkerMessage =
  | { jobId: number; type: 'result'; result: DockerConverterWireResult }
  | { jobId: number; type: 'error'; code: DockerConverterErrorCode; message: string };

export const DOCKER_CONVERTER_ERRORS: Record<DockerConverterErrorCode, string> = {
  'validation': 'Enter a Docker run command to convert.',
  'input-limit': `Docker command input is limited to ${DOCKER_CONVERTER_MAX_INPUT_BYTES.toLocaleString('en')} UTF-8 bytes.`,
  'output-limit': `Docker Compose output is limited to ${DOCKER_CONVERTER_MAX_OUTPUT_BYTES.toLocaleString('en')} UTF-8 bytes and ${DOCKER_CONVERTER_MAX_MESSAGES} messages.`,
  'processing': 'The Docker run command could not be converted.',
};

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function isMessageType(value: unknown): value is DockerConverterMessageType {
  return value === 'notImplemented' || value === 'notTranslatable' || value === 'errorDuringConversion';
}

export function parseDockerConverterTask(value: unknown): DockerConverterTask {
  if (
    !isUnknownRecord(value)
    || !hasExactKeys(value, ['direction', 'source'])
    || typeof value.direction !== 'string'
    || !DOCKER_CONVERTER_DIRECTIONS.includes(value.direction as DockerConverterDirection)
    || typeof value.source !== 'string'
    || value.source.trim() === ''
  ) {
    throw new BoundedTextTaskError('validation', DOCKER_CONVERTER_ERRORS.validation);
  }
  if (exceedsUtf8ByteLimit(value.source, DOCKER_CONVERTER_MAX_INPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', DOCKER_CONVERTER_ERRORS['input-limit']);
  }
  return { direction: value.direction as DockerConverterDirection, source: value.source };
}

export function parseDockerConverterWorkerRequest(value: unknown): DockerConverterWorkerRequest {
  if (!isUnknownRecord(value) || !hasExactKeys(value, ['jobId', 'task']) || !isWorkerJobId(value.jobId)) {
    throw new BoundedTextTaskError('validation', DOCKER_CONVERTER_ERRORS.validation);
  }
  return { jobId: value.jobId, task: parseDockerConverterTask(value.task) };
}

function parseWireText(value: unknown, maxBytes: number): BoundedWireText | undefined {
  if (
    !isUnknownRecord(value)
    || !hasExactKeys(value, ['byteLength', 'value'])
    || typeof value.value !== 'string'
    || !hasPlausibleUtf8ByteLength(value.value, value.byteLength, maxBytes)
  ) {
    return undefined;
  }
  return { byteLength: value.byteLength, value: value.value };
}

export function parseDockerConverterWorkerMessage(value: unknown): DockerConverterWorkerMessage {
  if (!isUnknownRecord(value) || !isWorkerJobId(value.jobId)) {
    throw new BoundedTextTaskError('worker', 'The Docker converter worker returned an invalid message.');
  }

  if (
    value.type === 'result'
    && hasExactKeys(value, ['jobId', 'result', 'type'])
    && isUnknownRecord(value.result)
    && hasExactKeys(value.result, ['messages', 'yaml'])
    && Array.isArray(value.result.messages)
    && value.result.messages.length <= DOCKER_CONVERTER_MAX_MESSAGES
  ) {
    const yaml = parseWireText(value.result.yaml, DOCKER_CONVERTER_MAX_OUTPUT_BYTES);
    const messages = value.result.messages.map((message): DockerConverterWireMessage | undefined => {
      if (!isUnknownRecord(message) || !hasExactKeys(message, ['byteLength', 'type', 'value']) || !isMessageType(message.type)) {
        return undefined;
      }
      const text = parseWireText({ byteLength: message.byteLength, value: message.value }, DOCKER_CONVERTER_MAX_MESSAGE_BYTES);
      return text && { ...text, type: message.type };
    });
    if (yaml && messages.every((message): message is DockerConverterWireMessage => message !== undefined)) {
      return { jobId: value.jobId, type: 'result', result: { yaml, messages } };
    }
  }

  if (
    value.type === 'error'
    && hasExactKeys(value, ['code', 'jobId', 'message', 'type'])
    && (value.code === 'validation' || value.code === 'input-limit' || value.code === 'output-limit' || value.code === 'processing')
    && value.message === DOCKER_CONVERTER_ERRORS[value.code]
  ) {
    return { jobId: value.jobId, type: 'error', code: value.code, message: value.message };
  }

  throw new BoundedTextTaskError('worker', 'The Docker converter worker returned an invalid message.');
}
