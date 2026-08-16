import { generateEd25519KeyPair } from './ed25519-key-workspace.service';
import {
  ED25519_WORKER_ERROR_MESSAGES,
  type Ed25519KeyPair,
  type Ed25519WorkerMessage,
  parseEd25519WorkerRequest,
} from './ed25519-key-workspace.worker.protocol';

export type Ed25519Generator = (comment: string) => Promise<Ed25519KeyPair>;

export async function handleEd25519WorkerRequest(
  value: unknown,
  generator: Ed25519Generator = generateEd25519KeyPair,
): Promise<Ed25519WorkerMessage> {
  let jobId = 1;
  try {
    const request = parseEd25519WorkerRequest(value);
    jobId = request.jobId;
    const task = request.task;
    return { jobId, type: 'result', result: await generator(task.comment) };
  }
  catch (error) {
    const name = error instanceof DOMException ? error.name : '';
    const code = name === 'NotSupportedError'
      ? 'unavailable'
      : error instanceof Error && error.name === 'Ed25519TaskError'
        ? 'validation'
        : 'generation';
    return { jobId, type: 'error', code, message: ED25519_WORKER_ERROR_MESSAGES[code] };
  }
}
