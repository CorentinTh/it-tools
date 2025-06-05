import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.markdown-to-word.title'),
  path: '/markdown-to-word',
  description: translate('tools.markdown-to-word.description'),
  keywords: ['markdown', 'word', 'docx', 'converter'],
  component: () => import('./markdown-to-word.vue'),
  icon: Markdown,
  createdAt: new Date('2024-08-25'),
});