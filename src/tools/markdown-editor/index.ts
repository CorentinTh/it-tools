import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown Editor',
  path: '/markdown-editor',
  description: 'Simple Markdown Editor',
  keywords: ['markdown', 'editor'],
  component: () => import('./markdown-editor.vue'),
  icon: Markdown,
  createdAt: new Date('2024-04-07'),
});
