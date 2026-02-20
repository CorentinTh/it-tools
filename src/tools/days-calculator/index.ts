import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Days Calculator',
  path: '/days-calculator',
  description: 'Calculate days interval, holidays, difference, business times',
  keywords: ['days', 'interval', 'month', 'year', 'difference', 'holidays', 'calculator'],
  component: () => import('./days-calculator.vue'),
  icon: Calendar,
  createdAt: new Date('2024-08-15'),
});
