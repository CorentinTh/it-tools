import { Copy } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Remove duplicate text',
  path: '/remove-duplicate-text',
  description: 'Remove duplicate rows from a list of text rows.',
  keywords: ['remove', 'duplicate', 'text', 'rows', 'delete', 'unique', 'distinct'],
  component: () => import('./remove-duplicate-text-rows.vue'),
  icon: Copy,
  createdAt: new Date('2024-10-01'),
});
