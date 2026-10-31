import { Calculator } from '@vicons/tabler';

import { defineTool } from '../tool';

import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.loan-calculator.title'),
  path: '/loan-calculator',
  description: translate('tools.loan-calculator.description'),
  keywords: ['loan', 'emi', 'calculator', 'interest', 'monthly', 'payment'],
  component: () => import('./loan-calculator.vue'),
  icon: Calculator,
  createdAt: new Date('2026-10-31'),
});
