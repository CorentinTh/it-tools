import { SpeedFilled } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Measurement',
  order: 5,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.raid-storage-calculator.title'),
  path: '/raid-storage-calculator',
  description: translate('tools.raid-storage-calculator.description'),
  keywords: ['raid', 'storage', 'disk', 'hdd', 'ssd', 'capacity', 'parity', 'mirror', 'failure'],
  component: () => import('./raid-storage-calculator.vue'),
  icon: SpeedFilled,
});
