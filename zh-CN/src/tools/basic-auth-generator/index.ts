import { PasswordRound } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '基本身份验证生成器',
  path: '/basic-auth-generator',
  description: '将用户名和密码生成Base64基本身份验证标头',
  keywords: [
    '基本',
    'auth',
    '生成器',
    '用户名',
    '密码',
    'base64',
    '验证',
    '标头',
    '授权',
  ],
  component: () => import('./basic-auth-generator.vue'),
  icon: PasswordRound,
});
