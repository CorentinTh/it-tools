import { Currency } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Currency Converter',
  path: '/currency-converter',
  description: 'Convert currency values using https://github.com/fawazahmed0/exchange-api',
  keywords: ['currency', 'converter'],
  component: () => import('./currency-converter.vue'),
  icon: Currency,
  createdAt: new Date('2024-08-15'),
});
