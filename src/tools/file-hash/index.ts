import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'File hash',
  path: '/file-hash',
  description: 'Calculate file hashes',
  keywords: ['file', 'hash', 'md5', 'sha', 'crypto'],
  component: () => import('./file-hash.vue'),
  icon: Key,
  createdAt: new Date('2023-07-13'),
});
