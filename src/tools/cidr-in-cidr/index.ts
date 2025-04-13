import { UnfoldMoreOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IPv4-6/IPRange/CIDR in IPRange/CIDR/IPMask',
  path: '/cidr-in-cidr',
  description: 'Given a CIDR/IP Range/Wildcard IP/IP Mask, tell if a given IPv4-6/Range/CIDR/Wildcard IP/IP Mask is in subnet range',
  keywords: ['ip', 'cidr', 'range', 'mask', 'wildcard', 'ipv4', 'ipv6', 'subnet', 'include', 'inclusion'],
  component: () => import('./cidr-in-cidr.vue'),
  redirectFrom: ['/ip-in-range'],
  icon: UnfoldMoreOutlined,
  createdAt: new Date('2025-01-12'),
});
