import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Base64 string encoder/decoder',
  path: '/base64-string-converter',
  description: 'Simply encode and decode string into a their base64 representation.',
  keywords: ['base64', 'converter', 'conversion', 'web', 'data', 'format', 'atob', 'btoa'],
  component: () => import('./base64-string-converter.vue'),
  icon: FileDigit,
  redirectFrom: ['/file-to-base64', '/base64-converter'],
});
