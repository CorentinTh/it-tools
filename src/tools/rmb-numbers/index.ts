import { CurrencyYen } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'RMB Uppercase Converter',
  path: '/rmb-numbers',
  description: 'RMB/Renminbi Capitalization Conversion Tool',
  keywords: ['rmb', 'renminbi', 'cny', 'number', 'uppercase', '人民币', '大写', '转换'],
  component: () => import('./rmb-numbers.vue'),
  icon: CurrencyYen,
  createdAt: new Date('2024-04-29'),
});
