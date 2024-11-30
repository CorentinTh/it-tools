import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSONPath Syntax Cheatsheet',
  path: '/jsonpath-memo',
  description: 'JSONPath Syntax Cheatsheet',
  keywords: ['jsonpath', 'cheatsheet', 'memo'],
  component: () => import('./jsonpath-memo.vue'),
  icon: Brackets,
  createdAt: new Date('2024-08-15'),
});
