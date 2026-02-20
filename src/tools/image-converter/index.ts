import { PictureInPicture } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image Formats Converter',
  path: '/image-converter',
  description: 'Convert images from one format to another',
  keywords: ['image', 'bmp', 'gif', 'ico', 'jpg', 'png', 'tga', 'pvr', 'tiff', 'pnm', 'pbm', 'pgm', 'ppm', 'psd', 'webp', 'converter'],
  component: () => import('./image-converter.vue'),
  icon: PictureInPicture,
  createdAt: new Date('2024-08-15'),
});
