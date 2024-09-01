import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.xml-formatter.title'),
  path: '/xml-formatter',
  description: translate('tools.xml-formatter.description'),
  keywords: ['xml', 'prettify', 'format'],
  component: () => import('./xml-formatter.vue'),
  icon: Code,
  createdAt: new Date('2023-06-17'),
});
