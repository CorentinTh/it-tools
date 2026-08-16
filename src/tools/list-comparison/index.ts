import { List } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.list-comparison.title'),
  path: '/list-comparison',
  description: translate('tools.list-comparison.description'),
  keywords: ['list', 'compare', 'set', 'multiset', 'duplicates', 'ordered', 'lcs'],
  component: () => import('./list-comparison.vue'),
  icon: List,
});
