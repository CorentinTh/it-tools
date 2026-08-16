import type { DevopsSecretTask } from './devops-secret-helper.service';
import { DEVOPS_SECRET_MAX_INPUT_BYTES, DEVOPS_SECRET_MAX_OUTPUT_BYTES, DEVOPS_SECRET_TIMEOUT_MS, validateHtpasswdPassword, validateHtpasswdUsername } from './devops-secret-helper.service';
import { type BoundedTextErrorMessages, BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { isUnknownRecord } from '@/utils/worker-protocol';

export { DEVOPS_SECRET_MAX_OUTPUT_BYTES, DEVOPS_SECRET_TIMEOUT_MS };
export const DEVOPS_SECRET_ERROR_MESSAGES: BoundedTextErrorMessages = {
  'validation': 'Enter valid bounded input, password, and format options.',
  'input-limit': 'Secret-helper input exceeds its local processing limit.',
  'output-limit': 'Secret-helper output is limited to 2 MiB.',
  'processing': 'The operation failed. Check the password and selected format.',
};

export function parseDevopsSecretTask(value: unknown): DevopsSecretTask {
  if (!isUnknownRecord(value)
    || Object.keys(value).sort().join(',') !== 'cost,operation,password,source,username,vaultId'
    || !['vault-encrypt', 'vault-decrypt', 'htpasswd-generate', 'htpasswd-verify'].includes(String(value.operation))
    || typeof value.source !== 'string' || typeof value.password !== 'string' || typeof value.username !== 'string'
    || typeof value.vaultId !== 'string' || typeof value.cost !== 'number' || !Number.isInteger(value.cost)) {
    throw new BoundedTextTaskError('validation', DEVOPS_SECRET_ERROR_MESSAGES.validation);
  }
  const task = value as unknown as DevopsSecretTask;
  if (!task.password || exceedsUtf8ByteLimit(task.password, 1024)) {
    throw new BoundedTextTaskError('validation', DEVOPS_SECRET_ERROR_MESSAGES.validation);
  }
  if (task.operation.startsWith('vault-') && exceedsUtf8ByteLimit(task.source, task.operation === 'vault-encrypt' ? DEVOPS_SECRET_MAX_INPUT_BYTES : DEVOPS_SECRET_MAX_OUTPUT_BYTES)) {
    throw new BoundedTextTaskError('input-limit', DEVOPS_SECRET_ERROR_MESSAGES['input-limit']);
  }
  if (task.operation === 'htpasswd-generate') {
    validateHtpasswdUsername(task.username);
    validateHtpasswdPassword(task.password);
    if (task.cost < 4 || task.cost > 14) {
      throw new BoundedTextTaskError('validation', DEVOPS_SECRET_ERROR_MESSAGES.validation);
    }
  }
  if (task.operation === 'htpasswd-verify') {
    validateHtpasswdPassword(task.password);
  }
  return task;
}
