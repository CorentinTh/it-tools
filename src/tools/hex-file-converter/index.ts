import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HEX File Converter',
  path: '/hex-file-converter',
  description: 'Convert between file and hexadecimal representation',
  keywords: ['hex', 'file', 'converter'],
  component: () => import('./hex-file-converter.vue'),
  icon: FileDigit,
  createdAt: new Date('2024-08-15'),
});
