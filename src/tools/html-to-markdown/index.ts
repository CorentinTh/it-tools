import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Html to markdown',
  path: '/html-to-markdown',
  description: 'Convert HTML (either from clipboard) to Markdown',
  keywords: ['html', 'markdown', 'converter'],
  component: () => import('./html-to-markdown.vue'),
  icon: Markdown,
  createdAt: new Date('2024-01-17'),
});
