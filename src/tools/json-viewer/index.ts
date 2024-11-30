import { IconBraces } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-prettify.title'),
  path: '/json-prettify',
  description: translate('tools.json-prettify.description'),
  keywords: ['json', 'viewer', 'prettify', 'format'],
  component: () => import('./json-viewer.vue'),
  icon: IconBraces,
  redirectFrom: ['/json-viewer'],
});
