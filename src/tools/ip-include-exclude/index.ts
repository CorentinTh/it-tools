import { UnfoldMoreOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'IP Subnets Exclude Calculator',
  path: '/ip-include-exclude',
  description: 'Substract a disallowed IP Ranges/Mask/CIDR list from an allowed IP Ranges/Mask/CIDR list',
  keywords: ['ip', 'allowed', 'disallowed', 'include', 'exclude', 'subnet', 'cidr'],
  component: () => import('./ip-include-exclude.vue'),
  icon: UnfoldMoreOutlined,
  createdAt: new Date('2024-08-15'),
});
