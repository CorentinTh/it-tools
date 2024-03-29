import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.javascript-to-json.title'),
  path: '/javascript-to-json',
  description: translate('tools.javascript-to-json.description'),
  keywords: ['javascript', 'to', 'json'],
  component: () => import('./javascript-to-json.vue'),
  icon: Braces,
  createdAt: new Date('2024-03-29'),
});
