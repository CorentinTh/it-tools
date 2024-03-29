import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-javascript.title'),
  path: '/json-to-javascript',
  description: translate('tools.json-to-javascript.description'),
  keywords: ['json', 'to', 'javascript'],
  component: () => import('./json-to-javascript.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-29'),
});
