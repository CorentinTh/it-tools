import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Jq Cheatsheet',
  path: '/jq-memo',
  description: 'JQ command cheatsheet',
  keywords: ['jq', 'cheatsheet', 'memo'],
  component: () => import('./jq-memo.vue'),
  icon: Brackets,
  createdAt: new Date('2024-08-15'),
});
