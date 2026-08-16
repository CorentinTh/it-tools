import { Fingerprint } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Crypto',
  order: 3,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.uuid-generator.title'),
  path: '/uuid-generator',
  description: translate('tools.uuid-generator.description'),
  keywords: ['uuid', 'v4', 'random', 'id', 'alphanumeric', 'identity', 'token', 'string', 'identifier', 'unique', 'v1', 'v3', 'v5', 'v6', 'v7', 'nil', 'objectid', 'snowflake'],
  component: () => import('./uuid-generator.vue'),
  icon: Fingerprint,
});
