import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MAC Address Converter',
  path: '/mac-address-converter',
  description: 'Change the format of a MAC address and chose between different formats (EUI-48, EUI-64, IPv6)',
  keywords: [
    'converter',
    'mac',
    'address',
    'format',
    'link-local',
    'ipv6',
    'eui-48',
    'eui-64',
  ],
  component: () => import('./mac-address-converter.vue'),
  icon: Devices,
});
