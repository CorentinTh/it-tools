import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Paste as Markdown',
  path: '/paste-as-markdown',
  description: 'Paste clipboard content as Markdown',
  keywords: ['paste', 'markdown'],
  component: () => import('./paste-as-markdown.vue'),
  icon: Markdown,
  createdAt: new Date('2024-07-14'),
});
