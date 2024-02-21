import { defineTool } from '../tool';
import Bank from '~icons/mdi/bank';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.iban-validator-and-parser.title'),
  path: '/iban-validator-and-parser',
  description: t('tools.iban-validator-and-parser.description'),
  keywords: ['iban', 'validator', 'and', 'parser', 'bic', 'bank'],
  component: () => import('./iban-validator-and-parser.vue'),
  icon: Bank,
  createdAt: new Date('2023-08-26'),
});
