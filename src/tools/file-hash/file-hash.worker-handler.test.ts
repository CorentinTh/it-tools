// @vitest-environment node

import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import {
  FILE_HASH_ALGORITHMS,
  FILE_HASH_WINDOW_BYTES,
  FILE_HASH_WORKER_ERROR_MESSAGES,
  type FileHashAlgorithm,
  type FileHashWorkerMessage,
} from './file-hash.worker.protocol';
import {
  type FileHashIncrementalHasher,
  handleFileHashWorkerRequest,
} from './file-hash.worker-handler';

const OFFICIAL_VECTORS = {
  '': {
    'MD5': 'd41d8cd98f00b204e9800998ecf8427e',
    'SHA-1': 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    'SHA-256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'SHA-384': '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
    'SHA-512': 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    'SHA3-256': 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a',
    'BLAKE3-256': 'af1349b9f5f9a1a6a0404dea36dcc9499bcb25c9adc112b7cc9a93cae41f3262',
  },
  'abc': {
    'MD5': '900150983cd24fb0d6963f7d28e17f72',
    'SHA-1': 'a9993e364706816aba3e25717850c26c9cd0d89d',
    'SHA-256': 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    'SHA-384': 'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
    'SHA-512': 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
    'SHA3-256': '3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532',
    'BLAKE3-256': '6437b3ac38465133ffb63b75273a8db548c558465d79db03fd359c6cd5bd9d85',
  },
} as const;

const NODE_HASH_ALGORITHMS = FILE_HASH_ALGORITHMS.filter(
  (algorithm): algorithm is Exclude<FileHashAlgorithm, 'BLAKE3-256'> => algorithm !== 'BLAKE3-256',
);

function request(file: Blob, algorithms: FileHashAlgorithm[] = [...FILE_HASH_ALGORITHMS]) {
  return { jobId: 7, task: { file, algorithms } };
}

function progressCollector() {
  const messages: Array<Extract<FileHashWorkerMessage, { type: 'progress' }>> = [];
  return {
    emitProgress: (message: Extract<FileHashWorkerMessage, { type: 'progress' }>) => messages.push(message),
    messages,
  };
}

function binaryFixture(length: number): Uint8Array {
  return Uint8Array.from({ length }, (_, index) => (index * 131 + 17) & 0xFF);
}

function nodeDigest(algorithm: FileHashAlgorithm, bytes: Uint8Array): string {
  const nodeAlgorithm = {
    'MD5': 'md5',
    'SHA-1': 'sha1',
    'SHA-256': 'sha256',
    'SHA-384': 'sha384',
    'SHA-512': 'sha512',
    'SHA3-256': 'sha3-256',
  } as const;
  if (algorithm === 'BLAKE3-256') {
    throw new Error('Node does not provide BLAKE3 in createHash.');
  }
  return createHash(nodeAlgorithm[algorithm]).update(bytes).digest('hex');
}

