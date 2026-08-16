import { describe, expect, it } from 'vitest';
import { HMAC_MAX_MESSAGE_BYTES, parseHmacTask } from './hmac-generator.worker.protocol';

const task = {
  message: 'data',
  key: '4a656665',
  keyEncoding: 'hex' as const,
  algorithm: 'SHA256' as const,
  outputEncoding: 'Hex' as const,
};

describe('HMAC worker protocol', () => {
  it('accepts only an exact bounded task envelope', () => {
    expect(parseHmacTask(task)).toEqual(task);
    expect(() => parseHmacTask({ ...task, secretName: 'private' })).toThrow('supported HMAC');
  });

  it('rejects oversized messages before worker allocation', () => {
    expect(() => parseHmacTask({ ...task, message: 'x'.repeat(HMAC_MAX_MESSAGE_BYTES + 1) })).toThrow('1 MiB');
  });
});
