import { IconBuildingBank } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.iban-validator-and-parser.title'),
  path: '/iban-validator-and-parser',
  description: translate('tools.iban-validator-and-parser.description'),
  keywords: ['iban', 'validator', 'and', 'parser', 'bic', 'bank'],
  component: () => import('./iban-validator-and-parser.vue'),
  icon: IconBuildingBank,
  createdAt: new Date('2023-08-26'),
});
