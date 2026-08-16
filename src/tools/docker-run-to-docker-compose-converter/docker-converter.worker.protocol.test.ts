import { describe, expect, it } from 'vitest';
import {
  DOCKER_CONVERTER_MAX_INPUT_BYTES,
  parseDockerConverterTask,
  parseDockerConverterWorkerMessage,
} from './docker-converter.worker.protocol';

describe('Docker converter worker protocol', () => {
  it('accepts only exact non-empty tasks within the input bound', () => {
    expect(parseDockerConverterTask({ direction: 'run-to-compose', source: 'docker run nginx' }))
      .toEqual({ direction: 'run-to-compose', source: 'docker run nginx' });
    expect(() => parseDockerConverterTask({ direction: 'invalid', source: 'docker run nginx' })).toThrow();
    expect(() => parseDockerConverterTask({ direction: 'run-to-compose', source: '', extra: true })).toThrow('Enter a Docker run command');
    expect(() => parseDockerConverterTask({ direction: 'run-to-compose', source: 'a'.repeat(DOCKER_CONVERTER_MAX_INPUT_BYTES + 1) }))
      .toThrow('limited');
  });

  it('rejects extra result fields and implausible byte metadata', () => {
    expect(() => parseDockerConverterWorkerMessage({
      jobId: 1,
      type: 'result',
      result: { yaml: { value: 'x', byteLength: 1 }, messages: [], extra: true },
    })).toThrow('invalid message');
    expect(() => parseDockerConverterWorkerMessage({
      jobId: 1,
      type: 'result',
      result: { yaml: { value: 'x', byteLength: 99 }, messages: [] },
    })).toThrow('invalid message');
  });
});
