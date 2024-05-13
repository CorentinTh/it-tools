import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON Linter',
  path: '/json-linter',
  description: 'Check and lint JSON content',
  keywords: ['json', 'linter', 'check'],
  component: () => import('./json-linter.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-20'),
});
