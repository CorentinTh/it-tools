import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Svg mesh gradient generator',
  path: '/svg-mesh-gradient-generator',
  description: '',
  keywords: ['svg', 'mesh', 'gradient', 'generator'],
  component: () => import('./svg-mesh-gradient-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2023-05-05'),
});
