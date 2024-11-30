import { IconDevices } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.mac-address-lookup.title'),
  path: '/mac-address-lookup',
  description: translate('tools.mac-address-lookup.description'),
  keywords: ['mac', 'address', 'lookup', 'vendor', 'parser', 'manufacturer'],
  component: () => import('./mac-address-lookup.vue'),
  icon: IconDevices,
  createdAt: new Date('2023-04-06'),
});
