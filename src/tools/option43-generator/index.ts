import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Option43 generator',
  path: '/option43-generator',
  description: 'Generate Option43 Wifi DHCP configuration',
  keywords: ['option43', 'wifi', 'dhcp', 'generator'],
  component: () => import('./option43-generator.vue'),
  icon: RouterOutlined,
  createdAt: new Date('2024-03-09'),
});
