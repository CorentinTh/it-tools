import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';
import PasswordIcon from '~icons/mdi/form-textbox-password';

export const registry = {
  category: 'Crypto',
  order: 1,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.passphrase-generator.title'),
  path: '/passphrase-generator',
  description: translate('tools.passphrase-generator.description'),
  keywords: ['passphrase', 'password', 'diceware', 'entropy', 'wordlist', 'web crypto'],
  component: () => import('./passphrase-generator.vue'),
  icon: PasswordIcon,
});
