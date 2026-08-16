import { Fingerprint } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 2,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.nanoid-generator.title'),
  path: '/nanoid-generator',
  description: translate('tools.nanoid-generator.description'),
  keywords: ['nanoid', 'nano id', 'generator', 'random', 'id', 'identifier', 'unique', 'url safe', 'entropy', 'collision'],
  component: () => import('./nanoid-generator.vue'),
  icon: Fingerprint,
});
