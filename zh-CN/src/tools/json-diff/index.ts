import { CompareArrowsRound } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON 差异比对',
  path: '/json-diff',
  description: '比对两个 JSON 对象之间的差异。',
  keywords: ['json', '差异', '比对', '不同', '对象', '数据'],
  component: () => import('./json-diff.vue'),
  icon: CompareArrowsRound,
  createdAt: new Date('2023-04-20'),
});
