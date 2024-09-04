import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Paste as Markdown',
  path: '/paste-as-markdown',
  description: 'Paste cells/tables and links from clipboard content as Markdown',
  keywords: ['paste', 'cell', 'table', 'links', 'md', 'markdown'],
  component: () => import('./paste-as-markdown.vue'),
  icon: Markdown,
  createdAt: new Date('2024-07-14'),
});
