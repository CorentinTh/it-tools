import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json linter',
  path: '/json-linter',
  description: '',
  keywords: ['json', 'linter'],
  component: () => import('./json-linter.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-03-27'),
});