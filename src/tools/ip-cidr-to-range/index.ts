import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ipv4/6 CIDR to IP Range Calculator',
  path: '/ip-cidr-to-range',
  description: 'Calculate IP Range from a CIDR (IPv4/6)',
  keywords: ['ipv4', 'ipv6', 'cidr'],
  component: () => import('./ip-cidr-to-range.vue'),
  icon: Binary,
  createdAt: new Date('2024-01-10'),
});
