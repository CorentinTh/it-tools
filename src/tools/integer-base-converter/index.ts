import { ArrowsLeftRight } from '@vicons/tabler';
import type { ITool } from '../Tool';

export const tool: ITool = {
  name: 'Integer base converter',
  path: '/base-converter',
  description: 'Convert numver between different bases (decimal, hexadecimal, binary, octale, base64, ...)',
  keywords: ['integer', 'number', 'base', 'convertion', 'decimal', 'hexadecimal', 'binary', 'octale', 'base64'],
  component: () => import('./integer-base-converter.vue'),
  icon: ArrowsLeftRight,
};
