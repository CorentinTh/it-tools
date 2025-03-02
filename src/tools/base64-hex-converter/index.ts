import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Base64 Hex array encoder/decoder',
  path: '/base64-hex-converter',
  description: 'Simply encode and decode Hex array into a their base64 representation.',
  keywords: ['base64', 'converter', 'conversion', 'web', 'data', 'format', 'atob', 'btoa', 'hex'],
  component: () => import('./base64-hex-converter.vue'),
  icon: FileDigit,
  createdAt: new Date('2025-02-09'),
});
