import { Binary } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.ipv4-address-converter.title'),
  path: '/ipv4-address-converter',
  description: translate('tools.ipv4-address-converter.description'),
  keywords: ['ipv4', 'address', 'converter', 'decimal', 'hexadecimal', 'binary', 'ipv6'],
  component: () => import('./ipv4-address-converter.vue'),
  icon: Binary,
  createdAt: new Date('2023-04-08'),
});
