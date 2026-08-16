import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 17,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.json-code-generator.title'),
  path: '/json-code-generator',
  description: translate('tools.json-code-generator.description'),
  keywords: ['json', 'schema', 'typescript', 'code generation', 'inference', 'size', 'RFC 6902', 'JSON Patch', 'JSON Pointer', 'diff'],
  component: () => import('./json-code-generator.vue'),
  icon: Braces,
});
