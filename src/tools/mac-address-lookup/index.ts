import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MAC adrdress lookup',
  path: '/mac-adrdress-lookup',
  description: 'Find the vendor and manufacturer of a device by its MAC address.',
  keywords: ['mac', 'adrdress', 'lookup', 'vendor', 'parser', 'manufacturer'],
  component: () => import('./mac-address-lookup.vue'),
  icon: Devices,
  createdAt: new Date('2023-04-06'),
});
