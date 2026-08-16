import { Math } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Math',
  order: 1,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.ieee754-inspector.title'),
  path: '/ieee754-inspector',
  description: translate('tools.ieee754-inspector.description'),
  keywords: ['ieee 754', 'float', 'double', 'binary32', 'binary64', 'rounding', 'nan', 'subnormal', 'endian'],
  component: () => import('./ieee754-inspector.vue'),
  icon: Math,
});
