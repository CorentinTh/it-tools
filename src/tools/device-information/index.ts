import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Device information',
  path: '/device-information',
  description: 'Get information about your current device (screen size, pixel-ratio, user agent, ...)',
  keywords: [
    'device',
    'information',
    'screen',
    'pixel',
    'ratio',
    'status',
    'data',
    'computer',
    'size',
    'user',
    'agent',
  ],
  component: () => import('./device-information.vue'),
  icon: DeviceDesktop,
});
