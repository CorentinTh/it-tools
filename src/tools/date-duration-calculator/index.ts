import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Date+Durations Calculator',
  path: '/date-duration-calculator',
  description: 'Add/substract durations from a specific date',
  keywords: ['date', 'duration', 'addition', 'calculator'],
  component: () => import('./date-duration-calculator.vue'),
  icon: Calendar,
  createdAt: new Date('2024-08-15'),
});
