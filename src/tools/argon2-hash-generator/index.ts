import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Argon2 hash generator',
  path: '/argon2-hash-generator',
  description: 'Hash and compare string (password) using Argon2',
  keywords: ['argon2', 'hash', 'generator', 'password', 'salt', 'crypto', 'security'],
  component: () => import('./argon2-hash-generator.vue'),
  icon: Lock,
  createdAt: new Date('2023-04-16'),
});
