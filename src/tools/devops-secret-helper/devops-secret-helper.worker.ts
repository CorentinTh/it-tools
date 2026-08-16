/// <reference lib="webworker" />
import { compare, hash } from 'bcryptjs';
import { decryptAnsibleVault, encryptAnsibleVault, parseHtpasswdLine } from './devops-secret-helper.service';
import { DEVOPS_SECRET_ERROR_MESSAGES, DEVOPS_SECRET_MAX_OUTPUT_BYTES, parseDevopsSecretTask } from './devops-secret-helper.worker.protocol';
import { BoundedTextTaskError, type BoundedTextWorkerMessage, createBoundedTextResult, parseBoundedTextWorkerJobId, parseBoundedTextWorkerRequest } from '@/utils/bounded-text-task';

interface WorkerScope { addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void; postMessage: (message: BoundedTextWorkerMessage) => void }
const scope = globalThis as unknown as WorkerScope;
const hashAsync = (value: string, cost: number) => new Promise<string>((resolve, reject) => hash(value, cost, (error, result) => error ? reject(error) : resolve(result)));
const compareAsync = (value: string, digest: string) => new Promise<boolean>((resolve, reject) => compare(value, digest, (error, result) => error ? reject(error) : resolve(result)));

scope.addEventListener('message', (event) => {
  let jobId = 1;
  void (async () => {
    try {
      jobId = parseBoundedTextWorkerJobId(event.data);
      const { task } = parseBoundedTextWorkerRequest(event.data, parseDevopsSecretTask);
      let value: string;
      if (task.operation === 'vault-encrypt') {
        value = await encryptAnsibleVault(task.source, task.password, task.vaultId);
      }
      else if (task.operation === 'vault-decrypt') {
        value = await decryptAnsibleVault(task.source, task.password);
      }
      else if (task.operation === 'htpasswd-generate') {
        const digest = (await hashAsync(task.password, task.cost)).replace(/^\$2a\$/u, '$2y$');
        value = `${task.username}:${digest}`;
      }
      else {
        const parsed = parseHtpasswdLine(task.source);
        value = await compareAsync(task.password, parsed.hash) ? `Password matches the bcrypt entry for ${parsed.username}.` : `Password does not match the bcrypt entry for ${parsed.username}.`;
      }
      const result = createBoundedTextResult(value, DEVOPS_SECRET_MAX_OUTPUT_BYTES);
      scope.postMessage(result ? { jobId, type: 'result', result } : { jobId, type: 'error', code: 'output-limit', message: DEVOPS_SECRET_ERROR_MESSAGES['output-limit'] });
    }
    catch (error) {
      const code = error instanceof BoundedTextTaskError && (error.code === 'validation' || error.code === 'input-limit') ? error.code : 'processing';
      scope.postMessage({ jobId, type: 'error', code, message: DEVOPS_SECRET_ERROR_MESSAGES[code] });
    }
  })();
});
