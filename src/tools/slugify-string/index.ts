import { AbcRound } from '@vicons/material';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.slugify-string.title'),
  path: '/slugify-string',
  description: translate('tools.slugify-string.description'),
  keywords: ['slugify', 'string', 'escape', 'emoji', 'special', 'character', 'space', 'trim'],
  component: () => import('./slugify-string.vue'),
  icon: AbcRound,
});
