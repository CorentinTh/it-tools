import { File } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'File Type Detector',
  path: '/file-type',
  description: 'Identify the type of a file',
  keywords: ['file', 'type', 'identify', 'detector'],
  component: () => import('./file-type.vue'),
  icon: File,
  createdAt: new Date('2024-04-20'),
});
