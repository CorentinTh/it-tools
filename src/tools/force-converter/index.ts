import { Power } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Force Units Converter',
  path: '/force-converter',
  description: 'Convert values between force units',
  keywords: ['force', 'converter'],
  component: () => import('./force-converter.vue'),
  icon: Power,
  createdAt: new Date('2024-08-15'),
});
