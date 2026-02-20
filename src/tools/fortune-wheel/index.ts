import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Fortune wheel',
  path: '/fortune-wheel',
  description: '',
  keywords: ['fortune', 'wheel'],
  component: () => import('./fortune-wheel.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-02-24'),
});
