import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HEIC Converter',
  path: '/heic-converter',
  description: 'HEIC Converter to JPEG or PNG',
  keywords: ['heic', 'heif', 'convert', 'decoder', 'converter'],
  component: () => import('./heic-converter.vue'),
  icon: Photo,
  createdAt: new Date('2024-04-28'),
});
