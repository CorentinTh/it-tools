import { Resize } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image resizer',
  path: '/image-resizer',
  description: '',
  keywords: ['image', 'resizer', 'favicon', 'jpg', 'jpeg', 'png', 'bmp', 'ico', 'svg'],
  component: () => import('./image-resizer.vue'),
  icon: Resize,
  createdAt: new Date('2024-10-22'),
});
