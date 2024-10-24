import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Week Numbers Converter',
  path: '/week-number-converter',
  description: '',
  keywords: ['week', 'month', 'number', 'converter'],
  component: () => import('./week-number-converter.vue'),
  icon: Calendar,
  createdAt: new Date('2024-08-15'),
});
