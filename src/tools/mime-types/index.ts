import { IconWorld } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.mime-types.title'),
  path: '/mime-types',
  description: translate('tools.mime-types.description'),
  keywords: ['mime', 'types', 'extension', 'content', 'type'],
  component: () => import('./mime-types.vue'),
  icon: IconWorld,
});
