import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'RSA/DSA/ECDSA Signer and Verifier',
  path: '/rsa-ecdsa-signing',
  description: 'Sign data and verify signature using RSA/DSA/ECDSA Keys',
  keywords: ['rsa', 'dsa', 'ecdsa', 'ed25519', 'encryption', 'cypher', 'encipher', 'crypt', 'decrypt'],
  component: () => import('./rsa-ecdsa-signing.vue'),
  icon: Lock,
  createdAt: new Date('2024-05-01'),
});
