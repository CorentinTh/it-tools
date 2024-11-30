import { Check } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Luhn Validator',
  path: '/luhn-validator',
  description: 'Check and generate key for identifier validated by a Luhn checknum',
  keywords: ['luhn', 'credit-card', 'imei', 'identifier', 'validator'],
  component: () => import('./luhn-validator.vue'),
  icon: Check,
  createdAt: new Date('2024-08-15'),
});
