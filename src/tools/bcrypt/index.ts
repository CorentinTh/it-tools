import { LockSquare } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Bcrypt',
  path: '/bcrypt',
  description:
    'Hash and compare text string using bcrypt. Bcrypt is a password-hashing function based on the Blowfish cipher.',
  keywords: ['bcrypt', 'hash', 'compare', 'password', 'salt', 'round', 'storage', 'crypto'],
  component: () => import('./bcrypt.vue'),
  icon: LockSquare,
});
