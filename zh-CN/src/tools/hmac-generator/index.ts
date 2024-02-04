import { ShortTextRound } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HMAC 生成器',
  path: '/hmac-generator',
  description:
    '使用密钥和哈希函数计算基于哈希的消息身份验证代码 (HMAC)。',
  keywords: ['hmac', 'generator', 'MD5', 'SHA1', 'SHA256', 'SHA224', 'SHA512', 'SHA384', 'SHA3', 'RIPEMD160'],
  component: () => import('./hmac-generator.vue'),
  icon: ShortTextRound,
});
