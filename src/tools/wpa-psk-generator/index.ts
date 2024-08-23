import { Wifi } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'WPA PSK generator',
  path: '/wpa-psk-generator',
  description: 'WPA Pre-shared Key Generator to convert a WPA passphrase and SSID to the 256-bit pre-shared ("raw") key',
  keywords: ['wpa', 'psk', 'pre', 'shared', 'key', 'ssid', 'passphrase', 'generator'],
  component: () => import('./wpa-psk-generator.vue'),
  icon: Wifi,
  createdAt: new Date('2024-08-15'),
});
