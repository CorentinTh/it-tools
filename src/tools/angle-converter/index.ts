import { Angle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Angle Units Converter',
  path: '/angle-converter',
  description: 'Convert values between angle units',
  keywords: ['angle', 'converter'],
  component: () => import('./angle-converter.vue'),
  icon: Angle,
  createdAt: new Date('2024-08-15'),
});
