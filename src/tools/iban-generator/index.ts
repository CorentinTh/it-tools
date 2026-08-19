import { defineTool } from '../tool';
import Bank from '~icons/mdi/bank';

export const tool = defineTool({
  name: 'IBAN Generator',
  path: '/iban-generator',
  description: 'Generating valid IBANs for various countries. Useful for testing and development purposes. The generated IBANs are not linked to real bank accounts.',
  keywords: ['iban', 'generator'],
  component: () => import('./iban-generator.vue'),
  icon: Bank,
  createdAt: new Date('2025-12-04'),
});
