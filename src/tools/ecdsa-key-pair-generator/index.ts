import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ECDSA key pair generator',
  path: '/ecdsa-key-pair-generator',
  description: 'Generate new random ECDSA private and public keys (with or without passphrase).',
  keywords: ['ecdsa', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./ecdsa-key-pair-generator.vue'),
  icon: Certificate,
  createdAt: new Date('2024-04-20'),
});
