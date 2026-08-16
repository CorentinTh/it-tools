import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Network',
  order: 4,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.network-calculation-suite.title'),
  path: '/network-calculation-suite',
  description: translate('tools.network-calculation-suite.description'),
  keywords: ['network', 'ipv4', 'ipv6', 'cidr', 'exclude', 'dhcp', 'option 43', 'port', 'ttl'],
  component: () => import('./network-calculation-suite.vue'),
  icon: RouterOutlined,
});
