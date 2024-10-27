import { IconBraces } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-minify.title'),
  path: '/json-minify',
  description: translate('tools.json-minify.description'),
  keywords: ['json', 'minify', 'format'],
  component: () => import('./json-minify.vue'),
  icon: IconBraces,
});
