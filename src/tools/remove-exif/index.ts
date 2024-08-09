import { PictureInPictureOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Remove EXIF',
  path: '/remove-exif',
  description: 'Remove Exif from JPEG Files',
  keywords: ['remove', 'exif', 'jpeg'],
  component: () => import('./remove-exif.vue'),
  icon: PictureInPictureOff,
  createdAt: new Date('2024-07-14'),
});
