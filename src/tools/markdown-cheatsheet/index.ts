import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown Cheat Sheet',
  path: '/markdown-cheatsheet',
  description: 'Markdown Cheat Sheet',
  keywords: ['markdown', 'cheatsheet', 'memo'],
  component: () => import('./markdown-cheatsheet.vue'),
  icon: Markdown,
  createdAt: new Date('2024-03-09'),
});
