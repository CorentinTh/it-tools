import { SpeedFilled } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Measurement',
  order: 4,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.data-units-converter.title'),
  path: '/data-units-converter',
  description: translate('tools.data-units-converter.description'),
  keywords: ['data', 'storage', 'transfer', 'bit', 'byte', 'si', 'iec', 'kibibyte', 'bandwidth'],
  component: () => import('./data-units-converter.vue'),
  icon: SpeedFilled,
});
