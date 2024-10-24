import { CalendarTime } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Duration Calculator',
  path: '/duration-calculator',
  description: 'Calculate/parse durations',
  keywords: ['duration', 'iso', '8601', 'time', 'calculator'],
  component: () => import('./duration-calculator.vue'),
  icon: CalendarTime,
  createdAt: new Date('2024-08-15'),
});
