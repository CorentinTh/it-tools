import { Search } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.smart-text-replacer.title'),
  path: '/smart-text-replacer',
  description: translate('tools.smart-text-replacer.description'),
  keywords: ['smart', 'text-replacer', 'search', 'replace'],
  component: () => import('./smart-text-replacer.vue'),
  icon: Search,
  createdAt: new Date('2024-04-03'),
});
