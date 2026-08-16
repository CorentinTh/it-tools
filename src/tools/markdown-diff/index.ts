import { FileDiff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Text',
  order: 5,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.markdown-diff.title'),
  path: '/markdown-diff',
  description: translate('tools.markdown-diff.description'),
  keywords: ['markdown', 'md', 'diff', 'compare', 'line', 'word', 'preview'],
  component: () => import('./markdown-diff.vue'),
  icon: FileDiff,
});
