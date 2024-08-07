import { PasswordRound } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Htpasswd/htaccess generator',
  path: '/htpasswd-generator',
  description: 'htpassword/htaccess user/password generator',
  keywords: ['htpasswd', 'htaccess', 'bcrypt', 'password'],
  component: () => import('./htpasswd-generator.vue'),
  icon: PasswordRound,
  createdAt: new Date('2024-02-20'),
});
