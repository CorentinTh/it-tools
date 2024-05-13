import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-go.title'),
  path: '/json-to-go',
  description: translate('tools.json-to-go.description'),
  keywords: ['json', 'parse', 'go', 'convert', 'transform'],
  component: () => import('./json-to-go.vue'),
  icon: Braces,
  createdAt: new Date('2023-11-08'),
});
