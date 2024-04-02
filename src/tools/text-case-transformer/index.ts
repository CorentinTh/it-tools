import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.text-case-transformer.title'),
  path: '/text-case-transformer',
  description: translate('tools.text-case-transformer.description'),
  keywords: ['string', 'text', 'case', 'transformer', 'secret', 'token', 'hide', 'obscure', 'mask', 'masking'],
  component: () => import('./text-case-transformer.vue'),
  icon: EyeOff,
  createdAt: new Date('2024-04-02'),
});
