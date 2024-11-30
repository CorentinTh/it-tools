import { List } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Lists Comparer',
  path: '/list-comparer',
  description: 'Compare two list items',
  keywords: ['list', 'comparer'],
  component: () => import('./list-comparer.vue'),
  icon: List,
  createdAt: new Date('2024-08-15'),
});
