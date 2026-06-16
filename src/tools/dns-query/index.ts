import { World } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.dns-query.title'),
  path: '/dns-query',
  description: translate('tools.dns-query.description'),
  keywords: ['dns', 'query', 'lookup', 'resolve', 'domain', 'A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'network', 'devops'],
  component: () => import('./dns-query.vue'),
  icon: World,
  createdAt: new Date('2026-06-12'),
});
