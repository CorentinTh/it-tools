import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SSH key pair generator',
  path: '/ssh-key-pair-generator',
  description: 'Generate Ed25519 or RSA SSH key pairs (OpenSSH format) directly in your browser',
  keywords: ['ssh', 'key', 'ed25519', 'rsa', 'openssh', 'authorized_keys', 'ssh-keygen'],
  component: () => import('./ssh-key-pair-generator.vue'),
  icon: Key,
  createdAt: new Date('2026-10-01'),
});
