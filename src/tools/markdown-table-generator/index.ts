import { Table } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Markdown Table Generator',
  path: '/markdown-table-generator',
  description: 'Create GitHub-flavored Markdown tables with a visual editor.',
  keywords: ['markdown', 'table', 'generator', 'gfm', 'github'],
  component: () => import('./markdown-table-generator.vue'),
  icon: Table,
  createdAt: new Date('2026-05-30'),
});
