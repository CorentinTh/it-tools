import { Palette } from '@vicons/tabler';
import type { ITool } from './../Tool';

export const tool: ITool = {
  name: 'Color converter',
  path: '/color-converter',
  description: 'Convert color between the different formats (hex, rgb, hsl and css name)',
  keywords: ['color', 'converter'],
  component: () => import('./color-converter.vue'),
  icon: Palette,
  redirectFrom: ['/color-picker-converter'],
};
