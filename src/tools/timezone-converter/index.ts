import { CalendarTime } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Timezone Converter',
  path: '/timezone-converter',
  description: 'Convert Date-Time from a timezone to others and get timezone vs countries infos',
  keywords: ['timezone', 'tz', 'date', 'time', 'country', 'converter'],
  component: () => import('./timezone-converter.vue'),
  icon: CalendarTime,
  createdAt: new Date('2024-08-15'),
});
