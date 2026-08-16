import { RouterOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Network',
  order: 5,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.dns-over-https-query.title'),
  path: '/dns-over-https-query',
  description: translate('tools.dns-over-https-query.description'),
  keywords: ['dns', 'doh', 'https', 'resolver', 'record', 'a', 'aaaa', 'cname', 'mx', 'txt', 'ns', 'soa', 'ptr', 'srv', 'caa'],
  component: () => import('./dns-over-https-query.vue'),
  icon: RouterOutlined,
});
