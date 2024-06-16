import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image to SVG (potrace)',
  path: '/potrace',
  description: 'Convert an raster image to vectorial SVG',
  keywords: ['potrace', 'image', 'svg', 'raster', 'vectorial'],
  component: () => import('./potrace.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-05-11'),
});
