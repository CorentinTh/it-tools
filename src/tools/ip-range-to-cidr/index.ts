import { Binary } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv4/6 Range to CIDR(s) Calculator',
  path: '/ip-range-to-cidr',
  description: 'Calculate CIDR(s) from an IP Range (IPv4/6)',
  keywords: ['ip', 'range', 'to', 'cidr'],
  component: () => import('./ip-range-to-cidr.vue'),
  icon: Binary,
  createdAt: new Date('2024-01-10'),
});
