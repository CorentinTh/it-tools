import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown viewer',
  path: '/markdown-viewer',
  description: 'View your Markdown in a human friendly readable format.',
  keywords: ['markdown', 'md', 'viewer', 'prettify'],
  component: () => import('./markdown-viewer.vue'),
  icon: Markdown,
  createdAt: new Date('2023-12-02'),
});
