import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.json-minify.title'),
  path: '/json-minify',
  description: t('tools.json-minify.description'),
  keywords: ['json', 'minify', 'format'],
  component: () => import('./json-minify.vue'),
  icon: Braces,
});
