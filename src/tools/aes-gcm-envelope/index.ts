import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 10,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.aes-gcm-envelope.title'),
  path: '/aes-gcm-envelope',
  description: translate('tools.aes-gcm-envelope.description'),
  keywords: ['aes', 'gcm', 'pbkdf2', 'authenticated encryption', 'file encryption', 'envelope', 'web crypto'],
  component: () => import('./aes-gcm-envelope.vue'),
  icon: Lock,
});
