import { defineTool } from '../tool';
import Bank from '~icons/mdi/bank';

export const tool = defineTool({
  name: 'IBAN validator and parser',
  path: '/iban-validator-and-parser',
  description: 'Validate and parse IBAN numbers. Check if IBAN is valid and get the country, BBAN, if it is a QR-IBAN and the IBAN friendly format.',
  keywords: ['iban', 'validator', 'and', 'parser', 'bic', 'bank'],
  component: () => import('./iban-validator-and-parser.vue'),
  icon: Bank,
  createdAt: new Date('2023-08-26'),
});
