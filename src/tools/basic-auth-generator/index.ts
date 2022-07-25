import { PasswordRound } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Basic auth generator',
  path: '/basic-auth-generator',
  description: 'Generate a base64 basic auth header from an username and a password.',
  keywords: [
    'basic',
    'auth',
    'generator',
    'username',
    'password',
    'base64',
    'authentication',
    'header',
    'authorization',
  ],
  component: () => import('./basic-auth-generator.vue'),
  icon: PasswordRound,
});
