import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-object.title'),
  path: '/json-to-object',
  description: translate('tools.json-to-object.description'),
  keywords: ['json', 'parse', 'object', 'convert', 'transform'],
  component: () => import('./json-to-object.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-16'),
});
