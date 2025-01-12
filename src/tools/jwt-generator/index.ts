import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JWT Generator',
  path: '/jwt-generator',
  description: 'JWT Token generator and editor',
  keywords: [
    'jwt',
    'generator',
    'editor',
    'encode',
    'typ',
    'alg',
    'iss',
    'sub',
    'aud',
    'exp',
    'nbf',
    'iat',
    'jti',
    'json',
    'web',
    'token',
  ],
  component: () => import('./jwt-generator.vue'),
  icon: Key,
  createdAt: new Date('2024-08-15'),
});
