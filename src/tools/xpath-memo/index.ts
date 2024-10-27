import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'XPath Syntax Cheatsheet',
  path: '/xpath-memo',
  description: 'XPath Syntax Cheatsheet',
  keywords: ['xpath', 'memo', 'cheatsheet'],
  component: () => import('./xpath-memo.vue'),
  icon: Brackets,
  createdAt: new Date('2024-08-15'),
});
