import { Calculator } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.tip-calculator.title'),
  path: '/tip-calculator',
  description: translate('tools.tip-calculator.description'),
  keywords: ['tip', 'calculator', 'bill', 'split', 'restaurant', 'money', 'payment'],
  component: () => import('./tip-calculator.vue'),
  icon: Calculator,
  createdAt: new Date('2024-04-17'),
});
