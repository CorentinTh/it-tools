import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 6,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.markdown-table-generator.title'),
  path: '/markdown-table-generator',
  description: translate('tools.markdown-table-generator.description'),
  keywords: ['markdown', 'table', 'csv', 'tsv', 'alignment', 'generator'],
  component: () => import('./markdown-table-generator.vue'),
  icon: Database,
});
