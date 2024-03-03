import { LockSquare } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ansible vault crypt decrypt',
  path: '/ansible-vault-crypt-decrypt',
  description: 'Encrypt and decrypt Ansible Vault Secrets',
  keywords: ['ansible', 'vault', 'crypt', 'decrypt'],
  component: () => import('./ansible-vault-crypt-decrypt.vue'),
  icon: LockSquare,
  createdAt: new Date('2024-02-25'),
});
