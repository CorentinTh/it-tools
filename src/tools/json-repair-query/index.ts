import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 16,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.json-repair-query.title'),
  path: '/json-repair-query',
  description: translate('tools.json-repair-query.description'),
  keywords: ['json', 'repair', 'json5', 'jsonpath', 'query', 'jq', 'filter', 'extract', 'escaped json', 'unescape', 'logs'],
  component: () => import('./json-repair-query.vue'),
  icon: Braces,
});
