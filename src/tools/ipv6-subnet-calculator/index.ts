import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ipv6 subnet calculator',
  path: '/ipv6-subnet-calculator',
  description: 'Parse your IPv6 CIDR blocks and get all the info you need about your sub network.',
  keywords: ['ipv6', 'subnet', 'calculator', 'mask', 'network', 'cidr', 'netmask', 'bitmask', 'broadcast', 'address'],
  component: () => import('./ipv6-subnet-calculator.vue'),
  icon: RouterOutlined,
  createdAt: new Date('2024-02-25'),
});
