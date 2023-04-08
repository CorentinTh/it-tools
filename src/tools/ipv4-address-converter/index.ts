import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Ipv4 address converter',
  path: '/ipv4-address-converter',
  description: 'Convert an ip address into decimal, binary, hexadecimal or event in ipv6',
  keywords: ['ipv4', 'address', 'converter', 'decimal', 'hexadecimal', 'binary', 'ipv6'],
  component: () => import('./ipv4-address-converter.vue'),
  icon: Binary,
  createdAt: new Date('2023-04-08'),
});
