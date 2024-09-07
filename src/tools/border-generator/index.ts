import { Square } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Border Generator',
  path: '/border-radius-viewer',
  description: 'Generate a complete CSS border properties.',
  keywords: ['border', 'radius', 'viewer'],
  component: () => import('./border-radius-viewer.vue'),
  icon: Square,
  createdAt: new Date('2024-09-06'),
});

