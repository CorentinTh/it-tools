import { FileInfo } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image EXIF/Metadata/GPS/JPEG Quality reader',
  path: '/image-exif-reader',
  description: 'Read EXIF, IPTC, XMP, GPS and other metadata, JPEG Quality, and other infos from images files',
  keywords: ['image', 'exif', 'reader', 'iptc', 'gps', 'xmp', 'jpeg', 'quality'],
  component: () => import('./image-exif-reader.vue'),
  icon: FileInfo,
  createdAt: new Date('2024-01-09'),
});
