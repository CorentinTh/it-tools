import { argon2Verify, argon2id } from 'hash-wasm';
import { parseArgon2idPhc } from './argon2id.service';
import {
  Argon2idTaskError,
  type Argon2idWorkerErrorCode,
  type Argon2idWorkerMessage,
  argon2idErrorMessage,
  parseArgon2idRequest,
} from './argon2id.worker.protocol';
import { isUnknownRecord, isWorkerJobId } from '@/utils/worker-protocol';

function mapProcessingError(error: unknown): Argon2idTaskError {
  if (error instanceof Argon2idTaskError) {
    return error;
  }
  if (typeof WebAssembly === 'undefined') {
    return new Argon2idTaskError('capability', argon2idErrorMessage('capability'));
  }
  return new Argon2idTaskError('processing', argon2idErrorMessage('processing'));
}

export async function handleArgon2idRequest(value: unknown): Promise<Argon2idWorkerMessage> {
  let jobId = isUnknownRecord(value) && isWorkerJobId(value.jobId) ? value.jobId : 1;
  try {
    const request = parseArgon2idRequest(value);
    jobId = request.jobId;
    const { task } = request;
    if (task.operation === 'hash') {
      const phc = await argon2id({
        password: task.password,
        salt: task.salt,
        memorySize: task.memoryKiB,
        iterations: task.iterations,
        parallelism: task.parallelism,
        hashLength: task.hashLength,
        outputType: 'encoded',
      });
      const parsed = parseArgon2idPhc(phc);
      return { jobId, type: 'result', result: { operation: 'hash', phc, memoryKiB: parsed.memoryKiB, iterations: parsed.iterations, parallelism: parsed.parallelism, hashLength: parsed.hashLength } };
    }
    const parsed = parseArgon2idPhc(task.phc);
    const matches = await argon2Verify({ password: task.password, hash: task.phc });
    return { jobId, type: 'result', result: { operation: 'verify', matches, memoryKiB: parsed.memoryKiB, iterations: parsed.iterations, parallelism: parsed.parallelism, hashLength: parsed.hashLength } };
  }
  catch (error) {
    const taskError = mapProcessingError(error);
    const code = ['validation', 'input-limit', 'format', 'capability', 'processing'].includes(taskError.code)
      ? taskError.code as Argon2idWorkerErrorCode
      : 'processing';
    return { jobId, type: 'error', code, message: argon2idErrorMessage(code) };
  }
}
