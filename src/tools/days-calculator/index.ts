import { CalendarPlus } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.days-calculator.title'),
  path: '/days-calculator',
  description: translate('tools.days-calculator.description'),
  keywords: ['days', 'calculator', 'between', 'two', 'dates'],
  component: () => import('./days-calculator.vue'),
  icon: CalendarPlus,
});
