import { ColorPicker } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Color Wheel',
  path: '/color-wheel',
  description: 'Choose a color palette/theme using a wheel and mode',
  keywords: ['color', 'wheel', 'palette', 'theme'],
  component: () => import('./color-wheel.vue'),
  icon: ColorPicker,
  createdAt: new Date('2024-08-15'),
});
