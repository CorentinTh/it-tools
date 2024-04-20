import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ipv6 address converter',
  path: '/ipv6-address-converter',
  description: 'Convert an ip address into decimal, binary, hexadecimal and get infos',
  keywords: ['ipv6', 'address', 'converter', 'decimal', 'hexadecimal', 'binary', 'ipv4'],
  component: () => import('./ipv6-address-converter.vue'),
  icon: Binary,
  createdAt: new Date('2024-01-10'),
});
