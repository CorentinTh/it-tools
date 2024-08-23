import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Integers to IPv4/IPv6',
  path: '/integers-to-ip',
  description: 'Convert integers to IP',
  keywords: ['integers', 'ip', 'ipv4', 'ipv6'],
  component: () => import('./integers-to-ip.vue'),
  icon: Binary,
  createdAt: new Date('2024-07-14'),
});