describe('file hash worker handler', () => {
  it.each(['', 'abc'] as const)('matches official supported-algorithm vectors for %j', async (source) => {
    const progress = progressCollector();
    const response = await handleFileHashWorkerRequest(request(new Blob([source])), progress);

    expect(response).toEqual({
      jobId: 7,
      type: 'result',
      result: {
        fileSize: source.length,
        digests: FILE_HASH_ALGORITHMS.map(algorithm => ({
          algorithm,
          hex: OFFICIAL_VECTORS[source][algorithm],
        })),
      },
    });
    expect(progress.messages.map(({ progress: value }) => value)).toEqual([
      { bytesProcessed: 0, totalBytes: source.length },
      { bytesProcessed: source.length, totalBytes: source.length },
    ]);
  });

  it.each([55, 56, 63, 64, 65, 111, 112, 127, 128, 129])(
    'matches Node-supported hashes at the %i-byte padding boundary',
    async (length) => {
      const bytes = binaryFixture(length);
      const response = await handleFileHashWorkerRequest(
        request(new Blob([bytes]), [...NODE_HASH_ALGORITHMS]),
        { windowBytes: 17 },
      );

      expect(response).toMatchObject({ type: 'result' });
      if (response.type === 'result') {
        expect(response.result.digests).toEqual(NODE_HASH_ALGORITHMS.map(algorithm => ({
          algorithm,
          hex: nodeDigest(algorithm, bytes),
        })));
      }
    },
  );

  it.each([15, 16, 17, 49])(
    'matches Node-supported hashes for a %i-byte file around the injected 16-byte window',
    async (length) => {
      const bytes = binaryFixture(length);
      const response = await handleFileHashWorkerRequest(request(new Blob([bytes]), [...NODE_HASH_ALGORITHMS]), { windowBytes: 16 });

      expect(response).toMatchObject({ type: 'result' });
      if (response.type === 'result') {
        expect(response.result.digests).toEqual(NODE_HASH_ALGORITHMS.map(algorithm => ({
          algorithm,
          hex: nodeDigest(algorithm, bytes),
        })));
      }
    },
  );

  it.each([
    FILE_HASH_WINDOW_BYTES - 1,
    FILE_HASH_WINDOW_BYTES,
    FILE_HASH_WINDOW_BYTES + 1,
    FILE_HASH_WINDOW_BYTES * 2 + 37,
  ])(
    'uses exact production-window slices and matches Node SHA-256 for %i bytes',
    async (length) => {
      const bytes = binaryFixture(length);
      const file = new Blob([bytes]);
      const wholeFileRead = vi.spyOn(file, 'arrayBuffer');
      const slice = vi.spyOn(file, 'slice');
      const response = await handleFileHashWorkerRequest(request(file, ['SHA-256']));
      const expectedSlices: Array<[number, number]> = [];
      for (let start = 0; start < length; start += FILE_HASH_WINDOW_BYTES) {
        expectedSlices.push([start, Math.min(start + FILE_HASH_WINDOW_BYTES, length)]);
      }

      expect(wholeFileRead).not.toHaveBeenCalled();
      expect(slice.mock.calls.map(([start, end]) => [start, end])).toEqual(expectedSlices);
      expect(expectedSlices.every(([start, end]) => end - start <= FILE_HASH_WINDOW_BYTES)).toBe(true);
      expect(response).toMatchObject({
        type: 'result',
        result: {
          digests: [{ algorithm: 'SHA-256', hex: nodeDigest('SHA-256', bytes) }],
        },
      });
    },
  );

  it('reads one bounded slice at a time and updates all selected hashes in one pass', async () => {
    const file = new Blob(['abcdef']);
    const wholeFileRead = vi.spyOn(file, 'arrayBuffer');
    const slice = vi.spyOn(file, 'slice');
    const smallWindow = await handleFileHashWorkerRequest(request(file), { windowBytes: 2 });
    const singleWindow = await handleFileHashWorkerRequest(request(new Blob(['abcdef'])));

    expect(wholeFileRead).not.toHaveBeenCalled();
    expect(slice.mock.calls.map(([start, end]) => [start, end])).toEqual([[0, 2], [2, 4], [4, 6]]);
    expect(smallWindow).toMatchObject({ type: 'result' });
    expect(singleWindow).toMatchObject({ type: 'result' });
    if (smallWindow.type === 'result' && singleWindow.type === 'result') {
      expect(smallWindow.result.digests).toEqual(singleWindow.result.digests);
    }
  });

  it('throttles intermediate progress while preserving initial and final messages', async () => {
    const progress = progressCollector();
    const times = [0, 20, 40, 100, 120, 200];
    await handleFileHashWorkerRequest(request(new Blob(['abcdef']), ['SHA-256']), {
      ...progress,
      windowBytes: 1,
      now: () => times.shift() ?? 200,
    });

    expect(progress.messages.map(({ progress: { bytesProcessed } }) => bytesProcessed))
      .toEqual([0, 3, 5, 6]);
  });

  it('fails closed with a static read error for rejected or short window reads', async () => {
    const rejected = new Blob(['secret']);
    vi.spyOn(rejected, 'slice').mockImplementation(() => {
      const window = new Blob([]);
      vi.spyOn(window, 'arrayBuffer').mockRejectedValue(new DOMException('secret.txt'));
      return window;
    });
    await expect(handleFileHashWorkerRequest(request(rejected, ['SHA-256'])))
      .resolves.toEqual({
        jobId: 7,
        type: 'error',
        code: 'read',
        message: FILE_HASH_WORKER_ERROR_MESSAGES.read,
      });

    const short = new Blob(['abcd']);
    vi.spyOn(short, 'slice').mockImplementation((start, end, type) => {
      const window = Blob.prototype.slice.call(short, start, end, type);
      vi.spyOn(window, 'arrayBuffer').mockResolvedValue(new Uint8Array(Math.max(0, window.size - 1)).buffer);
      return window;
    });
    await expect(handleFileHashWorkerRequest(request(short, ['SHA-256']), { windowBytes: 2 }))
      .resolves.toMatchObject({ type: 'error', code: 'read', message: FILE_HASH_WORKER_ERROR_MESSAGES.read });

    const wrongBufferType = new Blob(['ab']);
    vi.spyOn(wrongBufferType, 'slice').mockImplementation(() => {
      const window = new Blob([]);
      Object.defineProperty(window, 'arrayBuffer', {
        value: () => Promise.resolve(new Uint8Array([1, 2])),
      });
      return window;
    });
    await expect(handleFileHashWorkerRequest(request(wrongBufferType, ['SHA-256'])))
      .resolves.toMatchObject({ type: 'error', code: 'read', message: FILE_HASH_WORKER_ERROR_MESSAGES.read });
  });

  it('maps hash failures and unsupported requests to static messages and destroys state', async () => {
    const destroy = vi.fn();
    const failingHasher: FileHashIncrementalHasher = {
      update: () => {
        throw new DOMException('secret-file-name.bin');
      },
      digest: () => new Uint8Array(32),
      destroy,
    };
    await expect(handleFileHashWorkerRequest(request(new Blob(['abc']), ['SHA-256']), {
      createHasher: () => failingHasher,
    })).resolves.toEqual({
      jobId: 7,
      type: 'error',
      code: 'hash',
      message: FILE_HASH_WORKER_ERROR_MESSAGES.hash,
    });
    expect(destroy).toHaveBeenCalledOnce();

    await expect(handleFileHashWorkerRequest({
      jobId: 41,
      task: { file: new Blob([]), algorithms: ['CRC32'] },
    })).resolves.toEqual({
      jobId: 41,
      type: 'error',
      code: 'unsupported',
      message: FILE_HASH_WORKER_ERROR_MESSAGES.unsupported,
    });
  });

  it('keeps a successful result when finalization already destroyed noble-like state', async () => {
    let finalized = false;
    const destroy = vi.fn(() => {
      if (finalized) {
        throw new Error('already destroyed');
      }
    });
    const hasher: FileHashIncrementalHasher = {
      update: () => undefined,
      digest: () => {
        finalized = true;
        return new Uint8Array(32);
      },
      destroy,
    };

    await expect(handleFileHashWorkerRequest(request(new Blob([]), ['SHA-256']), {
      createHasher: () => hasher,
    })).resolves.toMatchObject({
      type: 'result',
      result: { digests: [{ algorithm: 'SHA-256', hex: '0'.repeat(64) }] },
    });
    expect(destroy).toHaveBeenCalledOnce();
  });
});
