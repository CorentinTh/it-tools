import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Hex Encoder/Decoder',
  path: '/hex-converter',
  description: 'Encode and decode Hex buffers to number (bits, endianess, sign or floating point or chars) and structures',
  keywords: ['hex', 'encode', 'decode', 'endianess', 'float', 'bits', 'hex', 'struct'],
  component: () => import('./hex-converter.vue'),
  icon: Binary,
  createdAt: new Date('2025-02-09'),
});
