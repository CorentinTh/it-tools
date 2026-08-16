import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 4,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.developer-text-workspace.title'),
  path: '/developer-text-workspace',
  description: translate('tools.developer-text-workspace.description'),
  keywords: ['stack trace', 'replace', 'regex', 'folder', 'tree', 'markdown', 'toc', 'text'],
  component: () => import('./developer-text-workspace.vue'),
  icon: FileText,
});
