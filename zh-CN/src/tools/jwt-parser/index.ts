import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JWT 解析器',
  path: '/jwt-parser',
  description: '解析 JSON Web Token (JWT) 并显示其内容。',
  keywords: [
    'jwt',
    '解析',
    '解码',
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
  component: () => import('./jwt-parser.vue'),
  icon: Key,
});
