import { Speakerphone } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.text-to-nato-alphabet.title'),
  path: '/text-to-nato-alphabet',
  description: translate('tools.text-to-nato-alphabet.description'),
  keywords: ['string', 'nato', 'alphabet', 'phonetic', 'oral', 'transmission'],
  component: () => import('./text-to-nato-alphabet.vue'),
  icon: Speakerphone,
});
