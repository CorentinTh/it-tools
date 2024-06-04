import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Nano CheatSheet',
  path: '/nano-memo',
  description: 'Nano Editor Cheatsheet',
  keywords: ['nano', 'memo', 'cheatsheet', 'sheet'],
  component: () => import('./nano-memo.vue'),
  icon: FileText,
  createdAt: new Date('2024-04-20'),
});
