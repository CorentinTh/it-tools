import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateKeyPair } from './rsa-key-pair-generator.service';

const mocks = vi.hoisted(() => ({
  generateKeyPair: vi.fn(),
}));

vi.mock('node-forge', () => ({
  pki: {
    privateKeyToPem: vi.fn(),
    publicKeyToPem: vi.fn(),
    rsa: {
      generateKeyPair: mocks.generateKeyPair,
    },
  },
}));

vi.mock('node-forge/dist/prime.worker.min?url', () => ({
  default: '/prime.worker.js',
}));

describe('RSA key-pair generation cancellation', () => {
  beforeEach(() => {
    mocks.generateKeyPair.mockReset();
  });

  it('does not start node-forge when the request is already aborted', async () => {
    const controller = new AbortController();
    const reason = new Error('superseded');
    controller.abort(reason);

    await expect(generateKeyPair({ signal: controller.signal })).rejects.toBe(reason);
    expect(mocks.generateKeyPair).not.toHaveBeenCalled();
  });

  it('rejects an in-flight wrapper as soon as it is aborted', async () => {
    mocks.generateKeyPair.mockImplementation(() => undefined);
    const controller = new AbortController();
    const reason = new Error('superseded');
    const pending = generateKeyPair({ bits: 2048, signal: controller.signal });

    expect(mocks.generateKeyPair).toHaveBeenCalledTimes(1);

    controller.abort(reason);

    await expect(pending).rejects.toBe(reason);
  });
});
