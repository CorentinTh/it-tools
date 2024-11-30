import { CalendarPlus } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'iCal Merger',
  path: '/ical-merger',
  description: 'Merge many iCal file to a single',
  keywords: ['ical', 'ics', 'merger'],
  component: () => import('./ical-merger.vue'),
  icon: CalendarPlus,
  createdAt: new Date('2024-08-15'),
});
