import { Api } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv6 subnet calculator',
  path: '/ipv6-subnet-calculator',
  description: 'Expand, compress and dissect IPv6 addresses: network bounds, address count, netmask and address type',
  keywords: ['ipv6', 'subnet', 'cidr', 'calculator', 'network', 'address', 'prefix'],
  component: () => import('./ipv6-subnet-calculator.vue'),
  icon: Api,
  createdAt: new Date('2026-10-01'),
});
