import { IconBrandSpeedtest } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.benchmark-builder.title'),
  path: '/benchmark-builder',
  description: translate('tools.benchmark-builder.description'),
  keywords: ['benchmark', 'builder', 'execution', 'duration', 'mean', 'variance'],
  component: () => import('./benchmark-builder.vue'),
  icon: IconBrandSpeedtest,
  createdAt: new Date('2023-04-05'),
});
