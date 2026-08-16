import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Text',
  order: 0,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.mock-data-generator.title'),
  path: '/mock-data-generator',
  description: translate('tools.mock-data-generator.description'),
  keywords: ['faker', 'fake', 'mock', 'fixture', 'sample data', 'json', 'csv', 'seed', 'person', 'address'],
  component: () => import('./mock-data-generator.vue'),
  icon: Braces,
});
