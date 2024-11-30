import { IconArrowsMoveVertical } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.ipv4-range-expander.title'),
  path: '/ipv4-range-expander',
  description: translate('tools.ipv4-range-expander.description'),
  keywords: ['ipv4', 'range', 'expander', 'subnet', 'creator', 'cidr'],
  component: () => import('./ipv4-range-expander.vue'),
  icon: IconArrowsMoveVertical,
  createdAt: new Date('2023-04-19'),
});
