import { IconResize } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image resizer',
  path: '/image-resizer',
  description: '',
  keywords: ['image', 'resizer', 'favicon', 'jpg', 'jpeg', 'png', 'bmp', 'ico', 'svg'],
  component: () => import('./image-resizer.vue'),
  icon: IconResize,
  createdAt: new Date('2024-10-22'),
});
