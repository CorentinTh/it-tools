import { Table } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown toc generator',
  path: '/markdown-toc-generator',
  description: 'Generate a TOC from a markdown file/content',
  keywords: ['markdown', 'md', 'toc', 'generator'],
  component: () => import('./markdown-toc-generator.vue'),
  icon: Table,
  createdAt: new Date('2024-05-11'),
});
