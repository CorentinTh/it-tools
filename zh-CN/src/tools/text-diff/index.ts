import { FileDiff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '文本差异比对',
  path: '/text-diff',
  description: '比较两个文本并查看它们之间的差异',
  keywords: ['文本', '差异', '比对', '字符串', '文本差异', '代码'],
  component: () => import('./text-diff.vue'),
  icon: FileDiff,
  createdAt: new Date('2023-08-16'),
});
