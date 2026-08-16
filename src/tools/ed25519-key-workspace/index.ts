import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 15,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.ed25519-key-workspace.title'),
  path: '/ed25519-key-workspace',
  description: translate('tools.ed25519-key-workspace.description'),
  keywords: ['ed25519', 'ssh', 'key', 'public', 'private', 'pkcs8', 'spki', 'fingerprint'],
  component: () => import('./ed25519-key-workspace.vue'),
  icon: Key,
});
