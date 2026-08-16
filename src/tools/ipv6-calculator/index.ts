import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Network',
  order: 3,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.ipv6-calculator.title'),
  path: '/ipv6-calculator',
  description: translate('tools.ipv6-calculator.description'),
  keywords: ['ipv6', 'cidr', 'subnet', 'network', 'range', 'compress', 'expand', 'membership', 'bigint'],
  component: () => import('./ipv6-calculator.vue'),
  icon: RouterOutlined,
});
