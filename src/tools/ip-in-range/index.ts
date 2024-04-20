import { UnfoldMoreOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IP in Range/CIDR/Mask',
  path: '/ip-in-range',
  description: 'Given a CIDR/IP Range/Wildcard IP/IP Mask, tell if a given IP is in subnet range',
  keywords: ['ip', 'cidr', 'range'],
  component: () => import('./ip-in-range.vue'),
  icon: UnfoldMoreOutlined,
  createdAt: new Date('2024-03-09'),
});
