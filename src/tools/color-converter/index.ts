import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Color converter',
  path: '/color-converter',
  description: 'Convert color between the different formats (hex, rgb, hsl and css name)',
  keywords: ['color', 'converter'],
  component: () => import('./color-converter.vue'),
  icon: Palette,
  redirectFrom: ['/color-picker-converter'],
});
