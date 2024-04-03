import { Artboard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image to ASCII Art',
  path: '/image-to-ascii-art',
  description: 'Image to ASCII Art Generator',
  keywords: ['image', 'ascii', 'art'],
  component: () => import('./image-to-ascii-art.vue'),
  icon: Artboard,
  createdAt: new Date('2024-03-15'),
});
