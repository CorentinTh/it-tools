import { Certificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'PGP keygen',
  path: '/pgp-key-pair-generator',
  description: 'Generate new random PGP private and public keys (with or without passphrase).',
  keywords: ['pgp', 'key', 'pair', 'generator', 'public', 'private', 'secret', 'ssh', 'pem', 'passphrase', 'password'],
  component: () => import('./pgp-keygen.vue'),
  icon: Certificate,
  createdAt: new Date('2024-04-20'),
});
