import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ipv6-subnet-calculator.title'),
  path: '/ipv6-subnet-calculator',
  description: translate('tools.ipv6-subnet-calculator.description'),
  keywords: ['ipv6', 'subnet', 'calculator', 'mask', 'network', 'cidr', 'netmask', 'bitmask', 'broadcast', 'address'],
  component: () => import('./ipv6-subnet-calculator.vue'),
  icon: RouterOutlined,
});
