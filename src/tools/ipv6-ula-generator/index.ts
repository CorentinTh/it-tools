import { BuildingFactory } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.ipv6-ula-generator.title'),
  path: '/ipv6-ula-generator',
  description: t('tools.ipv6-ula-generator.description'),
  keywords: ['ipv6', 'ula', 'generator', 'rfc4193', 'network', 'private'],
  component: () => import('./ipv6-ula-generator.vue'),
  icon: BuildingFactory,
  createdAt: new Date('2023-04-09'),
});
