import { IconEyeOff } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.string-obfuscator.title'),
  path: '/string-obfuscator',
  description: translate('tools.string-obfuscator.description'),
  keywords: ['string', 'obfuscator', 'secret', 'token', 'hide', 'obscure', 'mask', 'masking'],
  component: () => import('./string-obfuscator.vue'),
  icon: IconEyeOff,
  createdAt: new Date('2023-08-16'),
});
