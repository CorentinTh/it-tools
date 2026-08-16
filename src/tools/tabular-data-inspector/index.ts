import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 8,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.tabular-data-inspector.title'),
  path: '/tabular-data-inspector',
  description: translate('tools.tabular-data-inspector.description'),
  keywords: ['CSV', 'TSV', 'table', 'tabular', 'inspect', 'import', 'JSON', 'spreadsheet', 'RFC 4180'],
  component: () => import('./tabular-data-inspector.vue'),
  icon: Database,
});
