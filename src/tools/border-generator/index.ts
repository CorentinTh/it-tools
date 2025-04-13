import { Square } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Border Generator',
  path: '/border-generator',
  description: 'Generate a complete CSS border properties.',
  keywords: ['border', 'generator', 'css'],
  component: () => import('./border-generator.vue'),
  icon: Square,
  createdAt: new Date('2024-09-06'),
});
