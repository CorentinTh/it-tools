import { FileCheck } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 14,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.json-schema-validator.title'),
  path: '/json-schema-validator',
  description: translate('tools.json-schema-validator.description'),
  keywords: ['json', 'schema', 'validator', 'validation', 'draft 7', 'draft 2019-09', 'draft 2020-12'],
  component: () => import('./json-schema-validator.vue'),
  icon: FileCheck,
});
