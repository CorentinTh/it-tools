import { Percentage } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.percentage-calculator.title'),
  path: '/percentage-calculator',
  description: t('tools.percentage-calculator.description'),
  keywords: ['percentage', 'calculator', 'calculate', 'value', 'number', '%'],
  component: () => import('./percentage-calculator.vue'),
  icon: Percentage,
  createdAt: new Date('2023-06-18'),
});
