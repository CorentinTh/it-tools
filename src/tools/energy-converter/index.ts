import { Power } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Energy Units Converter',
  path: '/energy-converter',
  description: 'Convert values between energy units',
  keywords: ['energy', 'converter'],
  component: () => import('./energy-converter.vue'),
  icon: Power,
  createdAt: new Date('2024-08-15'),
});
