import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.markdown-diff.title'),
  path: '/markdown-diff',
  description: translate('tools.markdown-diff.description'),
  keywords: ['markdown', 'diff', 'compare', 'difference', 'markdown diff', 'md', 'text'],
  component: () => import('./markdown-diff.vue'),
  icon: Markdown,
  createdAt: new Date('2026-05-21'),
});
