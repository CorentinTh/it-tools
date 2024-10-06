import { ReceiptTax } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'VAT Numbers Validator',
  path: '/vat-validator',
  description: 'Validate VAT Numbers',
  keywords: ['vat', 'validator'],
  component: () => import('./vat-validator.vue'),
  icon: ReceiptTax,
  createdAt: new Date('2024-08-15'),
});
