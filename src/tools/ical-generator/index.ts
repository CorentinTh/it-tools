import { CalendarEvent } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ICAL Generator',
  path: '/ical-generator',
  description: 'Generate ICAL/ICS file from event infos',
  keywords: ['ical', 'calendar', 'event', 'generator'],
  component: () => import('./ical-generator.vue'),
  icon: CalendarEvent,
  createdAt: new Date('2024-08-15'),
});
