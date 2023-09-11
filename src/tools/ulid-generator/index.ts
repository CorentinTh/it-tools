import { SortDescendingNumbers } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ULID generator',
  path: '/ulid-generator',
  description: 'Generate random Universally Unique Lexicographically Sortable Identifier (ULID).',
  keywords: ['ulid', 'generator', 'random', 'id', 'alphanumeric', 'identity', 'token', 'string', 'identifier', 'unique'],
  component: () => import('./ulid-generator.vue'),
  icon: SortDescendingNumbers,
  createdAt: new Date('2023-09-11'),
});
