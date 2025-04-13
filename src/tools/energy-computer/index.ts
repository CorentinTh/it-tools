import { Engine } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Energy Consumption and Expense Computer',
  path: '/energy-computer',
  description: 'Compute energy consumption and expense',
  keywords: ['energy', 'expense', 'watt', 'kwh', 'computer'],
  component: () => import('./energy-computer.vue'),
  icon: Engine,
  createdAt: new Date('2024-08-15'),
});
