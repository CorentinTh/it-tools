import { Percentage } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Percentage calculator',
  path: '/percentage-calculator',
  description: 'Calculate percentages',
  keywords: ['percentage', 'calculator'],
  component: () => import('./percentage-calculator.vue'),
  icon: Percentage,
});
