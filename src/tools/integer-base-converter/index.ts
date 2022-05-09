import { ArrowsLeftRight } from '@vicons/tabler';
import type { ITool } from '../Tool';

export const tool: ITool = {
  name: 'Integer base converter',
  path: '/base-converter',
  description: 'Convert number between different bases (decimal, hexadecimal, binary, octal, base64, ...)',
  keywords: ['integer', 'number', 'base', 'conversion', 'decimal', 'hexadecimal', 'binary', 'octal', 'base64'],
  component: () => import('./integer-base-converter.vue'),
  icon: ArrowsLeftRight,
};
