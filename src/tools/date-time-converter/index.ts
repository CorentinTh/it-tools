import { Calendar } from '@vicons/tabler';
import type { ITool } from '../Tool';

export const tool: ITool = {
  name: 'Date-time converter',
  path: '/date-converter',
  description: 'Convert date and time into the various different formats',
  keywords: ['date', 'time', 'converter', 'iso', 'utc', 'timezone', 'year', 'mounth', 'day', 'minute', 'seconde'],
  component: () => import('./date-time-converter.vue'),
  icon: Calendar,
};
