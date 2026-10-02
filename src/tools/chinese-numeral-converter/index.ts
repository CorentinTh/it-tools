import { CurrencyRenminbi } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Chinese numeral converter',
  path: '/chinese-numeral-converter',
  description: 'Convert numbers to Chinese numerals, including RMB amounts in financial uppercase (大写)',
  keywords: ['chinese', 'numeral', 'rmb', 'amount', 'invoice', '中文大写', '人民币', '数字'],
  component: () => import('./chinese-numeral-converter.vue'),
  icon: CurrencyRenminbi,
  createdAt: new Date('2026-09-30'),
});
