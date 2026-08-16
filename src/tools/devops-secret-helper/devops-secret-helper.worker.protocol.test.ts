import { describe, expect, it } from 'vitest';
import { parseDevopsSecretTask } from './devops-secret-helper.worker.protocol';

describe('DevOps secret worker protocol', () => {
  it('accepts exact bounded tasks and rejects extra fields', () => {
    const task = { operation: 'vault-encrypt' as const, source: 'secret', password: 'password', username: '', cost: 10, vaultId: '' };
    expect(parseDevopsSecretTask(task)).toEqual(task);
    expect(() => parseDevopsSecretTask({ ...task, secretEcho: true })).toThrow();
  });
});
