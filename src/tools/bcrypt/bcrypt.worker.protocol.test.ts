import { describe, expect, it } from 'vitest';
import {
  BCRYPT_MAX_PASSWORD_BYTES,
  BCRYPT_MAX_WORKER_ERROR_MESSAGE_LENGTH,
  BcryptTaskError,
  parseBcryptTask,
  parseBcryptWorkerMessage,
  parseBcryptWorkerRequest,
  sanitizeBcryptWorkerErrorMessage,
} from './bcrypt.worker.protocol';

const VALID_HASH = '$2a$04$ZO/2lWFV.hnClD.GPEoHTO8tMHsQCK7tpnz3QP/lZSDpbF5N7ZI8C';

function expectErrorCode(action: () => unknown, code: BcryptTaskError['code']): void {
  try {
    action();
    throw new Error('Expected the action to throw.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(BcryptTaskError);
    expect((error as BcryptTaskError).code).toBe(code);
  }
}

describe('bcrypt worker protocol', () => {
  it('accepts the rounds boundaries and an empty string without silently changing them', () => {
    expect(parseBcryptTask({ operation: 'hash', value: '', rounds: 4 })).toEqual({
      operation: 'hash',
      value: '',
      rounds: 4,
    });
    expect(parseBcryptTask({ operation: 'hash', value: 'secret', rounds: 14 })).toEqual({
      operation: 'hash',
      value: 'secret',
      rounds: 14,
    });
  });

  it.each([null, '', 3, 15, 4.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects unsafe or malformed rounds: %s',
    (rounds) => {
      expectErrorCode(() => parseBcryptTask({ operation: 'hash', value: 'secret', rounds }), 'validation');
    },
  );

  it('enforces the bcrypt 72-byte UTF-8 input boundary', () => {
    const exactAsciiBoundary = 'a'.repeat(BCRYPT_MAX_PASSWORD_BYTES);
    const exactUnicodeBoundary = '🙂'.repeat(BCRYPT_MAX_PASSWORD_BYTES / 4);

    expect(parseBcryptTask({ operation: 'hash', value: exactAsciiBoundary, rounds: 4 })).toMatchObject({
      value: exactAsciiBoundary,
    });
    expect(parseBcryptTask({ operation: 'hash', value: exactUnicodeBoundary, rounds: 4 })).toMatchObject({
      value: exactUnicodeBoundary,
    });
    expectErrorCode(
      () => parseBcryptTask({ operation: 'hash', value: `${exactUnicodeBoundary}🙂`, rounds: 4 }),
      'validation',
    );
  });

  it('validates compare hashes and their embedded work factor', () => {
    expect(parseBcryptTask({ operation: 'compare', value: 'secret', hash: VALID_HASH })).toEqual({
      operation: 'compare',
      value: 'secret',
      hash: VALID_HASH,
    });

    expectErrorCode(() => parseBcryptTask({ operation: 'compare', value: 'secret', hash: '' }), 'validation');
    expectErrorCode(() => parseBcryptTask({ operation: 'compare', value: 'secret', hash: 'not-a-hash' }), 'validation');
    expectErrorCode(
      () => parseBcryptTask({ operation: 'compare', value: 'secret', hash: VALID_HASH.replace('$04$', '$15$') }),
      'validation',
    );
  });

  it('rejects unknown tasks and malformed worker job identifiers', () => {
    const validTask = { operation: 'hash' as const, value: 'secret', rounds: 4 };

    expectErrorCode(() => parseBcryptTask(null), 'validation');
    expectErrorCode(() => parseBcryptTask({ operation: 'remove' }), 'validation');
    expectErrorCode(() => parseBcryptWorkerRequest({ jobId: 0, task: {} }), 'validation');
    expectErrorCode(() => parseBcryptWorkerRequest({ jobId: '1', task: {} }), 'validation');
    expectErrorCode(() => parseBcryptTask(Object.assign([], validTask)), 'validation');
    expectErrorCode(
      () => parseBcryptWorkerRequest(Object.assign([], { jobId: 1, task: validTask })),
      'validation',
    );

    expect(parseBcryptWorkerRequest({
      jobId: 7,
      task: { operation: 'hash', value: 'secret', rounds: 4 },
    })).toEqual({
      jobId: 7,
      task: { operation: 'hash', value: 'secret', rounds: 4 },
    });
  });

  it('accepts only bounded progress and typed worker results', () => {
    expect(parseBcryptWorkerMessage({ jobId: 1, type: 'progress', progress: 0 })).toMatchObject({ progress: 0 });
    expect(parseBcryptWorkerMessage({ jobId: 1, type: 'progress', progress: 1 })).toMatchObject({ progress: 1 });
    expect(parseBcryptWorkerMessage({ jobId: 1, type: 'result', operation: 'hash', value: VALID_HASH })).toMatchObject({
      operation: 'hash',
      value: VALID_HASH,
    });
    expect(parseBcryptWorkerMessage({ jobId: 1, type: 'result', operation: 'compare', value: false })).toMatchObject({
      operation: 'compare',
      value: false,
    });

    expectErrorCode(() => parseBcryptWorkerMessage({ jobId: 1, type: 'progress', progress: -0.1 }), 'worker');
    expectErrorCode(() => parseBcryptWorkerMessage({ jobId: 1, type: 'progress', progress: 1.1 }), 'worker');
    expectErrorCode(() => parseBcryptWorkerMessage({ jobId: 1, type: 'result', operation: 'hash', value: 'not-a-hash' }), 'worker');
    expectErrorCode(() => parseBcryptWorkerMessage({ jobId: 1, type: 'result', operation: 'compare', value: 'yes' }), 'worker');
    expectErrorCode(() => parseBcryptWorkerMessage({ jobId: 1, type: 'unexpected' }), 'worker');
    expectErrorCode(
      () => parseBcryptWorkerMessage(Object.assign([], {
        jobId: 1,
        type: 'result',
        operation: 'compare',
        value: false,
      })),
      'worker',
    );
  });

  it.each(['', 'x'.repeat(1_001)])(
    'rejects an empty or oversized worker error message',
    (message) => {
      expectErrorCode(
        () => parseBcryptWorkerMessage({ jobId: 1, type: 'error', code: 'operation', message }),
        'worker',
      );
    },
  );

  it('sanitizes and caps worker-side error text before it crosses the protocol boundary', () => {
    const message = sanitizeBcryptWorkerErrorMessage(`  failure\u0000${'x'.repeat(2_000)}  `);

    expect(message.length).toBeLessThanOrEqual(BCRYPT_MAX_WORKER_ERROR_MESSAGE_LENGTH);
    expect(message.length).toBeGreaterThan(0);
    expect(message).not.toContain('\u0000');
    expect(message.startsWith('failure ')).toBe(true);
  });
});
