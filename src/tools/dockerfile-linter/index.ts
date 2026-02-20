import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Dockerfile Linter',
  path: '/dockerfile-linter',
  description: '',
  keywords: ['dockerfile', 'docker', 'linter'],
  component: () => import('./dockerfile-linter.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-01-01'),
});
