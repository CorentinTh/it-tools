import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '文本哈希计算',
  path: '/hash-text',
  description:
    '使用您需要的函数对文本字符串进行哈希处理：MD5、SHA1、SHA256、SHA224、SHA512、SHA384、SHA3 或 RIPEMD160',
  keywords: [
    '哈希',
    'digest',
    'crypto',
    'security',
    'text',
    'MD5',
    'SHA1',
    'SHA256',
    'SHA224',
    'SHA512',
    'SHA384',
    'SHA3',
    'RIPEMD160',
  ],
  component: () => import('./hash-text.vue'),
  icon: EyeOff,
  redirectFrom: ['/hash'],
});
