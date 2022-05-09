import { FileDigit } from '@vicons/tabler';
import type { ITool } from './../Tool';

export const tool: ITool = {
  name: 'Base64 converter',
  path: '/base64-converter',
  description: "Convert string, files or images into a it's base64 representation.",
  keywords: ['base64', 'converter', 'upload', 'image', 'file', 'conversion', 'web', 'data', 'format'],
  component: () => import('./base64-converter.vue'),
  icon: FileDigit,
  redirectFrom: ['/file-to-base64', '/base64-string-converter'],
};
