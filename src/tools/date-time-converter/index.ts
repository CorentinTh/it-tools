import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Date-time converter',
  path: '/date-converter',
  description: 'Convert date and time into the various different formats',
  keywords: ['date', 'time', 'converter', 'iso', 'utc', 'timezone', 'year', 'month', 'day', 'minute', 'seconde'],
  component: () => import('./date-time-converter.vue'),
  icon: Calendar,
});
