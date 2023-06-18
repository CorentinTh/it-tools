import { Percentage } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Percentage calculator',
  path: '/percentage-calculator',
  description: 'Easily calculate percentages from a value to another value, or from a percentage to a value.',
  keywords: ['percentage', 'calculator', 'calculate', 'value', 'number', '%'],
  component: () => import('./percentage-calculator.vue'),
  icon: Percentage,
  createdAt: new Date('2023-06-18'),
});
