import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown to html',
  path: '/markdown-to-html',
  description: '',
  keywords: ['markdown', 'html', 'converter'],
  component: () => import('./markdown-to-html.vue'),
  icon: Markdown,
  createdAt: new Date('2024-02-25'),
});
