import { FileZip } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'GZip/Deflate converter',
  path: '/gzip-converter',
  description: 'Convert text from/to gzip/deflate',
  keywords: ['gzip', 'deflate', 'converter'],
  component: () => import('./gzip-converter.vue'),
  icon: FileZip,
  createdAt: new Date('2024-03-09'),
});
