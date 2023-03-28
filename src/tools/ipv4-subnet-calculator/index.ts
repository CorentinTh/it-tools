import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv4 subnet calculator',
  path: '/ipv4-subnet-calculator',
  description: 'Parse your IPv4 CIDR blocks and get all the info you need about your sub network.',
  keywords: ['ipv4', 'subnet', 'calculator', 'mask', 'network', 'cidr', 'netmask', 'bitmask', 'broadcast', 'address'],
  component: () => import('./ipv4-subnet-calculator.vue'),
  icon: RouterOutlined,
});
