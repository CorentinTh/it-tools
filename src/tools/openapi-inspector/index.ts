import { Api } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 27,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.openapi-inspector.title'),
  path: '/openapi-inspector',
  description: translate('tools.openapi-inspector.description'),
  keywords: ['OpenAPI', 'Swagger', 'API', 'endpoint', 'schema', 'JSON', 'YAML', 'curl', 'mock', 'request', 'local', 'inspector'],
  component: () => import('./openapi-inspector.vue'),
  icon: Api,
});
