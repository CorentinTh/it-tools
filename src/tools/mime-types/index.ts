import { World } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.mime-types.title'),
  path: '/mime-types',
  description: translate('tools.mime-types.description'),
  keywords: ['mime', 'types', 'extension', 'content', 'type'],
  component: () => import('./mime-types.vue'),
  icon: World,
});
