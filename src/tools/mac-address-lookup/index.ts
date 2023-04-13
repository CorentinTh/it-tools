import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MAC address lookup',
  path: '/mac-address-lookup',
  description: 'Find the vendor and manufacturer of a device by its MAC address.',
  keywords: ['mac', 'address', 'lookup', 'vendor', 'parser', 'manufacturer'],
  component: () => import('./mac-address-lookup.vue'),
  icon: Devices,
  createdAt: new Date('2023-04-06'),
});
