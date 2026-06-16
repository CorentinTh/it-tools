import { Calculator } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.date-calculator.title'),
  path: '/date-calculator',
  description: translate('tools.date-calculator.description'),
  keywords: ['date', 'difference', 'days', 'calculator', 'add', 'subtract', 'duration', 'between', 'offset'],
  component: () => import('./date-calculator.vue'),
  icon: Calculator,
  createdAt: new Date('2026-06-15'),
});
