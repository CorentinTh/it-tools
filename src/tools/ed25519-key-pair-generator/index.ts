import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ed25519 key pair generator',
  path: '/ed25519-key-pair-generator',
  description: 'Generate new random Ed25519 private and public keys (with or without passphrase).',
  keywords: ['ed25519', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./ed25519-key-pair-generator.vue'),
  icon: Certificate,
  createdAt: new Date('2024-02-14'),
});
