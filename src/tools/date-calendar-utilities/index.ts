import { Calendar } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Measurement',
  order: 2,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.date-calendar-utilities.title'),
  path: '/date-calendar-utilities',
  description: translate('tools.date-calendar-utilities.description'),
  keywords: ['date', 'iso week', 'weekday', 'icalendar', 'ics', 'rfc 5545', 'vevent', 'calendar'],
  component: () => import('./date-calendar-utilities.vue'),
  icon: Calendar,
});
