import { LockSquare } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Bcrypt',
  path: '/bcrypt',
  description:
    '使用Bcrypt对文本字符串进行散列和比较，Bcrypt是基于Blowfish密码的密码散列函数。',
  keywords: ['bcrypt', '哈希', '比较', '密码', '盐', '存储', '加密'],
  component: () => import('./bcrypt.vue'),
  icon: LockSquare,
});
