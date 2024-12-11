import { PictureInPicture } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ICO/PNG converter',
  path: '/ico-converter',
  description: 'Convert from PNG/JPEG to/from ICO',
  keywords: ['ico', 'png', 'jpeg', 'icon', 'converter'],
  component: () => import('./ico-converter.vue'),
  icon: PictureInPicture,
  createdAt: new Date('2024-08-15'),
});
