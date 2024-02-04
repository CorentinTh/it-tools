import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '文本 ↔ ASCII二进制',
  path: '/text-to-binary',
  description: '文本 和 ASCII二进制 互转',
  keywords: ['文本', '转', '二进制', '转换', '互转', '编码', '解码', 'ascii'],
  component: () => import('./text-to-binary.vue'),
  icon: Binary,
  createdAt: new Date('2023-10-15'),
});
