import { Devices } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.mac-address-generator.title'),
  path: '/mac-address-generator',
  description: translate('tools.mac-address-generator.description'),
  keywords: ['mac', 'address', 'generator', 'random', 'prefix'],
  component: () => import('./mac-address-generator.vue'),
  icon: Devices,
  createdAt: new Date('2023-11-31'),
});
