import { generateKeyPair } from './rsa-key-pair-generator.service';
import {
  RSA_WORKER_ERROR_MESSAGES,
  type RsaKeyPair,
  type RsaKeySize,
  type RsaWorkerMessage,
  parseRsaWorkerJobId,
  parseRsaWorkerRequest,
  toRsaTaskError,
} from './rsa-key-pair-generator.worker.protocol';

export type RsaGenerator = (bits: RsaKeySize) => Promise<RsaKeyPair>;

export async function handleRsaWorkerRequest(
  value: unknown,
  generator: RsaGenerator = generateKeyPair,
): Promise<RsaWorkerMessage> {
  let jobId = 1;
  try {
    jobId = parseRsaWorkerJobId(value);
  }
  catch {
    return {
      jobId,
      type: 'error',
      code: 'validation',
      message: RSA_WORKER_ERROR_MESSAGES.validation,
    };
  }

  try {
    const request = parseRsaWorkerRequest(value);
    const result = await generator(request.task.bits);
    return { jobId, type: 'result', result };
  }
  catch (error) {
    const taskError = toRsaTaskError(error);
    const code = taskError.code === 'validation' ? 'validation' : 'generation';
    return {
      jobId,
      type: 'error',
      code,
      message: RSA_WORKER_ERROR_MESSAGES[code],
    };
  }
}
