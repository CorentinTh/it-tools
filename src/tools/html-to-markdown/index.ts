import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.html-to-markdown.title'),
  path: '/html-to-markdown',
  description: translate('tools.html-to-markdown.description'),
  keywords: ['html', 'markdown', 'converter', 'turndown', 'markup'],
  component: () => import('./html-to-markdown.vue'),
  icon: Markdown,
  createdAt: new Date('2026-06-04'),
});
