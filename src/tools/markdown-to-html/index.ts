import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.markdown-to-html.title'),
  path: '/markdown-to-html',
  description: translate('tools.markdown-to-html.description'),
  keywords: ['markdown', 'html', 'converter', 'pdf'],
  component: () => import('./markdown-to-html.vue'),
  icon: Markdown,
  createdAt: new Date('2024-08-25'),
});
