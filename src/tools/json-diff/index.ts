import { CompareArrowsRound } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON diff',
  path: '/json-diff',
  description: 'Compare two JSON objects and get the differences between them.',
  keywords: ['json', 'diff', 'compare', 'difference', 'object', 'data'],
  component: () => import('./json-diff.vue'),
  icon: CompareArrowsRound,
  createdAt: new Date('2023-04-20'),
});
