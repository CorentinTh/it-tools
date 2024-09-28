import { Currency } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Currency Converter',
  path: '/currency-converter',
  description: 'Convert currency values using ExchangeRate-API',
  keywords: ['currency', 'converter'],
  component: () => import('./currency-converter.vue'),
  icon: Currency,
  createdAt: new Date('2024-08-15'),
});
