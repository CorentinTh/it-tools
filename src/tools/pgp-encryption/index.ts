import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'PGP encryption',
  path: '/pgp-encryption',
  description: 'Encrypt and decrypt text clear text using PGP Keys.',
  keywords: ['pgp', 'openpgp', 'encryption', 'cypher', 'encipher', 'crypt', 'decrypt'],
  component: () => import('./pgp-encryption.vue'),
  icon: Lock,
  createdAt: new Date('2024-04-20'),
});
