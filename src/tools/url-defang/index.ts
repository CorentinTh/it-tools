import { Unlink } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.url-defang.title'),
  path: '/url-defang',
  description: translate('tools.url-defang.description'),
  keywords: ['url', 'defang'],
  component: () => import('./url-defang.vue'),
  icon: Unlink,
});
