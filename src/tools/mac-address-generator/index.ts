import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Network',
  order: 7,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.mac-address-generator.title'),
  path: '/mac-address-generator',
  description: translate('tools.mac-address-generator.description'),
  keywords: ['mac', 'address', 'generator', 'random', 'prefix'],
  component: () => import('./mac-address-generator.vue'),
  icon: Devices,
  createdAt: new Date('2023-11-31'),
});
