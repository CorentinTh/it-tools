import { describe, expect, it } from 'vitest';
import { parseArgon2idMessage, parseArgon2idRequest, parseArgon2idTask } from './argon2id.worker.protocol';

const PHC = '$argon2id$v=19$m=4096,t=3,p=1$PcEZHj1maR/+ZQynyJHWZg$2jEN4xcww7CYp1jakZB1rxbYsZ55XH2HgjYRtdZtubI';

describe('Argon2id worker protocol', () => {
  it('accepts exact bounded hash and verify tasks and clones salt bytes', () => {
    const salt = new Uint8Array(16).fill(7);
    const task = parseArgon2idTask({ operation: 'hash', password: 'secret', salt, memoryKiB: 4096, iterations: 3, parallelism: 1, hashLength: 32 });
    expect(task).toMatchObject({ operation: 'hash', password: 'secret', memoryKiB: 4096 });
    if (task.operation !== 'hash') {
      throw new Error('Expected hash task.');
    }
    expect(task.salt).not.toBe(salt);
    expect(parseArgon2idRequest({ jobId: 2, task: { operation: 'verify', password: 'secret', phc: PHC } })).toMatchObject({ jobId: 2, task: { operation: 'verify' } });
  });

  it('rejects extra keys and resource-exhaustion PHC parameters before worker work', () => {
    expect(() => parseArgon2idTask({ operation: 'verify', password: 'secret', phc: PHC, extra: true })).toThrow(/valid bounded/u);
    expect(() => parseArgon2idTask({ operation: 'verify', password: 'secret', phc: PHC.replace('m=4096', 'm=4294967295') })).toThrow(/safety limits/u);
    expect(() => parseArgon2idTask({ operation: 'hash', password: 'secret', salt: new Uint8Array(15), memoryKiB: 4096, iterations: 3, parallelism: 1, hashLength: 32 })).toThrow(/safety limits/u);
  });

  it('validates result consistency and permits only static worker errors', () => {
    expect(parseArgon2idMessage({ jobId: 1, type: 'result', result: { operation: 'verify', matches: true, memoryKiB: 4096, iterations: 3, parallelism: 1, hashLength: 32 } })).toMatchObject({ type: 'result' });
    expect(() => parseArgon2idMessage({ jobId: 1, type: 'result', result: { operation: 'hash', phc: PHC, memoryKiB: 8, iterations: 3, parallelism: 1, hashLength: 32 } })).toThrow(/invalid message/u);
    expect(() => parseArgon2idMessage({ jobId: 1, type: 'error', code: 'processing', message: 'secret leaked' })).toThrow(/invalid message/u);
  });
});
