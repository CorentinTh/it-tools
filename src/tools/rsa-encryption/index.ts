import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'RSA encryption',
  path: '/rsa-encryption',
  description: 'Encrypt and decrypt text clear text using RSA Keys.',
  keywords: ['rsa', 'encryption', 'cypher', 'encipher', 'crypt', 'decrypt'],
  component: () => import('./rsa-encryption.vue'),
  icon: Lock,
  createdAt: new Date('2024-04-20'),
});
