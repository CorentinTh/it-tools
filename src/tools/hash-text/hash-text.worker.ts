import type { lib } from 'crypto-js';
import { MD5, RIPEMD160, SHA1, SHA224, SHA256, SHA3, SHA384, SHA512, enc } from 'crypto-js';
import { convertHexToBin } from './hash-text.service';
import {
  HASH_TEXT_ALGORITHMS,
  HASH_TEXT_ERROR_MESSAGES,
  HASH_TEXT_MAX_OUTPUT_BYTES,
  type HashTextAlgorithm,
  type HashTextDigests,
  type HashTextEncoding,
  parseHashTextTask,
} from './hash-text.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

const algorithms = { MD5, SHA1, SHA224, SHA256, SHA384, SHA512, SHA3, RIPEMD160 } as const;

interface HashTextWorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

function formatDigest(words: lib.WordArray, encoding: HashTextEncoding): string {
  return encoding === 'Bin'
    ? convertHexToBin(words.toString(enc.Hex))
    : words.toString(enc[encoding]);
}

export function hashText(source: string, encoding: HashTextEncoding): HashTextDigests {
  return Object.fromEntries(HASH_TEXT_ALGORITHMS.map((algorithm: HashTextAlgorithm) => [
    algorithm,
    formatDigest(algorithms[algorithm](source), encoding),
  ])) as HashTextDigests;
}

export function handleHashTextWorkerRequest(value: unknown): BoundedTextWorkerMessage {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseHashTextTask);
    const result = createBoundedTextResult(
      JSON.stringify(hashText(task.source, task.encoding)),
      HASH_TEXT_MAX_OUTPUT_BYTES,
    );
    return result === undefined
      ? { jobId, type: 'error', code: 'output-limit', message: HASH_TEXT_ERROR_MESSAGES['output-limit'] }
      : { jobId, type: 'result', result };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: HASH_TEXT_ERROR_MESSAGES[code] };
  }
}

const workerScope = globalThis as unknown as HashTextWorkerScope;
workerScope.addEventListener('message', event => workerScope.postMessage(handleHashTextWorkerRequest(event.data)));
