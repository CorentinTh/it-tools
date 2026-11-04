import { Calendar } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.date-converter.title'),
  path: '/date-converter',
  description: translate('tools.date-converter.description'),
  keywords: ['date', 'time', 'converter', 'iso', 'utc', 'timezone', 'year', 'month', 'day', 'minute', 'seconde'],
  component: () => import('./date-time-converter.vue'),
  icon: Calendar,
});
