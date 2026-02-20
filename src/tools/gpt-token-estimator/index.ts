import { CurrencyDollar } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'GPT Token Estimator',
  path: '/gpt-token-estimator',
  description: 'OpenAI GPT Token Estimator',
  keywords: ['gpt', 'token', 'estimator'],
  component: () => import('./gpt-token-estimator.vue'),
  icon: CurrencyDollar,
  createdAt: new Date('2024-08-15'),
});
