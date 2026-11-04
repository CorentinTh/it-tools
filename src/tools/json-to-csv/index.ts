import { List } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.json-to-csv.title'),
  path: '/json-to-csv',
  description: translate('tools.json-to-csv.description'),
  keywords: ['json', 'to', 'csv', 'convert'],
  component: () => import('./json-to-csv.vue'),
  icon: List,
  createdAt: new Date('2023-06-18'),
});
