import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Mac address converter',
  path: '/mac-address-converter',
  description: 'Change the format of a MAC address and chose between different formats',
  keywords: [
    'converter',
    'mac',
    'address',
    'format'
  ],
  component: () => import('./mac-address-converter.vue'),
  icon: Devices,
});
