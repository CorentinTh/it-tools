import { CalendarEvent } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ICAL File Parser',
  path: '/ical-parser',
  description: 'Parse ICAL/ICS file to event display',
  keywords: ['ical', 'ics', 'calendar', 'parser'],
  component: () => import('./ical-parser.vue'),
  icon: CalendarEvent,
  createdAt: new Date('2024-08-15'),
});
