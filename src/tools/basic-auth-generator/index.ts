import { PasswordRound } from '@vicons/material';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.basic-auth-generator.title'),
  path: '/basic-auth-generator',
  description: translate('tools.basic-auth-generator.description'),
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
